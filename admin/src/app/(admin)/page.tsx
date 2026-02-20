"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import {
  Package,
  FileText,
  FolderTree,
  Tag,
  Image,
  MapPin,
} from "lucide-react";

interface ContentCount {
  label: string;
  count: number;
  icon: React.ElementType;
  color: string;
  href: string;
}

export default function DashboardPage() {
  const [counts, setCounts] = useState<ContentCount[]>([
    { label: "Products", count: 0, icon: Package, color: "text-blue-600 bg-blue-100", href: "/products" },
    { label: "Blogs", count: 0, icon: FileText, color: "text-green-600 bg-green-100", href: "/blogs" },
    { label: "Categories", count: 0, icon: FolderTree, color: "text-purple-600 bg-purple-100", href: "/categories" },
    { label: "Brands", count: 0, icon: Tag, color: "text-orange-600 bg-orange-100", href: "/brands" },
    { label: "Showcases", count: 0, icon: Image, color: "text-pink-600 bg-pink-100", href: "/showcases" },
    { label: "Provinces", count: 0, icon: MapPin, color: "text-teal-600 bg-teal-100", href: "/provinces" },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const endpoints = [
          { key: "Products", url: "/content-manager/collection-types/api::product.product?page=1&pageSize=1" },
          { key: "Blogs", url: "/content-manager/collection-types/api::blog.blog?page=1&pageSize=1" },
          { key: "Categories", url: "/content-manager/collection-types/api::category.category?page=1&pageSize=1" },
          { key: "Brands", url: "/content-manager/collection-types/api::brand.brand?page=1&pageSize=1" },
          { key: "Showcases", url: "/content-manager/collection-types/api::showcase.showcase?page=1&pageSize=1" },
          { key: "Provinces", url: "/content-manager/collection-types/api::province.province?page=1&pageSize=1" },
        ];

        const results = await Promise.allSettled(
          endpoints.map((ep) => api.get(ep.url))
        );

        setCounts((prev) =>
          prev.map((item, index) => {
            const result = results[index];
            if (result.status === "fulfilled") {
              const resData = result.value.data;
              // Content Manager API returns { pagination: { total } } or { results: [], pagination: {} }
              const total =
                resData?.pagination?.total ||
                resData?.meta?.pagination?.total ||
                resData?.results?.length ||
                0;
              return { ...item, count: total };
            }
            return item;
          })
        );
      } catch (error) {
        console.error("Failed to fetch counts:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCounts();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          ภาพรวมของระบบจัดการเนื้อหา JR Commerce
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {counts.map((item) => (
          <Card key={item.label} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {item.label}
              </CardTitle>
              <div className={`p-2 rounded-lg ${item.color}`}>
                <item.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-8 w-16 bg-muted animate-pulse rounded" />
              ) : (
                <div className="text-3xl font-bold">{item.count}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                รายการทั้งหมด
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>เริ่มต้นใช้งาน</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 text-sm">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Package className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium">จัดการสินค้า</p>
                <p className="text-muted-foreground">เพิ่ม แก้ไข ลบสินค้าในระบบ</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <FileText className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium">จัดการบทความ</p>
                <p className="text-muted-foreground">เขียนและเผยแพร่บทความบล็อก</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <FolderTree className="h-5 w-5 text-purple-600" />
              <div>
                <p className="font-medium">จัดการหมวดหมู่</p>
                <p className="text-muted-foreground">จัดระเบียบหมวดหมู่สินค้าและบทความ</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
