"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  fetchCollection,
  StrapiEntity,
  StrapiPagination,
  updateEntry,
  deleteEntry,
} from "@/lib/strapi";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Mail,
  Phone,
  User,
  MessageSquare,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import dayjs from "dayjs";

const PAGE_SIZE = 10;

interface ContactForm {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: "pending" | "read" | "replied";
  ipAddress?: string;
  createdAt: string;
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<StrapiEntity[]>([]);
  const [pagination, setPagination] = useState<StrapiPagination>({
    page: 1,
    pageSize: PAGE_SIZE,
    pageCount: 1,
    total: 0,
  });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [selectedContact, setSelectedContact] = useState<ContactForm | null>(null);

  const loadContacts = useCallback(async (page: number, searchQuery: string) => {
    setLoading(true);
    try {
      const filters: any = {};
      if (searchQuery) {
        filters.$or = [
          { name: { $containsi: searchQuery } },
          { email: { $containsi: searchQuery } },
          { message: { $containsi: searchQuery } },
        ];
      }

      const result = await fetchCollection("contact-forms", {
        pagination: { page, pageSize: PAGE_SIZE },
        filters,
        sort: ["createdAt:desc"],
      });

      setContacts(result.data);
      setPagination(result.meta.pagination);
    } catch (error) {
      console.error("Failed to load contacts:", error);
      toast.error("ไม่สามารถโหลดข้อมูลติดต่อได้");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadContacts(pagination.page, search);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadContacts(1, search);
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await updateEntry("contact-forms", id, { status: "read" });
      toast.success("อัพเดทสถานะสำเร็จ");
      loadContacts(pagination.page, search);
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("ไม่สามารถอัพเดทสถานะได้");
    }
  };

  const handleDelete = async (id: number, name: string) => {
    toast(`ลบข้อความจาก "${name}"?`, {
      description: "การกระทำนี้ไม่สามารถย้อนกลับได้",
      action: {
        label: "ลบ",
        onClick: () => confirmDelete(id),
      },
      cancel: { label: "ยกเลิก", onClick: () => {} },
    });
  };

  const confirmDelete = async (id: number) => {
    setDeleting(id);
    try {
      await deleteEntry("contact-forms", id);
      toast.success("ลบข้อความสำเร็จ");
      loadContacts(pagination.page, search);
    } catch (error) {
      console.error("Failed to delete contact:", error);
      toast.error("ไม่สามารถลบข้อความได้");
    } finally {
      setDeleting(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">รอดำเนินการ</Badge>;
      case "read":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">อ่านแล้ว</Badge>;
      case "replied":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">ตอบกลับแล้ว</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">ข้อความติดต่อ</h1>
          <p className="text-muted-foreground mt-1">
            จัดการข้อความติดต่อจากลูกค้า
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>รายการข้อความ ({pagination.total})</CardTitle>
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                placeholder="ค้นหา..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-64"
              />
              <Button type="submit" size="icon" variant="outline">
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              กำลังโหลด...
            </div>
          ) : contacts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              ไม่พบข้อมูล
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>วันที่</TableHead>
                    <TableHead>ชื่อ</TableHead>
                    <TableHead>อีเมล</TableHead>
                    <TableHead>เบอร์โทร</TableHead>
                    <TableHead>หัวข้อ</TableHead>
                    <TableHead>สถานะ</TableHead>
                    <TableHead className="text-right">จัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.map((contact) => {
                    const attrs = contact.attributes || contact;
                    return (
                      <TableRow key={contact.id}>
                        <TableCell className="text-sm text-muted-foreground">
                          {dayjs(attrs.createdAt).format("DD/MM/YYYY HH:mm")}
                        </TableCell>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            {attrs.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <a
                              href={`mailto:${attrs.email}`}
                              className="text-blue-600 hover:underline"
                            >
                              {attrs.email}
                            </a>
                          </div>
                        </TableCell>
                        <TableCell>
                          {attrs.phone ? (
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <a
                                href={`tel:${attrs.phone}`}
                                className="text-blue-600 hover:underline"
                              >
                                {attrs.phone}
                              </a>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {attrs.subject || (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>{getStatusBadge(attrs.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedContact({ id: contact.id, ...attrs } as ContactForm)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              ดู
                            </Button>
                            {attrs.status === "pending" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleMarkAsRead(contact.id)}
                              >
                                <MessageSquare className="h-4 w-4 mr-1" />
                                อ่านแล้ว
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(contact.id, attrs.name)}
                              disabled={deleting === contact.id}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  แสดง {(pagination.page - 1) * PAGE_SIZE + 1} ถึง{" "}
                  {Math.min(pagination.page * PAGE_SIZE, pagination.total)} จาก{" "}
                  {pagination.total} รายการ
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => loadContacts(pagination.page - 1, search)}
                    disabled={pagination.page === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    ก่อนหน้า
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => loadContacts(pagination.page + 1, search)}
                    disabled={pagination.page >= pagination.pageCount}
                  >
                    ถัดไป
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedContact} onOpenChange={(open) => { if (!open) setSelectedContact(null); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              รายละเอียดข้อความ
            </DialogTitle>
          </DialogHeader>
          {selectedContact && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">ชื่อ</p>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium">{selectedContact.name}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">อีเมล</p>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a href={`mailto:${selectedContact.email}`} className="text-blue-600 hover:underline text-sm">
                      {selectedContact.email}
                    </a>
                  </div>
                </div>
                {selectedContact.phone && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">เบอร์โทร</p>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a href={`tel:${selectedContact.phone}`} className="text-blue-600 hover:underline text-sm">
                        {selectedContact.phone}
                      </a>
                    </div>
                  </div>
                )}
                {selectedContact.subject && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">หัวข้อ</p>
                    <p className="font-medium">{selectedContact.subject}</p>
                  </div>
                )}
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">วันที่</p>
                  <p className="text-sm">{dayjs(selectedContact.createdAt).format("DD/MM/YYYY HH:mm")}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">สถานะ</p>
                  <div>{getStatusBadge(selectedContact.status)}</div>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">ข้อความ</p>
                <div className="p-4 bg-muted rounded-lg whitespace-pre-wrap text-sm leading-relaxed">
                  {selectedContact.message}
                </div>
              </div>

              {selectedContact.ipAddress && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">IP Address</p>
                  <p className="text-sm text-muted-foreground font-mono">{selectedContact.ipAddress}</p>
                </div>
              )}

              <div className="flex gap-2 pt-2 border-t">
                {selectedContact.status === "pending" && (
                  <Button
                    onClick={() => {
                      handleMarkAsRead(selectedContact.id);
                      setSelectedContact(null);
                    }}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    ทำเครื่องหมายว่าอ่านแล้ว
                  </Button>
                )}
                <Button
                  variant="destructive"
                  onClick={() => {
                    handleDelete(selectedContact.id, selectedContact.name);
                    setSelectedContact(null);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  ลบข้อความ
                </Button>
                <Button variant="outline" onClick={() => setSelectedContact(null)} className="ml-auto">
                  ปิด
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
