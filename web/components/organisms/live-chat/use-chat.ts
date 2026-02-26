"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  ChatMessage,
  sendChatMessage,
  getChatMessages,
  createChatSession,
  updateChatSession,
  getChatSession,
} from "@lib/api/chat";

export function useChat() {
  const [sessionId, setSessionId] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState<string>("");
  const [sessionClosed, setSessionClosed] = useState(false);
  const wasClosedRef = useRef(false);

  const initRef = useRef(false);

  // Initialize session only when chat is first opened
  useEffect(() => {
    if (!isOpen || initRef.current) return;
    initRef.current = true;

    const init = async () => {
      let storedSessionId = localStorage.getItem("chat_session_id");
      const storedUserName = localStorage.getItem("chat_user_name") || "";
      setUserName(storedUserName);

      if (storedSessionId) {
        // Check if existing session is still active
        try {
          const session = await getChatSession(storedSessionId);
          if (!session || session.status === "closed") {
            // Session not found or closed - clear and start fresh
            localStorage.removeItem("chat_session_id");
            localStorage.removeItem("chat_user_name");
            storedSessionId = null;
            setUserName("");
          }
        } catch {
          // If can't fetch, clear stale session and start fresh
          localStorage.removeItem("chat_session_id");
          localStorage.removeItem("chat_user_name");
          storedSessionId = null;
          setUserName("");
        }
      }

      if (!storedSessionId) {
        storedSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem("chat_session_id", storedSessionId);
        await createChatSession({ sessionId: storedSessionId }).catch(console.error);
      }

      setSessionId(storedSessionId);
    };

    init();
  }, [isOpen]);

  const loadMessages = useCallback(async () => {
    if (!sessionId) return;
    try {
      const msgs = await getChatMessages(sessionId);
      setMessages(msgs);
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  }, [sessionId]);

  // Poll messages + check session status when chat is open
  useEffect(() => {
    if (!isOpen || !sessionId) return;

    const poll = async () => {
      // Load messages
      await loadMessages();

      // Check session status
      try {
        const session = await getChatSession(sessionId);
        if (session?.status === "closed" && !wasClosedRef.current) {
          wasClosedRef.current = true;
          setSessionClosed(true);
        }
      } catch {}
    };

    poll();
    const interval = setInterval(poll, 3000);
    return () => clearInterval(interval);
  }, [isOpen, sessionId, loadMessages]);

  const sendMessage = async (message: string) => {
    if (!message.trim() || !sessionId || sessionClosed) return;

    setIsLoading(true);
    try {
      const sender = userName || "ผู้ใช้";
      await sendChatMessage({
        message: message.trim(),
        sender,
        senderType: "user",
        sessionId,
      });
      await updateChatSession(sessionId, { lastMessageAt: new Date().toISOString() });
      await loadMessages();
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const startNewSession = () => {
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    // Clear state first to stop polling on old session
    setMessages([]);
    setSessionClosed(false);
    setUserName("");
    wasClosedRef.current = false;
    initRef.current = false;
    // Update localStorage
    localStorage.removeItem("chat_session_id");
    localStorage.removeItem("chat_user_name");
    localStorage.setItem("chat_session_id", newSessionId);
    // Set new session and create in backend
    setSessionId(newSessionId);
    createChatSession({ sessionId: newSessionId }).catch(console.error);
  };

  const setName = (name: string) => {
    setUserName(name);
    localStorage.setItem("chat_user_name", name);
    // Update userName in Strapi session so Admin can see who they're chatting with
    if (sessionId) {
      updateChatSession(sessionId, { userName: name }).catch(console.error);
    }
  };

  return {
    sessionId,
    messages,
    isLoading,
    isOpen,
    setIsOpen,
    sendMessage,
    userName,
    setUserName: setName,
    sessionClosed,
    startNewSession,
  };
}
