"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchCollection, StrapiEntity } from "@/lib/strapi";
import { MessageSquare, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

interface ChatSession {
  id: number;
  sessionId: string;
  userName?: string;
  userEmail?: string;
  status: "active" | "closed";
  lastMessageAt?: string;
  createdAt: string;
}

export default function ChatsPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<StrapiEntity[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSessions = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchCollection("chat-sessions", {
        filters: { status: { $eq: "active" } },
        sort: ["lastMessageAt:desc", "createdAt:desc"],
        pagination: { page: 1, pageSize: 50 },
      });
      setSessions(result.data);
    } catch (error) {
      console.error("Failed to load chat sessions:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSessions();
    const interval = setInterval(loadSessions, 5000);
    return () => clearInterval(interval);
  }, [loadSessions]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">การสนทนาแชท</h1>
          <p className="text-muted-foreground mt-1">
            จัดการการสนทนากับลูกค้า
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>รายการแชทที่กำลังดำเนินการ ({sessions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              กำลังโหลด...
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              ไม่มีการสนทนาที่กำลังดำเนินการ
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ผู้ใช้</TableHead>
                  <TableHead>อีเมล</TableHead>
                  <TableHead>ข้อความล่าสุด</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead className="text-right">จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((session) => {
                  const attrs = session.attributes || session;
                  return (
                    <TableRow key={session.id}>
                      <TableCell className="font-medium">
                        {attrs.userName || "ผู้ใช้ไม่ระบุชื่อ"}
                      </TableCell>
                      <TableCell>
                        {attrs.userEmail || (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {attrs.lastMessageAt
                            ? dayjs(attrs.lastMessageAt).format("DD/MM/YYYY HH:mm")
                            : dayjs(attrs.createdAt).format("DD/MM/YYYY HH:mm")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          {attrs.status === "active" ? "กำลังดำเนินการ" : "ปิดแล้ว"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          onClick={() => { window.location.href = `/chats/${attrs.sessionId}`; }}
                        >
                          <MessageSquare className="h-4 w-4 mr-1" />
                          เปิดแชท
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
