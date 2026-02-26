"use client";

import { useAuthStore } from "@/store/auth-store";
import { logout } from "@/lib/auth";
import { LogOut, User, Bell, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useRef, useState } from "react";
import { fetchCollection } from "@/lib/strapi";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

function playNotificationSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();

    const playTone = (frequency: number, startTime: number, duration: number) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, startTime);

      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(1, startTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    };

    // Double ding: high note then slightly lower note
    playTone(1047, ctx.currentTime, 0.25);        // C6
    playTone(784, ctx.currentTime + 0.18, 0.3);   // G5
  } catch (e) {
    // Browser may block AudioContext without user interaction
  }
}

export function Header() {
  const { user } = useAuthStore();
  const router = useRouter();

  // Contact form unread count
  const [contactUnread, setContactUnread] = useState(0);
  // Chat unread count (new user messages not yet replied)
  const [chatUnread, setChatUnread] = useState(0);
  const prevChatUnread = useRef(0);
  const isFirstLoad = useRef(true);

  const loadContactUnread = async () => {
    try {
      const result = await fetchCollection("contact-forms", {
        filters: { status: { $eq: "pending" } },
        pagination: { page: 1, pageSize: 1 },
      });
      setContactUnread(result.meta.pagination.total);
    } catch (error) {
      console.error("Failed to load contact unread:", error);
    }
  };

  const loadChatUnread = async () => {
    try {
      const response = await api.get(
        `/content-manager/collection-types/api::chat-message.chat-message?filters[senderType][$eq]=user&filters[isRead][$eq]=false&pagination[pageSize]=1`
      );
      const total = response.data?.pagination?.total ?? 0;
      setChatUnread(total);

      // Play sound if new messages arrived (not on first load)
      if (!isFirstLoad.current && total > prevChatUnread.current) {
        playNotificationSound();
      }
      prevChatUnread.current = total;
      isFirstLoad.current = false;
    } catch (error) {
      console.error("Failed to load chat unread:", error);
    }
  };

  const markChatAsRead = async () => {
    // Reset badge immediately (optimistic update)
    setChatUnread(0);
    prevChatUnread.current = 0;
    try {
      // Fetch all unread user messages
      const response = await api.get(
        `/content-manager/collection-types/api::chat-message.chat-message?filters[senderType][$eq]=user&filters[isRead][$eq]=false&pagination[pageSize]=100`
      );
      const results = response.data?.results || response.data?.data || [];
      // Mark each as read
      await Promise.all(
        results.map((msg: any) =>
          api.put(
            `/content-manager/collection-types/api::chat-message.chat-message/${msg.id}`,
            { isRead: true }
          )
        )
      );
    } catch (error) {
      console.error("Failed to mark chat as read:", error);
    }
  };

  useEffect(() => {
    loadContactUnread();
    loadChatUnread();
    const contactInterval = setInterval(loadContactUnread, 30000);
    const chatInterval = setInterval(loadChatUnread, 5000);
    return () => {
      clearInterval(contactInterval);
      clearInterval(chatInterval);
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-white px-6">
      <div className="flex flex-1 items-center justify-between">
        <div>
          <h2 className="text-sm text-muted-foreground">
            ยินดีต้อนรับกลับมา
          </h2>
        </div>
        <div className="flex items-center gap-4">
          {/* Chat notification */}
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={async () => { await markChatAsRead(); router.push("/chats"); }}
            title="ข้อความแชทใหม่"
          >
            <MessageSquare className="h-5 w-5" />
            {chatUnread > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-blue-500 hover:bg-blue-500 animate-pulse">
                {chatUnread > 9 ? "9+" : chatUnread}
              </Badge>
            )}
          </Button>

          {/* Contact form notification */}
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => router.push("/contacts")}
            title="ข้อความติดต่อใหม่"
          >
            <Bell className="h-5 w-5" />
            {contactUnread > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 hover:bg-red-500">
                {contactUnread > 9 ? "9+" : contactUnread}
              </Badge>
            )}
          </Button>

          <div className="flex items-center gap-2 text-sm">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <span className="font-medium">
              {user?.username || user?.email || "Admin"}
            </span>
          </div>
          <Button variant="ghost" size="icon" onClick={logout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
