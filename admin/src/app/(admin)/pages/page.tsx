"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
  deleteEntry,
} from "@/lib/strapi";
import {
  Search,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Globe,
  Loader2,
  FileText,
} from "lucide-react";
import dayjs from "dayjs";

const PAGE_SIZE = 25;

export default function PagesPage() {
  const [pages, setPages] = useState<StrapiEntity[]>([]);
  const [pagination, setPagination] = useState<StrapiPagination>({
    page: 1,
    pageSize: PAGE_SIZE,
    pageCount: 1,
    total: 0,
  });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  const loadPages = useCallback(async (page: number, searchQuery: string) => {
    setLoading(true);
    try {
      const params: Record<string, any> = {
        page: page,
        pageSize: PAGE_SIZE,
        sort: "title:ASC",
      };

      if (searchQuery) {
        params["_q"] = searchQuery;
      }

      const response = await fetchCollection("pages", params);
      setPages(response.data);
      setPagination(response.meta.pagination);
    } catch (error) {
      console.error("Failed to load pages:", error);
      // Show error message instead of empty state
      setPages([]);
      setPagination({ page: 1, pageSize: PAGE_SIZE, pageCount: 1, total: 0 });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPages(1, "");
  }, [loadPages]);

  const handleSearch = () => loadPages(1, search);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const handlePageChange = (page: number) => loadPages(page, search);

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`คุณต้องการลบหน้า "${title}" ใช่หรือไม่?`)) return;
    setDeleting(id);
    try {
      await deleteEntry("pages", id);
      loadPages(pagination.page, search);
    } catch (error) {
      console.error("Failed to delete page:", error);
      alert("ไม่สามารถลบหน้าได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">หน้าเว็บ</h1>
          <p className="text-muted-foreground mt-1">
            จัดการหน้าเว็บทั้งหมดในระบบ ({pagination.total} รายการ)
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ค้นหาหน้าเว็บ..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-10"
              />
            </div>
            <Button variant="outline" onClick={handleSearch}>
              ค้นหา
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : pages.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <FileText className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p className="text-lg font-medium">Pages Management ไม่พร้อมใช้งาน</p>
              <p className="text-sm mt-2">
                การจัดการหน้าเว็บต้องทำผ่าน Strapi Admin Panel โดยตรง
              </p>
              <div className="mt-4 p-4 bg-muted rounded-lg text-left max-w-md mx-auto">
                <p className="text-sm font-medium mb-2">วิธีเข้าใช้งาน:</p>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>เข้า <code className="bg-white px-2 py-1 rounded">https://api.jr.co.th/admin</code></li>
                  <li>ไปที่ <code className="bg-white px-2 py-1 rounded">Page Builder</code></li>
                  <li>จัดการหน้าเว็บและ Dynamic Zone ได้ทันที</li>
                </ol>
              </div>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ชื่อหน้า</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>วันที่แก้ไข</TableHead>
                    <TableHead>สถานะ</TableHead>
                    <TableHead className="text-right">จัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pages.map((page) => {
                    const attrs = page.attributes;

                    return (
                      <TableRow key={page.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{attrs.title}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-mono text-muted-foreground">
                            /{attrs.slug || ""}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {dayjs(attrs.updatedAt).format("DD/MM/YYYY HH:mm")}
                          </span>
                        </TableCell>
                        <TableCell>
                          {attrs.publishedAt ? (
                            <Badge variant="success">เผยแพร่</Badge>
                          ) : (
                            <Badge variant="warning">แบบร่าง</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleDelete(page.id, attrs.title)
                              }
                              disabled={deleting === page.id}
                              className="text-destructive hover:text-destructive"
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

              {pagination.pageCount > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    หน้า {pagination.page} จาก {pagination.pageCount} (
                    {pagination.total} รายการ)
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page <= 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page >= pagination.pageCount}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
