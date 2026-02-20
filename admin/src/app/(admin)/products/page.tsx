"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "@/lib/strapi";
import {
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
} from "lucide-react";
import { deleteEntry } from "@/lib/strapi";

const PAGE_SIZE = 10;

export default function ProductsPage() {
  const [products, setProducts] = useState<StrapiEntity[]>([]);
  const [pagination, setPagination] = useState<StrapiPagination>({
    page: 1,
    pageSize: PAGE_SIZE,
    pageCount: 1,
    total: 0,
  });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  const loadProducts = useCallback(async (page: number, searchQuery: string) => {
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

      const response = await fetchCollection("products", params);
      setProducts(response.data);
      setPagination(response.meta.pagination);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts(1, "");
  }, [loadProducts]);

  const handleSearch = () => {
    loadProducts(1, search);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handlePageChange = (page: number) => {
    loadProducts(page, search);
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`คุณต้องการลบสินค้า "${name}" ใช่หรือไม่?`)) return;

    setDeleting(id);
    try {
      await deleteEntry("products", id);
      loadProducts(pagination.page, search);
    } catch (error) {
      console.error("Failed to delete product:", error);
      alert("ไม่สามารถลบสินค้าได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setDeleting(null);
    }
  };

  const formatPrice = (price: number | null | undefined) => {
    if (!price) return "-";
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
    }).format(price);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">สินค้า</h1>
          <p className="text-muted-foreground mt-1">
            จัดการสินค้าทั้งหมดในระบบ ({pagination.total} รายการ)
          </p>
        </div>
        <Link href="/products/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            เพิ่มสินค้า
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ค้นหาสินค้า..."
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
          ) : products.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg">ไม่พบสินค้า</p>
              <p className="text-sm mt-1">ลองค้นหาด้วยคำอื่น หรือเพิ่มสินค้าใหม่</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">รูปภาพ</TableHead>
                    <TableHead>ชื่อสินค้า</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>ราคา</TableHead>
                    <TableHead>หมวดหมู่</TableHead>
                    <TableHead>สถานะ</TableHead>
                    <TableHead className="text-right">จัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => {
                    // Support both flat format and nested attributes format
                    const attrs = product.attributes || product;
                    const coverImage = attrs.coverImage?.data || attrs.coverImage;
                    const rawCategory = attrs.category?.data || attrs.category;
                    const categoryName = rawCategory?.attributes?.name || rawCategory?.name || null;
                    const imageUrl = coverImage
                      ? getStrapiMediaUrl(coverImage)
                      : null;

                    return (
                      <TableRow key={product.id}>
                        <TableCell>
                          {imageUrl ? (
                            <div className="w-12 h-12 rounded overflow-hidden bg-muted">
                              <img
                                src={imageUrl}
                                alt={attrs.name || ""}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded bg-muted flex items-center justify-center text-muted-foreground text-xs">
                              N/A
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{attrs.name || "-"}</p>
                            {attrs.slug && (
                              <p className="text-xs text-muted-foreground">
                                /{attrs.slug}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-mono">
                            {attrs.sku || "-"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div>
                            {attrs.discountPrice ? (
                              <>
                                <p className="font-medium text-red-600">
                                  {formatPrice(attrs.discountPrice)}
                                </p>
                                <p className="text-xs text-muted-foreground line-through">
                                  {formatPrice(attrs.originalPrice)}
                                </p>
                              </>
                            ) : (
                              <p className="font-medium">
                                {formatPrice(attrs.originalPrice)}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {categoryName ? (
                            <Badge variant="secondary">
                              {categoryName}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">-</span>
                          )}
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
                            <Link href={`/products/${product.id}`}>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleDelete(product.id, attrs.name)
                              }
                              disabled={deleting === product.id}
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
                    {Array.from(
                      { length: Math.min(pagination.pageCount, 5) },
                      (_, i) => {
                        let pageNum: number;
                        if (pagination.pageCount <= 5) {
                          pageNum = i + 1;
                        } else if (pagination.page <= 3) {
                          pageNum = i + 1;
                        } else if (
                          pagination.page >= pagination.pageCount - 2
                        ) {
                          pageNum = pagination.pageCount - 4 + i;
                        } else {
                          pageNum = pagination.page - 2 + i;
                        }
                        return (
                          <Button
                            key={pageNum}
                            variant={
                              pageNum === pagination.page
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() => handlePageChange(pageNum)}
                          >
                            {pageNum}
                          </Button>
                        );
                      }
                    )}
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
