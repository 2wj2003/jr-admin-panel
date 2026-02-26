"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchCollection, StrapiEntity } from "@/lib/strapi";
import { ArrowLeft, Send, User, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import dayjs from "dayjs";
import { api } from "@/lib/api";

interface ChatMessage {
  id: number;
  message: string;
  sender: string;
  senderType: "user" | "admin";
  sessionId: string;
  isRead: boolean;
  createdAt: string;
}

export default function ChatConversationPage({
  params,
}: {
  params: { sessionId: string };
}) {
  const router = useRouter();
  const [messages, setMessages] = useState<StrapiEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputMessage, setInputMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sessionClosed, setSessionClosed] = useState(false);
  const [userName, setUserName] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadSessionInfo = useCallback(async () => {
    try {
      const response = await api.get(
        `/content-manager/collection-types/api::chat-session.chat-session?filters[sessionId][$eq]=${params.sessionId}`
      );
      const results = response.data?.results || response.data?.data || [];
      if (results.length > 0) {
        const session = results[0];
        const name = session.attributes?.userName ?? session.userName ?? "";
        setUserName(name);
        const status = session.attributes?.status ?? session.status;
        if (status === "closed") setSessionClosed(true);
      }
    } catch (error) {
      console.error("Failed to load session info:", error);
    }
  }, [params.sessionId]);

  const loadMessages = useCallback(async () => {
    try {
      const response = await api.get(
        `/content-manager/collection-types/api::chat-message.chat-message?filters[sessionId][$eq]=${params.sessionId}&sort=createdAt:asc&pagination[pageSize]=100`
      );
      const results = response.data?.results || response.data?.data || [];
      // Normalize to flat ChatMessage format
      const normalized: ChatMessage[] = results.map((item: any) => ({
        id: item.id,
        message: item.attributes?.message ?? item.message,
        sender: item.attributes?.sender ?? item.sender,
        senderType: item.attributes?.senderType ?? item.senderType,
        sessionId: item.attributes?.sessionId ?? item.sessionId,
        isRead: item.attributes?.isRead ?? item.isRead ?? false,
        createdAt: item.attributes?.createdAt ?? item.createdAt,
      }));
      setMessages(normalized as any);
    } catch (error) {
      console.error("Failed to load messages:", error);
    } finally {
      setLoading(false);
    }
  }, [params.sessionId]);

  useEffect(() => {
    loadSessionInfo();
    loadMessages();
    const interval = setInterval(loadMessages, 2000);
    return () => clearInterval(interval);
  }, [loadMessages, loadSessionInfo]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleCloseSession = async () => {
    try {
      const sessionResponse = await api.get(
        `/content-manager/collection-types/api::chat-session.chat-session?filters[sessionId][$eq]=${params.sessionId}`
      );
      const results = sessionResponse.data?.results || sessionResponse.data?.data || [];
      if (results.length > 0) {
        const sessionRecordId = results[0].id;
        await api.put(
          `/content-manager/collection-types/api::chat-session.chat-session/${sessionRecordId}`,
          { status: "closed" }
        );
      }
      setSessionClosed(true);
      toast.success("ปิดการสนทนาแล้ว");
    } catch (error) {
      console.error("Failed to close session:", error);
      toast.error("ไม่สามารถปิดการสนทนาได้");
    }
  };

  const handleSend = async () => {
    if (!inputMessage.trim() || sending) return;

    setSending(true);
    try {
      // Send message via Content Manager API (uses Admin JWT)
      await api.post(
        "/content-manager/collection-types/api::chat-message.chat-message",
        {
          message: inputMessage.trim(),
          sender: "Admin",
          senderType: "admin",
          sessionId: params.sessionId,
        }
      );

      // Update session lastMessageAt via Content Manager API
      try {
        const sessionResponse = await api.get(
          `/content-manager/collection-types/api::chat-session.chat-session?filters[sessionId][$eq]=${params.sessionId}`
        );
        const results = sessionResponse.data?.results || sessionResponse.data?.data || [];
        if (results.length > 0) {
          const sessionRecordId = results[0].id;
          await api.put(
            `/content-manager/collection-types/api::chat-session.chat-session/${sessionRecordId}`,
            { lastMessageAt: new Date().toISOString() }
          );
        }
      } catch (updateError) {
        console.error("Failed to update session:", updateError);
      }

      setInputMessage("");
      await loadMessages();
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("ไม่สามารถส่งข้อความได้");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.push("/chats")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">
            {userName ? `การสนทนากับ ${userName}` : "การสนทนา"}
          </h1>
          <p className="text-muted-foreground mt-1">Session: {params.sessionId}</p>
        </div>
        {!sessionClosed && (
          <Button variant="destructive" onClick={handleCloseSession}>
            <XCircle className="h-4 w-4 mr-2" />
            ปิดการสนทนา
          </Button>
        )}
        {sessionClosed && (
          <span className="text-sm text-muted-foreground bg-gray-100 px-3 py-1.5 rounded-full">ปิดแล้ว</span>
        )}
      </div>

      <Card className="h-[calc(100vh-250px)] flex flex-col">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {userName ? (
              <span>แชทกับ <span className="text-blue-600">{userName}</span></span>
            ) : (
              "แชทกับลูกค้า"
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                กำลังโหลด...
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                ยังไม่มีข้อความ
              </div>
            ) : (
              messages.map((msg) => {
                const attrs = msg.attributes || msg;
                return (
                  <div
                    key={msg.id}
                    className={`flex ${
                      attrs.senderType === "admin" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${
                        attrs.senderType === "admin"
                          ? "bg-blue-600 text-white rounded-br-sm"
                          : "bg-white text-gray-800 shadow-sm rounded-bl-sm"
                      }`}
                    >
                      {attrs.senderType === "user" && (
                        <p className="text-xs font-medium text-blue-600 mb-1">
                          {attrs.sender}
                        </p>
                      )}
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {attrs.message}
                      </p>
                      <p
                        className={`text-xs mt-1 ${
                          attrs.senderType === "admin"
                            ? "text-blue-100"
                            : "text-gray-400"
                        }`}
                      >
                        {dayjs(attrs.createdAt).format("HH:mm")}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input / Closed Banner */}
          {sessionClosed ? (
            <div className="p-4 bg-white border-t">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center text-sm text-muted-foreground">
                การสนทนานี้ถูกปิดแล้ว
              </div>
            </div>
          ) : (
            <div className="p-4 bg-white border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="พิมพ์ข้อความ..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && !sending && handleSend()}
                  disabled={sending}
                  className="flex-1"
                />
                <Button
                  onClick={handleSend}
                  disabled={sending || !inputMessage.trim()}
                >
                  <Send className="h-4 w-4 mr-1" />
                  ส่ง
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
