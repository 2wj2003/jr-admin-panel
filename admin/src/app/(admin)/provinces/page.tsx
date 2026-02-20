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
} from "@/lib/strapi";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  MapPin,
} from "lucide-react";

const PAGE_SIZE = 25;

export default function ProvincesPage() {
  const [provinces, setProvinces] = useState<StrapiEntity[]>([]);
  const [pagination, setPagination] = useState<StrapiPagination>({
    page: 1,
    pageSize: PAGE_SIZE,
    pageCount: 1,
    total: 0,
  });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const loadProvinces = useCallback(async (page: number, searchQuery: string) => {
    setLoading(true);
    try {
      const params: Record<string, any> = {
        page: page,
        pageSize: PAGE_SIZE,
        sort: "name_th:ASC",
      };

      if (searchQuery) {
        params["_q"] = searchQuery;
      }

      const response = await fetchCollection("provinces", params);
      setProvinces(response.data);
      setPagination(response.meta.pagination);
    } catch (error) {
      console.error("Failed to load provinces:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProvinces(1, "");
  }, [loadProvinces]);

  const handleSearch = () => loadProvinces(1, search);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const handlePageChange = (page: number) => loadProvinces(page, search);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">จังหวัด</h1>
          <p className="text-muted-foreground mt-1">
            จัดการข้อมูลจังหวัดทั้งหมด ({pagination.total} รายการ)
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ค้นหาจังหวัด..."
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
          ) : provinces.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg">ไม่พบจังหวัด</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ชื่อ (ไทย)</TableHead>
                    <TableHead>ชื่อ (อังกฤษ)</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>ผลงานติดตั้ง</TableHead>
                    <TableHead>สถานะ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {provinces.map((province) => {
                    const attrs = province.attributes;
                    const showcaseCount = attrs.showcases?.data?.length || 0;

                    return (
                      <TableRow key={province.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{attrs.name_th}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{attrs.name_en || "-"}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-mono text-muted-foreground">
                            {attrs.slug || "-"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{showcaseCount}</span>
                        </TableCell>
                        <TableCell>
                          {attrs.publishedAt ? (
                            <Badge variant="success">เผยแพร่</Badge>
                          ) : (
                            <Badge variant="warning">แบบร่าง</Badge>
                          )}
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
