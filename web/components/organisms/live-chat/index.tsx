"use client";

import { IoChatbubbleEllipses } from "react-icons/io5";
import { ChatWindow } from "./chat-window";
import { useChat } from "./use-chat";

export function LiveChat() {
  const {
    messages,
    isLoading,
    isOpen,
    setIsOpen,
    sendMessage,
    userName,
    setUserName,
    sessionClosed,
    startNewSession,
  } = useChat();

  const unreadAdminMessages = messages.filter(
    (m) => m.senderType === "admin" && !m.isRead
  ).length;

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-4 md:right-6 w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full shadow-2xl hover:shadow-blue-500/50 hover:scale-110 transition-all duration-300 flex items-center justify-center z-40 group"
        aria-label="เปิดแชท"
      >
        <IoChatbubbleEllipses className="w-7 h-7 md:w-8 md:h-8 group-hover:scale-110 transition-transform" />
        {unreadAdminMessages > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadAdminMessages}
          </span>
        )}
      </button>

      {/* Chat Window */}
      <ChatWindow
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        messages={messages}
        onSendMessage={sendMessage}
        isLoading={isLoading}
        userName={userName}
        onSetUserName={setUserName}
        sessionClosed={sessionClosed}
        onStartNewSession={startNewSession}
      />
    </>
  );
}
