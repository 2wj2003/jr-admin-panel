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
  getStrapiMediaUrl,
  StrapiEntity,
  StrapiPagination,
  deleteEntry,
} from "@/lib/strapi";
import { toast } from "sonner";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Tag,
} from "lucide-react";

const PAGE_SIZE = 25;

export default function BrandsPage() {
  const [brands, setBrands] = useState<StrapiEntity[]>([]);
  const [pagination, setPagination] = useState<StrapiPagination>({
    page: 1,
    pageSize: PAGE_SIZE,
    pageCount: 1,
    total: 0,
  });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  const loadBrands = useCallback(async (page: number, searchQuery: string) => {
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

      const response = await fetchCollection("brands", params);
      setBrands(response.data);
      setPagination(response.meta.pagination);
    } catch (error) {
      console.error("Failed to load brands:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBrands(1, "");
  }, [loadBrands]);

  const handleSearch = () => loadBrands(1, search);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const handlePageChange = (page: number) => loadBrands(page, search);

  const handleDelete = async (id: number, name: string) => {
    toast(`ลบแบรนด์ "${name}"?`, {
      description: "การกระทำนี้ไม่สามารถย้อนกลับได้",
      action: {
        label: "ลบ",
        onClick: async () => {
          setDeleting(id);
          try {
            await deleteEntry("brands", id);
            toast.success(`ลบแบรนด์ "${name}" สำเร็จ`);
            loadBrands(pagination.page, search);
          } catch (error) {
            console.error("Failed to delete brand:", error);
            toast.error("ไม่สามารถลบแบรนด์ได้ กรุณาลองใหม่อีกครั้ง");
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
          <h1 className="text-3xl font-bold tracking-tight">แบรนด์</h1>
          <p className="text-muted-foreground mt-1">
            จัดการแบรนด์ทั้งหมดในระบบ ({pagination.total} รายการ)
          </p>
        </div>
        <Link href="/brands/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            เพิ่มแบรนด์
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ค้นหาแบรนด์..."
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
          ) : brands.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg">ไม่พบแบรนด์</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px]">โลโก้</TableHead>
                    <TableHead>ชื่อแบรนด์</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>จำนวนสินค้า</TableHead>
                    <TableHead>สถานะ</TableHead>
                    <TableHead className="text-right">จัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {brands.map((brand) => {
                    const attrs = brand.attributes || brand;
                    const logo = attrs.logo?.data || attrs.logo;
                    const logoUrl = logo ? getStrapiMediaUrl(logo) : null;
                    const productCount = attrs.products?.data?.length || attrs.products?.length || 0;

                    return (
                      <TableRow key={brand.id}>
                        <TableCell>
                          {logoUrl ? (
                            <div className="w-10 h-10 rounded overflow-hidden bg-white border">
                              <img
                                src={logoUrl}
                                alt={attrs.name || ""}
                                className="w-full h-full object-contain p-1"
                              />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                              <Tag className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{attrs.name}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-mono text-muted-foreground">
                            {attrs.slug || "-"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{productCount}</span>
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
                            <Link href={`/brands/${brand.id}`}>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(brand.id, attrs.name)}
                              disabled={deleting === brand.id}
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
