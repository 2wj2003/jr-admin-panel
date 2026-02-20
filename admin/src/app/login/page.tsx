"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { loginAdmin, setAuthToken, setAuthUser } from "@/lib/auth";
import { useAuthStore } from "@/store/auth-store";
import { ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("=== LOGIN START ===");
      const { jwt, user } = await loginAdmin(email, password);
      console.log("Got token:", jwt ? jwt.substring(0, 20) + "..." : "NO TOKEN");
      console.log("Got user:", user);

      setAuthToken(jwt);
      setAuthUser(user);
      setAuth(user, jwt);

      console.log("Token saved:", localStorage.getItem("admin_token") ? "YES" : "NO");
      console.log("User saved:", localStorage.getItem("admin_user") ? "YES" : "NO");
      console.log("Redirecting to /");

      window.location.href = "/";
    } catch (err: any) {
      console.error("Login error:", err);
      console.error("Error response:", err?.response?.data);
      console.error("Error status:", err?.response?.status);
      setError(
        err?.response?.data?.error?.message ||
        err?.message ||
        "อีเมลหรือรหัสผ่านไม่ถูกต้อง"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <CardTitle className="text-2xl">JR Admin Panel</CardTitle>
          <CardDescription>
            เข้าสู่ระบบด้วยบัญชี Strapi Admin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">อีเมล</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">รหัสผ่าน</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
