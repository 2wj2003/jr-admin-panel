"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  fetchAdminUser,
  fetchAdminRoles,
  createAdminUser,
  updateAdminUser,
  AdminUser,
  AdminRole,
} from "@/lib/strapi";
import { ArrowLeft, Save, Loader2, Shield } from "lucide-react";
import { toast } from "sonner";

export default function UserEditPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
  const isNew = userId === "new";

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [roles, setRoles] = useState<AdminRole[]>([]);

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    isActive: true,
    selectedRoles: [] as number[],
  });

  const loadRoles = useCallback(async () => {
    try {
      const response = await fetchAdminRoles();
      setRoles(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Failed to load roles:", error);
    }
  }, []);

  const loadUser = useCallback(async () => {
    if (isNew) return;
    setLoading(true);
    try {
      const response = await fetchAdminUser(Number(userId));
      const user = response.data;

      setForm({
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        email: user.email || "",
        password: "",
        isActive: user.isActive ?? true,
        selectedRoles: user.roles?.map((r) => r.id) || [],
      });
    } catch (error) {
      console.error("Failed to load user:", error);
      toast.error("ไม่สามารถโหลดข้อมูลผู้ใช้ได้");
      router.push("/users");
    } finally {
      setLoading(false);
    }
  }, [isNew, userId, router]);

  useEffect(() => {
    loadRoles();
    loadUser();
  }, [loadRoles, loadUser]);

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleRole = (roleId: number) => {
    setForm((prev) => ({
      ...prev,
      selectedRoles: prev.selectedRoles.includes(roleId)
        ? prev.selectedRoles.filter((id) => id !== roleId)
        : [...prev.selectedRoles, roleId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.firstname || !form.lastname || !form.email) {
      toast.error("กรุณากรอกข้อมูลที่จำเป็น: ชื่อ, นามสกุล, อีเมล");
      return;
    }

    if (isNew && !form.password) {
      toast.error("กรุณากรอกรหัสผ่านสำหรับผู้ใช้ใหม่");
      return;
    }

    if (form.selectedRoles.length === 0) {
      toast.error("กรุณาเลือกบทบาทอย่างน้อย 1 บทบาท");
      return;
    }

    setSaving(true);
    try {
      if (isNew) {
        await createAdminUser({
          firstname: form.firstname,
          lastname: form.lastname,
          email: form.email,
          password: form.password,
          roles: form.selectedRoles,
        });
        toast.success("สร้างผู้ใช้สำเร็จ");
      } else {
        const payload: Record<string, any> = {
          firstname: form.firstname,
          lastname: form.lastname,
          email: form.email,
          roles: form.selectedRoles,
          isActive: form.isActive,
        };
        if (form.password) {
          payload.password = form.password;
        }
        await updateAdminUser(Number(userId), payload);
        toast.success("บันทึกผู้ใช้สำเร็จ");
      }
      router.push("/users");
    } catch (error: any) {
      console.error("Failed to save user:", error);
      const message =
        error?.response?.data?.error?.message || "ไม่สามารถบันทึกข้อมูลได้";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/users")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            กลับ
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isNew ? "เพิ่มผู้ใช้ใหม่" : "แก้ไขผู้ใช้"}
            </h1>
            {!isNew && (
              <p className="text-muted-foreground mt-1">ID: {userId}</p>
            )}
          </div>
        </div>
        <Button onClick={handleSubmit} disabled={saving}>
          {saving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {saving ? "กำลังบันทึก..." : "บันทึก"}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>ข้อมูลผู้ใช้</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstname">ชื่อ *</Label>
                  <Input
                    id="firstname"
                    value={form.firstname}
                    onChange={(e) => handleChange("firstname", e.target.value)}
                    placeholder="ชื่อ"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastname">นามสกุล *</Label>
                  <Input
                    id="lastname"
                    value={form.lastname}
                    onChange={(e) => handleChange("lastname", e.target.value)}
                    placeholder="นามสกุล"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">อีเมล *</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="user@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">
                  รหัสผ่าน {isNew ? "*" : "(เว้นว่างถ้าไม่ต้องการเปลี่ยน)"}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  placeholder={isNew ? "รหัสผ่าน" : "••••••••"}
                  required={isNew}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Roles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                บทบาท
              </CardTitle>
            </CardHeader>
            <CardContent>
              {roles.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  ไม่พบบทบาท
                </p>
              ) : (
                <div className="space-y-2">
                  {roles.map((role) => (
                    <div
                      key={role.id}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <Badge
                          variant={
                            form.selectedRoles.includes(role.id)
                              ? "default"
                              : "outline"
                          }
                          className="cursor-pointer"
                          onClick={() => toggleRole(role.id)}
                        >
                          {role.name}
                        </Badge>
                        {role.description && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {role.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Status */}
          {!isNew && (
            <Card>
              <CardHeader>
                <CardTitle>สถานะ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Label htmlFor="isActive">เปิดใช้งาน</Label>
                  <Switch
                    id="isActive"
                    checked={form.isActive}
                    onCheckedChange={(v) => handleChange("isActive", v)}
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </form>
    </div>
  );
}
