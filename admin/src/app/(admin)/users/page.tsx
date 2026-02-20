"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
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
import { fetchAdminUsers, deleteAdminUser, AdminUser } from "@/lib/strapi";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, Users, Shield } from "lucide-react";
import dayjs from "dayjs";

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchAdminUsers();
      const data = response.data;
      setUsers(Array.isArray(data) ? data : data.results || []);
    } catch (error) {
      console.error("Failed to load users:", error);
      // Show error message instead of empty state
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleDelete = async (user: AdminUser) => {
    toast(`ลบผู้ใช้ "${user.firstname} ${user.lastname}"?`, {
      description: `${user.email} — การกระทำนี้ไม่สามารถย้อนกลับได้`,
      action: {
        label: "ลบ",
        onClick: async () => {
          setDeleting(user.id);
          try {
            await deleteAdminUser(user.id);
            toast.success(`ลบผู้ใช้ "${user.firstname} ${user.lastname}" สำเร็จ`);
            await loadUsers();
          } catch (error: any) {
            console.error("Failed to delete user:", error);
            toast.error(`ลบไม่สำเร็จ: ${error?.response?.data?.error?.message || error?.message || "Unknown error"}`);
          } finally {
            setDeleting(null);
          }
        },
      },
      cancel: { label: "ยกเลิก", onClick: () => {} },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground mt-1">
            จัดการผู้ใช้งานระบบ Admin
          </p>
        </div>
        <Link href="/users/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            เพิ่มผู้ใช้
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            รายชื่อผู้ใช้ ({users.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Users className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p className="text-lg font-medium">User Management ไม่พร้อมใช้งาน</p>
              <p className="text-sm mt-2">
                การจัดการผู้ใช้ admin ต้องทำผ่าน Strapi Admin Panel โดยตรง
              </p>
              <div className="mt-4 p-4 bg-muted rounded-lg text-left max-w-md mx-auto">
                <p className="text-sm font-medium mb-2">วิธีเข้าใช้งาน:</p>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>เข้า <code className="bg-white px-2 py-1 rounded">https://api.jr.co.th/admin</code></li>
                  <li>ไปที่ <code className="bg-white px-2 py-1 rounded">Users & Permissions</code></li>
                  <li>จัดการผู้ใช้ admin ได้ทันที</li>
                </ol>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>ชื่อ</TableHead>
                  <TableHead>อีเมล</TableHead>
                  <TableHead>บทบาท</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead>สร้างเมื่อ</TableHead>
                  <TableHead className="text-right">จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-mono text-xs">
                      {user.id}
                    </TableCell>
                    <TableCell className="font-medium">
                      {user.firstname} {user.lastname}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.roles?.map((role) => (
                          <Badge
                            key={role.id}
                            variant="secondary"
                            className="text-xs"
                          >
                            <Shield className="h-3 w-3 mr-1" />
                            {role.name}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.isActive ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                      {user.blocked && (
                        <Badge variant="destructive" className="ml-1">
                          Blocked
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {dayjs(user.createdAt).format("DD/MM/YYYY")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/users/${user.id}`}>
                          <Button variant="ghost" size="sm">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(user)}
                          disabled={deleting === user.id}
                        >
                          {deleting === user.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
