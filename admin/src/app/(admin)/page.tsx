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
  TableRow,
} from "@/components/ui/table";
import { api } from "@/lib/api";
import { fetchCollection, getStrapiMediaUrl } from "@/lib/strapi";
import {
  Package,
  FileText,
  FolderTree,
  Tag,
  Image as ImageIcon,
  MapPin,
  MessageSquare,
  Mail,
  ArrowRight,
  TrendingUp,
  Eye,
  Plus,
  RefreshCw,
} from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/th";

dayjs.extend(relativeTime);
dayjs.locale("th");

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface StatCard {
  label: string;
  count: number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  href: string;
  apiKey: string;
  borderColor: string;
}

interface RecentProduct {
  id: number;
  name: string;
  price: number | null;
  thumbnail: string;
  published: boolean;
  updatedAt: string;
}

interface RecentBlog {
  id: number;
  title: string;
  category: string;
  published: boolean;
  updatedAt: string;
}

interface ChatSession {
  id: number;
  sessionId: string;
  userName: string;
  status: string;
  createdAt: string;
  messageCount?: number;
}

interface ContactForm {
  id: number;
  name: string;
  email: string;
  subject: string;
  createdAt: string;
}

/* ------------------------------------------------------------------ */
/*  Stat definitions                                                   */
/* ------------------------------------------------------------------ */

const STAT_DEFS: StatCard[] = [
  { label: "สินค้า", count: 0, icon: Package, color: "text-blue-600", bgColor: "bg-blue-50", href: "/products", apiKey: "products", borderColor: "#2563eb" },
  { label: "บทความ", count: 0, icon: FileText, color: "text-emerald-600", bgColor: "bg-emerald-50", href: "/blogs", apiKey: "blogs", borderColor: "#059669" },
  { label: "หมวดหมู่", count: 0, icon: FolderTree, color: "text-violet-600", bgColor: "bg-violet-50", href: "/categories", apiKey: "categories", borderColor: "#7c3aed" },
  { label: "แบรนด์", count: 0, icon: Tag, color: "text-amber-600", bgColor: "bg-amber-50", href: "/brands", apiKey: "brands", borderColor: "#d97706" },
  { label: "ผลงาน", count: 0, icon: ImageIcon, color: "text-rose-600", bgColor: "bg-rose-50", href: "/showcases", apiKey: "showcases", borderColor: "#e11d48" },
  { label: "จังหวัด", count: 0, icon: MapPin, color: "text-teal-600", bgColor: "bg-teal-50", href: "/provinces", apiKey: "provinces", borderColor: "#0d9488" },
  { label: "แชท", count: 0, icon: MessageSquare, color: "text-indigo-600", bgColor: "bg-indigo-50", href: "/chats", apiKey: "chat-sessions", borderColor: "#4f46e5" },
  { label: "ติดต่อ", count: 0, icon: Mail, color: "text-pink-600", bgColor: "bg-pink-50", href: "/contacts", apiKey: "contact-forms", borderColor: "#db2777" },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function DashboardPage() {
  const [stats, setStats] = useState<StatCard[]>(STAT_DEFS);
  const [recentProducts, setRecentProducts] = useState<RecentProduct[]>([]);
  const [recentBlogs, setRecentBlogs] = useState<RecentBlog[]>([]);
  const [activeChats, setActiveChats] = useState<ChatSession[]>([]);
  const [recentContacts, setRecentContacts] = useState<ContactForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  /* ---- greeting based on time ---- */
  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "สวัสดีตอนเช้า";
    if (h < 17) return "สวัสดีตอนบ่าย";
    return "สวัสดีตอนเย็น";
  };

  const [adminName, setAdminName] = useState("");
  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem("admin_user") || "{}");
      setAdminName(u.firstname || "Admin");
    } catch {
      setAdminName("Admin");
    }
  }, []);

  /* ---- data fetching ---- */
  const fetchDashboard = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      /* --- stat counts (parallel) - use Public API --- */
      const countPromises = STAT_DEFS.map(async (s) => {
        try {
          const res = await fetchCollection(s.apiKey, { page: 1, pageSize: 1 });
          return { key: s.apiKey, count: res.meta.pagination.total };
        } catch {
          return { key: s.apiKey, count: 0 };
        }
      });

      const countResults = await Promise.all(countPromises);

      setStats((prev) =>
        prev.map((item) => {
          const result = countResults.find((r) => r.key === item.apiKey);
          return { ...item, count: result?.count ?? 0 };
        })
      );

      /* --- recent products (5 latest) --- */
      const prodRes = await fetchCollection("products", { page: 1, pageSize: 5, sort: "updatedAt:DESC" }).catch(() => null);
      if (prodRes?.data) {
        setRecentProducts(
          prodRes.data.map((p) => {
            const a = p.attributes;
            const cover = a.cover_image || a.coverImage || a.image;
            const thumb = cover
              ? getStrapiMediaUrl(cover?.formats?.thumbnail || cover)
              : "";
            return {
              id: p.id,
              name: a.name || a.title || "-",
              price: a.price ?? a.selling_price ?? null,
              thumbnail: thumb,
              published: !!a.publishedAt,
              updatedAt: a.updatedAt || "",
            };
          })
        );
      }

      /* --- recent blogs (5 latest) --- */
      const blogRes = await fetchCollection("blogs", { page: 1, pageSize: 5, sort: "updatedAt:DESC" }).catch(() => null);
      if (blogRes?.data) {
        setRecentBlogs(
          blogRes.data.map((b) => {
            const a = b.attributes;
            const cat = a.category?.name || a.category?.data?.attributes?.name || "-";
            return {
              id: b.id,
              title: a.title || "-",
              category: cat,
              published: !!a.publishedAt,
              updatedAt: a.updatedAt || "",
            };
          })
        );
      }

      /* --- active chat sessions --- */
      const chatRes = await fetchCollection("chat-sessions", { page: 1, pageSize: 5, sort: "createdAt:DESC" }).catch(() => null);
      if (chatRes?.data) {
        setActiveChats(
          chatRes.data.map((c) => {
            const a = c.attributes;
            return {
              id: c.id,
              sessionId: a.sessionId || "",
              userName: a.userName || a.user_name || "ไม่ระบุชื่อ",
              status: a.status || "active",
              createdAt: a.createdAt || "",
            };
          })
        );
      }

      /* --- recent contacts --- */
      const contactRes = await fetchCollection("contact-forms", { page: 1, pageSize: 5, sort: "createdAt:DESC" }).catch(() => null);
      if (contactRes?.data) {
        setRecentContacts(
          contactRes.data.map((c) => {
            const a = c.attributes;
            return {
              id: c.id,
              name: a.name || "-",
              email: a.email || "-",
              subject: a.subject || a.message?.substring(0, 50) || "-",
              createdAt: a.createdAt || "",
            };
          })
        );
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  /* ---- format price ---- */
  const fmtPrice = (v: number | null) =>
    v != null ? v.toLocaleString("th-TH", { style: "currency", currency: "THB" }) : "-";

  /* ---- skeleton helper ---- */
  const Skeleton = ({ className = "" }: { className?: string }) => (
    <div className={`bg-muted animate-pulse rounded ${className}`} />
  );

  /* ================================================================ */
  /*  RENDER                                                           */
  /* ================================================================ */

  return (
    <div className="space-y-8">
      {/* ---- Header ---- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {getGreeting()}, {adminName}
          </h1>
          <p className="text-muted-foreground mt-1">
            ภาพรวมระบบจัดการ JR Commerce &mdash; {dayjs().format("dddd D MMMM YYYY")}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchDashboard(true)}
          disabled={refreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
          รีเฟรช
        </Button>
      </div>

      {/* ---- Stat Cards ---- */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.apiKey} href={s.href}>
            <Card className="hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer border-l-4"
              style={{ borderLeftColor: s.borderColor }}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {s.label}
                    </p>
                    {loading ? (
                      <Skeleton className="h-8 w-14 mt-1" />
                    ) : (
                      <p className="text-2xl font-bold mt-1">{s.count.toLocaleString()}</p>
                    )}
                  </div>
                  <div className={`p-2.5 rounded-xl ${s.bgColor}`}>
                    <s.icon className={`h-5 w-5 ${s.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* ---- Two-column: Recent Products + Recent Blogs ---- */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="h-4 w-4 text-blue-600" />
              สินค้าล่าสุด
            </CardTitle>
            <Link href="/products">
              <Button variant="ghost" size="sm" className="text-xs">
                ดูทั้งหมด <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-6 space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : recentProducts.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground">
                ยังไม่มีสินค้า
                <Link href="/products/edit?id=new" className="block mt-2">
                  <Button size="sm" variant="outline">
                    <Plus className="h-3 w-3 mr-1" /> เพิ่มสินค้า
                  </Button>
                </Link>
              </div>
            ) : (
              <Table>
                <TableBody>
                  {recentProducts.map((p) => (
                    <TableRow key={p.id} className="hover:bg-muted/50">
                      <TableCell className="w-12">
                        {p.thumbnail ? (
                          <img
                            src={p.thumbnail}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                            <Package className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Link href={`/products/edit?id=${p.id}`} className="hover:underline font-medium text-sm">
                          {p.name}
                        </Link>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {dayjs(p.updatedAt).fromNow()}
                        </p>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="text-sm font-medium">{fmtPrice(p.price)}</span>
                      </TableCell>
                      <TableCell className="text-right w-20">
                        {p.published ? (
                          <Badge variant="success" className="text-[10px]">เผยแพร่</Badge>
                        ) : (
                          <Badge variant="warning" className="text-[10px]">แบบร่าง</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Recent Blogs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4 text-emerald-600" />
              บทความล่าสุด
            </CardTitle>
            <Link href="/blogs">
              <Button variant="ghost" size="sm" className="text-xs">
                ดูทั้งหมด <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-6 space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : recentBlogs.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground">
                ยังไม่มีบทความ
                <Link href="/blogs/edit?id=new" className="block mt-2">
                  <Button size="sm" variant="outline">
                    <Plus className="h-3 w-3 mr-1" /> เพิ่มบทความ
                  </Button>
                </Link>
              </div>
            ) : (
              <Table>
                <TableBody>
                  {recentBlogs.map((b) => (
                    <TableRow key={b.id} className="hover:bg-muted/50">
                      <TableCell>
                        <Link href={`/blogs/edit?id=${b.id}`} className="hover:underline font-medium text-sm">
                          {b.title}
                        </Link>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {dayjs(b.updatedAt).fromNow()}
                        </p>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" className="text-[10px]">{b.category}</Badge>
                      </TableCell>
                      <TableCell className="text-right w-20">
                        {b.published ? (
                          <Badge variant="success" className="text-[10px]">เผยแพร่</Badge>
                        ) : (
                          <Badge variant="warning" className="text-[10px]">แบบร่าง</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ---- Two-column: Active Chats + Recent Contacts ---- */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Active Chats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-indigo-600" />
              แชทล่าสุด
            </CardTitle>
            <Link href="/chats">
              <Button variant="ghost" size="sm" className="text-xs">
                ดูทั้งหมด <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-6 space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : activeChats.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground">
                ยังไม่มีแชท
              </div>
            ) : (
              <Table>
                <TableBody>
                  {activeChats.map((c) => (
                    <TableRow key={c.id} className="hover:bg-muted/50">
                      <TableCell className="w-8">
                        <div className={`w-2.5 h-2.5 rounded-full ${c.status === "active" ? "bg-green-500 animate-pulse" : "bg-gray-300"}`} />
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-sm">{c.userName}</p>
                        <p className="text-xs text-muted-foreground">
                          {dayjs(c.createdAt).fromNow()}
                        </p>
                      </TableCell>
                      <TableCell className="text-right">
                        {c.status === "active" ? (
                          <Badge className="bg-green-100 text-green-700 text-[10px]">กำลังสนทนา</Badge>
                        ) : (
                          <Badge variant="secondary" className="text-[10px]">ปิดแล้ว</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right w-20">
                        <Link href={`/chats/conversation?sessionId=${c.sessionId}`}>
                          <Button variant="ghost" size="sm" className="h-7 text-xs">
                            <Eye className="h-3 w-3" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Recent Contacts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Mail className="h-4 w-4 text-pink-600" />
              ข้อความติดต่อล่าสุด
            </CardTitle>
            <Link href="/contacts">
              <Button variant="ghost" size="sm" className="text-xs">
                ดูทั้งหมด <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-6 space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : recentContacts.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground">
                ยังไม่มีข้อความติดต่อ
              </div>
            ) : (
              <Table>
                <TableBody>
                  {recentContacts.map((c) => (
                    <TableRow key={c.id} className="hover:bg-muted/50">
                      <TableCell>
                        <p className="font-medium text-sm">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{c.email}</p>
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        <p className="text-sm text-muted-foreground truncate">{c.subject}</p>
                      </TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground whitespace-nowrap">
                        {dayjs(c.createdAt).fromNow()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ---- Quick Actions ---- */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            การดำเนินการด่วน
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/products/edit?id=new">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">เพิ่มสินค้า</p>
                  <p className="text-xs text-muted-foreground">สร้างสินค้าใหม่</p>
                </div>
              </div>
            </Link>
            <Link href="/blogs/edit?id=new">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 transition-colors cursor-pointer">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <FileText className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">เขียนบทความ</p>
                  <p className="text-xs text-muted-foreground">สร้างบทความใหม่</p>
                </div>
              </div>
            </Link>
            <Link href="/showcases/edit?id=new">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer">
                <div className="p-2 bg-rose-100 rounded-lg">
                  <ImageIcon className="h-4 w-4 text-rose-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">เพิ่มผลงาน</p>
                  <p className="text-xs text-muted-foreground">อัปโหลดผลงานใหม่</p>
                </div>
              </div>
            </Link>
            <Link href="/chats">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 transition-colors cursor-pointer">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <MessageSquare className="h-4 w-4 text-indigo-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">แชทสด</p>
                  <p className="text-xs text-muted-foreground">ตอบข้อความลูกค้า</p>
                </div>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
