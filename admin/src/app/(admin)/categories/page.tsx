"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
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
  Plus,
  Search,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  FolderTree,
} from "lucide-react";

const PAGE_SIZE = 25;

export default function CategoriesPage() {
  const [categories, setCategories] = useState<StrapiEntity[]>([]);
  const [pagination, setPagination] = useState<StrapiPagination>({
    page: 1,
    pageSize: PAGE_SIZE,
    pageCount: 1,
    total: 0,
  });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  const loadCategories = useCallback(async (page: number, searchQuery: string) => {
    setLoading(true);
    try {
      const params: Record<string, any> = {
        page: page,
        pageSize: PAGE_SIZE,
        sort: "name:ASC",
      };

      if (searchQuery) {
        params["_q"] = searchQuery;
      }

      const response = await fetchCollection("categories", params);
      setCategories(response.data);
      setPagination(response.meta.pagination);
    } catch (error) {
      console.error("Failed to load categories:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories(1, "");
  }, [loadCategories]);

  const handleSearch = () => loadCategories(1, search);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const handlePageChange = (page: number) => loadCategories(page, search);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`คุณต้องการลบหมวดหมู่ "${name}" ใช่หรือไม่?`)) return;
    setDeleting(id);
    try {
      await deleteEntry("categories", id);
      loadCategories(pagination.page, search);
    } catch (error) {
      console.error("Failed to delete category:", error);
      alert("ไม่สามารถลบหมวดหมู่ได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">หมวดหมู่</h1>
          <p className="text-muted-foreground mt-1">
            จัดการหมวดหมู่ทั้งหมดในระบบ ({pagination.total} รายการ)
          </p>
        </div>
        <Link href="/categories/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            เพิ่มหมวดหมู่
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ค้นหาหมวดหมู่..."
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
                <div key={i} className="h-12 bg-muted animate-pulse rounded" />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg">ไม่พบหมวดหมู่</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ชื่อหมวดหมู่</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>หมวดหมู่หลัก</TableHead>
                    <TableHead>สินค้า</TableHead>
                    <TableHead>บทความ</TableHead>
                    <TableHead>สถานะ</TableHead>
                    <TableHead className="text-right">จัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((cat) => {
                    const attrs = cat.attributes;
                    const parent = attrs.parent?.data;
                    const productCount = attrs.products?.data?.length || 0;
                    const blogCount = attrs.blogs?.data?.length || 0;

                    return (
                      <TableRow key={cat.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <FolderTree className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{attrs.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-mono text-muted-foreground">
                            {attrs.slug || "-"}
                          </span>
                        </TableCell>
                        <TableCell>
                          {parent ? (
                            <Badge variant="outline">
                              {parent.attributes.name}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              ระดับบนสุด
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{productCount}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{blogCount}</span>
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
                            <Link href={`/categories/${cat.id}`}>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(cat.id, attrs.name)}
                              disabled={deleting === cat.id}
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
