"use client";

import { useState, useRef, useEffect } from "react";
import { IoClose, IoSend, IoPerson, IoChatbubbleEllipses } from "react-icons/io5";
import { ChatMessage } from "@lib/api/chat";

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  userName: string;
  onSetUserName: (name: string) => void;
  sessionClosed?: boolean;
  onStartNewSession?: () => void;
}

export function ChatWindow({
  isOpen,
  onClose,
  messages,
  onSendMessage,
  isLoading,
  userName,
  onSetUserName,
  sessionClosed = false,
  onStartNewSession,
}: ChatWindowProps) {
  const [inputMessage, setInputMessage] = useState("");
  const [showNameInput, setShowNameInput] = useState(!userName);
  const [tempName, setTempName] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Reset name input screen when session resets (userName cleared)
  useEffect(() => {
    if (!userName) {
      setShowNameInput(true);
      setTempName("");
      setInputMessage("");
    }
  }, [userName]);

  const handleSend = () => {
    if (inputMessage.trim()) {
      onSendMessage(inputMessage);
      setInputMessage("");
    }
  };

  const handleSetName = () => {
    if (tempName.trim()) {
      onSetUserName(tempName.trim());
      setShowNameInput(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-4 md:right-6 w-[90vw] md:w-96 h-[600px] max-h-[80vh] bg-white rounded-2xl shadow-2xl flex flex-col z-50 animate-in slide-in-from-bottom-5 duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <IoChatbubbleEllipses className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">แชทกับเรา</h3>
            <p className="text-xs text-blue-100">ออนไลน์ • ตอบกลับภายใน 5 นาที</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
          aria-label="ปิดแชท"
        >
          <IoClose className="w-5 h-5" />
        </button>
      </div>

      {/* Name Input Screen */}
      {showNameInput ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-blue-50 to-white">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
            <IoPerson className="w-12 h-12 text-blue-600" />
          </div>
          <h4 className="text-xl font-semibold text-gray-800 mb-2">ยินดีต้อนรับ!</h4>
          <p className="text-gray-600 text-center mb-6">กรุณาแนะนำตัวเพื่อเริ่มการสนทนา</p>
          <div className="w-full max-w-xs space-y-3">
            <input
              type="text"
              placeholder="ชื่อของคุณ"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSetName()}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
              autoFocus
            />
            <button
              onClick={handleSetName}
              disabled={!tempName.trim()}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              เริ่มแชท
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <IoChatbubbleEllipses className="w-10 h-10 text-blue-600" />
                </div>
                <p className="text-gray-600 font-medium">ยังไม่มีการสนทนา</p>
                <p className="text-gray-400 text-sm mt-1">ส่งข้อความเพื่อเริ่มการสนทนา</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.senderType === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                      msg.senderType === "user"
                        ? "bg-blue-600 text-white rounded-br-sm"
                        : "bg-white text-gray-800 shadow-sm rounded-bl-sm"
                    }`}
                  >
                    {msg.senderType === "admin" && (
                      <p className="text-xs font-medium text-blue-600 mb-1">{msg.sender}</p>
                    )}
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                    <p
                      className={`text-xs mt-1 ${
                        msg.senderType === "user" ? "text-blue-100" : "text-gray-400"
                      }`}
                    >
                      {msg.createdAt
                        ? new Date(msg.createdAt).toLocaleTimeString("th-TH", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Session Closed Banner */}
          {sessionClosed ? (
            <div className="p-4 bg-white border-t border-gray-200 rounded-b-2xl">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center space-y-3">
                <p className="text-sm text-gray-500">การสนทนานี้ถูกปิดโดยเจ้าหน้าที่แล้ว</p>
                <button
                  onClick={onStartNewSession}
                  className="w-full bg-blue-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  เริ่มการสนทนาใหม่
                </button>
              </div>
            </div>
          ) : (
            /* Input */
            <div className="p-4 bg-white border-t border-gray-200 rounded-b-2xl">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="พิมพ์ข้อความ..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSend()}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors disabled:bg-gray-100"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !inputMessage.trim()}
                  className="w-12 h-12 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  aria-label="ส่งข้อความ"
                >
                  <IoSend className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
