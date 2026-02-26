"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/auth-store";
import { api } from "@/lib/api";
import { User, Server, Database, Shield, Loader2, Settings } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [apiStatus, setApiStatus] = useState<"checking" | "online" | "offline">("checking");

  useEffect(() => {
    async function checkApi() {
      try {
        await api.get("/api/products?pagination[pageSize]=1");
        setApiStatus("online");
      } catch {
        setApiStatus("offline");
      }
    }
    checkApi();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">ตั้งค่า</h1>
        <p className="text-muted-foreground mt-1">
          จัดการการตั้งค่าระบบและข้อมูลทั่วไป
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              ข้อมูลผู้ใช้
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">ชื่อผู้ใช้</span>
              <span className="font-medium">
                {user?.username || user?.email || "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">อีเมล</span>
              <span className="font-medium">{user?.email || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">สิทธิ์</span>
              <Badge variant="default">Admin</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              สถานะระบบ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Strapi API</span>
              {apiStatus === "checking" ? (
                <Badge variant="secondary">กำลังตรวจสอบ...</Badge>
              ) : apiStatus === "online" ? (
                <Badge variant="success">ออนไลน์</Badge>
              ) : (
                <Badge variant="destructive">ออฟไลน์</Badge>
              )}
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">API URL</span>
              <span className="font-mono text-xs">
                {process.env.NEXT_PUBLIC_STRAPI_URL}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Admin Panel</span>
              <span className="font-mono text-xs">v0.1.0</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Backend
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">CMS</span>
              <span className="font-medium">Strapi 4.10.7</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Database</span>
              <span className="font-medium">PostgreSQL</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Hosting</span>
              <span className="font-medium">Railway</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              ความปลอดภัย
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Authentication</span>
              <span className="font-medium">JWT Token</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Session</span>
              <Badge variant="success">Active</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
