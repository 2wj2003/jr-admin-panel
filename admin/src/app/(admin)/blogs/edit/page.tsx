"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchSingle, fetchCollection, updateEntry, createEntry, getStrapiMediaUrl, MediaFile } from "@/lib/strapi";
import { api } from "@/lib/api";
import { MediaPicker } from "@/components/media-picker";
import { RichTextEditor } from "@/components/rich-text-editor";
import { SeoEditor, SeoData, emptySeo, parseSeoFromApi, seoToPayload } from "@/components/seo-editor";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface CategoryOption {
  id: number;
  name: string;
}

export default function BlogEditPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const blogId = searchParams.get("id") || "new";
  const isNew = blogId === "new";

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [coverImage, setCoverImage] = useState<MediaFile | null>(null);
  const [seo, setSeo] = useState<SeoData>({ ...emptySeo });

  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    content: "",
    category: "",
  });

  const loadOptions = useCallback(async () => {
    try {
      const catRes = await fetchCollection("categories", { pageSize: 100, sort: "name:ASC" });
      setCategories(catRes.data.map((c) => ({ id: c.id, name: c.attributes.name })));
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  }, []);

  const loadBlog = useCallback(async () => {
    if (isNew) return;
    setLoading(true);
    try {
      const response = await fetchSingle("blogs", Number(blogId));
      const data = response.data;

      const categoryId = typeof data.category === "object" && data.category?.id
        ? String(data.category.id)
        : "";

      setForm({
        title: data.title || "",
        slug: data.slug || "",
        description: data.description || "",
        content: data.content || "",
        category: categoryId,
      });

      if (data.coverImage && typeof data.coverImage === "object" && data.coverImage.id) {
        setCoverImage(data.coverImage as MediaFile);
      }
      if (data.seo) {
        setSeo(parseSeoFromApi(data.seo));
      }
    } catch (error) {
      console.error("Failed to load blog:", error);
      toast.error("ไม่สามารถโหลดข้อมูลบทความได้");
      router.push("/blogs");
    } finally {
      setLoading(false);
    }
  }, [isNew, blogId, router]);

  useEffect(() => {
    loadOptions();
    loadBlog();
  }, [loadOptions, loadBlog]);

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const generateSlug = () => {
    const slug = form.title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^ก-๙a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    handleChange("slug", slug);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title || !form.slug || !form.description) {
      toast.error("กรุณากรอกข้อมูลที่จำเป็น: ชื่อบทความ, Slug, คำอธิบาย");
      return;
    }

    if (form.description.length < 50) {
      toast.error("คำอธิบายต้องมีอย่างน้อย 50 ตัวอักษร");
      return;
    }

    setSaving(true);
    try {
      const payload: Record<string, any> = {
        title: form.title,
        slug: form.slug,
        description: form.description,
        content: form.content,
        category: form.category ? Number(form.category) : null,
        coverImage: coverImage ? coverImage.id : null,
        seo: seoToPayload(seo),
      };

      if (isNew) {
        await createEntry("blogs", payload);
        toast.success("สร้างบทความสำเร็จ");
      } else {
        await updateEntry("blogs", Number(blogId), payload);
        toast.success("บันทึกบทความสำเร็จ");
      }
      router.push("/blogs");
    } catch (error: any) {
      console.error("Failed to save blog:", error);
      const message = error?.response?.data?.error?.message || "ไม่สามารถบันทึกข้อมูลได้";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (isNew) return;
    try {
      const uid = "api::blog.blog";
      await api.post(`/content-manager/collection-types/${uid}/${blogId}/actions/publish`);
      toast.success("เผยแพร่บทความสำเร็จ");
      loadBlog();
    } catch (error) {
      console.error("Failed to publish:", error);
      toast.error("ไม่สามารถเผยแพร่ได้");
    }
  };

  const handleUnpublish = async () => {
    if (isNew) return;
    try {
      const uid = "api::blog.blog";
      await api.post(`/content-manager/collection-types/${uid}/${blogId}/actions/unpublish`);
      toast.success("ยกเลิกเผยแพร่สำเร็จ");
      loadBlog();
    } catch (error) {
      console.error("Failed to unpublish:", error);
      toast.error("ไม่สามารถยกเลิกเผยแพร่ได้");
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
          <Button variant="ghost" size="sm" onClick={() => router.push("/blogs")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            กลับ
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isNew ? "สร้างบทความใหม่" : "แก้ไขบทความ"}
            </h1>
            {!isNew && (
              <p className="text-muted-foreground mt-1">ID: {blogId}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isNew && (
            <>
              <Button variant="outline" onClick={handlePublish}>
                เผยแพร่
              </Button>
              <Button variant="outline" onClick={handleUnpublish}>
                ยกเลิกเผยแพร่
              </Button>
            </>
          )}
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {saving ? "กำลังบันทึก..." : "บันทึก"}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>ข้อมูลบทความ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">ชื่อบทความ *</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="ชื่อบทความ"
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
                    placeholder="blog-slug"
                    required
                  />
                  <Button type="button" variant="outline" size="sm" onClick={generateSlug}>
                    สร้าง
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  คำอธิบาย * <span className="text-muted-foreground text-xs">({form.description.length}/160 ตัวอักษร, ขั้นต่ำ 50)</span>
                </Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="คำอธิบายบทความ (50-160 ตัวอักษร)"
                  rows={3}
                  maxLength={160}
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>เนื้อหาบทความ</CardTitle>
            </CardHeader>
            <CardContent>
              <RichTextEditor
                value={form.content}
                onChange={(val) => handleChange("content", val)}
                placeholder="เขียนเนื้อหาบทความ..."
                minHeight="300px"
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>รูปปก</CardTitle>
            </CardHeader>
            <CardContent>
              <MediaPicker
                value={coverImage}
                onChange={setCoverImage}
                label="รูปปก"
              />
            </CardContent>
          </Card>

          <SeoEditor value={seo} onChange={setSeo} />

          <Card>
            <CardHeader>
              <CardTitle>หมวดหมู่</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={form.category}
                onValueChange={(v) => handleChange("category", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="เลือกหมวดหมู่" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={String(cat.id)}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
