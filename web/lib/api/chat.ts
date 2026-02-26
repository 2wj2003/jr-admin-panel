import { getApiUrl } from "./get-url";

export interface ChatMessage {
  id: number;
  message: string;
  sender: string;
  senderType: "user" | "admin";
  sessionId: string;
  isRead: boolean;
  createdAt: string;
}

export interface ChatSession {
  id: number;
  sessionId: string;
  userName?: string;
  userEmail?: string;
  status: "active" | "closed";
  lastMessageAt?: string;
}

export async function createChatSession(data: {
  sessionId: string;
  userName?: string;
  userEmail?: string;
}): Promise<ChatSession> {
  const url = `${getApiUrl()}/api/chat-sessions`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data }),
  });

  if (!response.ok) {
    throw new Error("Failed to create chat session");
  }

  const result = await response.json();
  const item = result.data;
  return {
    id: item.id,
    sessionId: item.attributes?.sessionId || item.sessionId,
    userName: item.attributes?.userName || item.userName,
    userEmail: item.attributes?.userEmail || item.userEmail,
    status: item.attributes?.status || item.status,
    lastMessageAt: item.attributes?.lastMessageAt || item.lastMessageAt,
  };
}

export async function sendChatMessage(data: {
  message: string;
  sender: string;
  senderType: "user" | "admin";
  sessionId: string;
}): Promise<ChatMessage> {
  const url = `${getApiUrl()}/api/chat-messages`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data }),
  });

  if (!response.ok) {
    throw new Error("Failed to send message");
  }

  const result = await response.json();
  const item = result.data;
  return {
    id: item.id,
    message: item.attributes?.message || item.message,
    sender: item.attributes?.sender || item.sender,
    senderType: item.attributes?.senderType || item.senderType,
    sessionId: item.attributes?.sessionId || item.sessionId,
    isRead: item.attributes?.isRead || item.isRead || false,
    createdAt: item.attributes?.createdAt || item.createdAt,
  };
}

export async function getChatMessages(sessionId: string): Promise<ChatMessage[]> {
  const url = `${getApiUrl()}/api/chat-messages?filters[sessionId][$eq]=${sessionId}&sort=createdAt:asc&pagination[pageSize]=100`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch messages");
  }

  const result = await response.json();
  
  // Transform Strapi response format to flat ChatMessage objects
  return result.data.map((item: any) => ({
    id: item.id,
    message: item.attributes?.message || item.message,
    sender: item.attributes?.sender || item.sender,
    senderType: item.attributes?.senderType || item.senderType,
    sessionId: item.attributes?.sessionId || item.sessionId,
    isRead: item.attributes?.isRead || item.isRead || false,
    createdAt: item.attributes?.createdAt || item.createdAt,
  }));
}

export async function getChatSession(sessionId: string): Promise<ChatSession | null> {
  const url = `${getApiUrl()}/api/chat-sessions?filters[sessionId][$eq]=${sessionId}`;
  const response = await fetch(url);
  if (!response.ok) return null;
  const result = await response.json();
  if (!result.data || result.data.length === 0) return null;
  const item = result.data[0];
  return {
    id: item.id,
    sessionId: item.attributes?.sessionId || item.sessionId,
    userName: item.attributes?.userName || item.userName,
    userEmail: item.attributes?.userEmail || item.userEmail,
    status: item.attributes?.status || item.status || "active",
    lastMessageAt: item.attributes?.lastMessageAt || item.lastMessageAt,
  };
}

export async function updateChatSession(
  sessionId: string,
  data: { lastMessageAt?: string; status?: "active" | "closed"; userName?: string }
): Promise<void> {
  const url = `${getApiUrl()}/api/chat-sessions?filters[sessionId][$eq]=${sessionId}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to find session");
  }

  const result = await response.json();
  if (result.data.length === 0) return;

  const session = result.data[0];
  const updateUrl = `${getApiUrl()}/api/chat-sessions/${session.id}`;
  await fetch(updateUrl, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data }),
  });
}
