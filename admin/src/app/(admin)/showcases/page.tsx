"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
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
  getStrapiMediaUrl,
  StrapiEntity,
  StrapiPagination,
  deleteEntry,
} from "@/lib/strapi";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import dayjs from "dayjs";

const PAGE_SIZE = 10;

export default function ShowcasesPage() {
  const [showcases, setShowcases] = useState<StrapiEntity[]>([]);
  const [pagination, setPagination] = useState<StrapiPagination>({
    page: 1,
    pageSize: PAGE_SIZE,
    pageCount: 1,
    total: 0,
  });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  const loadShowcases = useCallback(async (page: number, searchQuery: string) => {
    setLoading(true);
    try {
      const params: Record<string, any> = {
        page: page,
        pageSize: PAGE_SIZE,
        sort: "createdAt:DESC",
      };

      if (searchQuery) {
        params["_q"] = searchQuery;
      }

      const response = await fetchCollection("showcases", params);
      setShowcases(response.data);
      setPagination(response.meta.pagination);
    } catch (error) {
      console.error("Failed to load showcases:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadShowcases(1, "");
  }, [loadShowcases]);

  const handleSearch = () => loadShowcases(1, search);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const handlePageChange = (page: number) => loadShowcases(page, search);

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`คุณต้องการลบผลงาน "${title}" ใช่หรือไม่?`)) return;
    setDeleting(id);
    try {
      await deleteEntry("showcases", id);
      loadShowcases(pagination.page, search);
    } catch (error) {
      console.error("Failed to delete showcase:", error);
      alert("ไม่สามารถลบผลงานได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setDeleting(null);
    }
  };

  const typeLabel: Record<string, string> = {
    CCTV: "กล้องวงจรปิด",
    SOLAR: "โซลาร์เซลล์",
    ATG: "ATG",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">ผลงาน</h1>
          <p className="text-muted-foreground mt-1">
            จัดการผลงานติดตั้งทั้งหมด ({pagination.total} รายการ)
          </p>
        </div>
        <Link href="/showcases/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            เพิ่มผลงาน
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ค้นหาผลงาน..."
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
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-16 bg-muted animate-pulse rounded" />
              ))}
            </div>
          ) : showcases.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg">ไม่พบผลงาน</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">รูปภาพ</TableHead>
                    <TableHead>หัวข้อ</TableHead>
                    <TableHead>ประเภท</TableHead>
                    <TableHead>จังหวัด</TableHead>
                    <TableHead>วันที่สร้าง</TableHead>
                    <TableHead>สถานะ</TableHead>
                    <TableHead className="text-right">จัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {showcases.map((showcase) => {
                    const attrs = showcase.attributes;
                    const cover = attrs.cover?.data;
                    const province = attrs.province?.data;
                    const imageUrl = cover ? getStrapiMediaUrl(cover) : null;

                    return (
                      <TableRow key={showcase.id}>
                        <TableCell>
                          {imageUrl ? (
                            <div className="relative w-12 h-12 rounded overflow-hidden bg-muted">
                              <Image
                                src={imageUrl}
                                alt={attrs.title || ""}
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded bg-muted flex items-center justify-center text-muted-foreground text-xs">
                              N/A
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <p className="font-medium">{attrs.title}</p>
                        </TableCell>
                        <TableCell>
                          {attrs.type ? (
                            <Badge variant="outline">
                              {typeLabel[attrs.type] || attrs.type}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {province ? (
                            <span className="text-sm">
                              {province.attributes.name_th}
                            </span>
                          ) : (
                            <span className="text-muted-foreground text-sm">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {dayjs(attrs.createdAt).format("DD/MM/YYYY")}
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
                            <Link href={`/showcases/${showcase.id}`}>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleDelete(showcase.id, attrs.title)
                              }
                              disabled={deleting === showcase.id}
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
