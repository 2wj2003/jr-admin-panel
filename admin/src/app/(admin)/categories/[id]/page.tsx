"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchSingle, fetchCollection, updateEntry, createEntry } from "@/lib/strapi";
import { SeoEditor, SeoData, emptySeo, parseSeoFromApi, seoToPayload } from "@/components/seo-editor";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

interface CategoryOption {
  id: number;
  name: string;
}

export default function CategoryEditPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.id as string;
  const isNew = categoryId === "new";

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [parentCategories, setParentCategories] = useState<CategoryOption[]>([]);
  const [seo, setSeo] = useState<SeoData>({ ...emptySeo });

  const [form, setForm] = useState({
    name: "",
    slug: "",
    parent: "",
  });

  const loadOptions = useCallback(async () => {
    try {
      const catRes = await fetchCollection("categories", { pageSize: 100, sort: "name:ASC" });
      setParentCategories(
        catRes.data
          .filter((c) => c.id !== Number(categoryId))
          .map((c) => ({ id: c.id, name: c.attributes.name }))
      );
    } catch (error) {
      console.error("Failed to load parent categories:", error);
    }
  }, [categoryId]);

  const loadCategory = useCallback(async () => {
    if (isNew) return;
    setLoading(true);
    try {
      const response = await fetchSingle("categories", Number(categoryId));
      const data = response.data;

      const parentId = typeof data.parent === "object" && data.parent?.id
        ? String(data.parent.id)
        : "";

      setForm({
        name: data.name || "",
        slug: data.slug || "",
        parent: parentId,
      });
      if (data.seo) {
        setSeo(parseSeoFromApi(data.seo));
      }
    } catch (error) {
      console.error("Failed to load category:", error);
      alert("ไม่สามารถโหลดข้อมูลหมวดหมู่ได้");
      router.push("/categories");
    } finally {
      setLoading(false);
    }
  }, [isNew, categoryId, router]);

  useEffect(() => {
    loadOptions();
    loadCategory();
  }, [loadOptions, loadCategory]);

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const generateSlug = () => {
    const slug = form.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^ก-๙a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    handleChange("slug", slug);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.slug) {
      alert("กรุณากรอกข้อมูลที่จำเป็น: ชื่อหมวดหมู่, Slug");
      return;
    }

    setSaving(true);
    try {
      const payload: Record<string, any> = {
        name: form.name,
        slug: form.slug,
        parent: form.parent ? Number(form.parent) : null,
        seo: seoToPayload(seo),
      };

      if (isNew) {
        await createEntry("categories", payload);
        alert("สร้างหมวดหมู่สำเร็จ");
      } else {
        await updateEntry("categories", Number(categoryId), payload);
        alert("บันทึกหมวดหมู่สำเร็จ");
      }
      router.push("/categories");
    } catch (error: any) {
      console.error("Failed to save category:", error);
      const message = error?.response?.data?.error?.message || "ไม่สามารถบันทึกข้อมูลได้";
      alert(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push("/categories")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            กลับ
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isNew ? "สร้างหมวดหมู่ใหม่" : "แก้ไขหมวดหมู่"}
            </h1>
            {!isNew && (
              <p className="text-muted-foreground mt-1">ID: {categoryId}</p>
            )}
          </div>
        </div>
        <Button onClick={handleSubmit} disabled={saving}>
          {saving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {saving ? "กำลังบันทึก..." : "บันทึก"}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>ข้อมูลหมวดหมู่</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">ชื่อหมวดหมู่ *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="ชื่อหมวดหมู่"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <div className="flex gap-2">
                <Input
                  id="slug"
                  value={form.slug}
                  onChange={(e) => handleChange("slug", e.target.value)}
                  placeholder="category-slug"
                  required
                />
                <Button type="button" variant="outline" size="sm" onClick={generateSlug}>
                  สร้าง
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>หมวดหมู่หลัก (Parent)</Label>
              <Select
                value={form.parent}
                onValueChange={(v) => handleChange("parent", v === "none" ? "" : v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="ไม่มี (เป็นหมวดหมู่หลัก)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">ไม่มี (เป็นหมวดหมู่หลัก)</SelectItem>
                  {parentCategories.map((cat) => (
                    <SelectItem key={cat.id} value={String(cat.id)}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        </div>

        <div className="space-y-6">
          <SeoEditor value={seo} onChange={setSeo} />
        </div>
      </form>
    </div>
  );
}
