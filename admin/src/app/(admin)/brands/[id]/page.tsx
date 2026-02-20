"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { fetchSingle, updateEntry, createEntry, getStrapiMediaUrl, MediaFile } from "@/lib/strapi";
import { MediaPicker } from "@/components/media-picker";
import { RichTextEditor } from "@/components/rich-text-editor";
import { SeoEditor, SeoData, emptySeo, parseSeoFromApi, seoToPayload } from "@/components/seo-editor";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function BrandEditPage() {
  const router = useRouter();
  const params = useParams();
  const brandId = params.id as string;
  const isNew = brandId === "new";

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [logo, setLogo] = useState<MediaFile | null>(null);
  const [seo, setSeo] = useState<SeoData>({ ...emptySeo });

  const [form, setForm] = useState({
    name: "",
    slug: "",
    content: "",
  });

  const loadBrand = useCallback(async () => {
    if (isNew) return;
    setLoading(true);
    try {
      const response = await fetchSingle("brands", Number(brandId));
      const data = response.data;

      setForm({
        name: data.name || "",
        slug: data.slug || "",
        content: data.content || "",
      });

      if (data.logo && typeof data.logo === "object" && data.logo.id) {
        setLogo(data.logo as MediaFile);
      }
      if (data.seo) {
        setSeo(parseSeoFromApi(data.seo));
      }
    } catch (error) {
      console.error("Failed to load brand:", error);
      toast.error("ไม่สามารถโหลดข้อมูลแบรนด์ได้");
      router.push("/brands");
    } finally {
      setLoading(false);
    }
  }, [isNew, brandId, router]);

  useEffect(() => {
    loadBrand();
  }, [loadBrand]);

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
      toast.error("กรุณากรอกข้อมูลที่จำเป็น: ชื่อแบรนด์, Slug");
      return;
    }

    setSaving(true);
    try {
      const payload: Record<string, any> = {
        name: form.name,
        slug: form.slug,
        content: form.content,
        logo: logo ? logo.id : null,
        seo: seoToPayload(seo),
      };

      if (isNew) {
        await createEntry("brands", payload);
        toast.success("สร้างแบรนด์สำเร็จ");
      } else {
        await updateEntry("brands", Number(brandId), payload);
        toast.success("บันทึกแบรนด์สำเร็จ");
      }
      router.push("/brands");
    } catch (error: any) {
      console.error("Failed to save brand:", error);
      const message = error?.response?.data?.error?.message || "ไม่สามารถบันทึกข้อมูลได้";
      toast.error(message);
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
          <Button variant="ghost" size="sm" onClick={() => router.push("/brands")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            กลับ
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isNew ? "สร้างแบรนด์ใหม่" : "แก้ไขแบรนด์"}
            </h1>
            {!isNew && (
              <p className="text-muted-foreground mt-1">ID: {brandId}</p>
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
              <CardTitle>ข้อมูลแบรนด์</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">ชื่อแบรนด์ *</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="ชื่อแบรนด์"
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
                    placeholder="brand-slug"
                    required
                  />
                  <Button type="button" variant="outline" size="sm" onClick={generateSlug}>
                    สร้าง
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>เนื้อหา</Label>
                <RichTextEditor
                  value={form.content}
                  onChange={(val) => handleChange("content", val)}
                  placeholder="รายละเอียดแบรนด์"
                  minHeight="200px"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <SeoEditor value={seo} onChange={setSeo} />

          <Card>
            <CardHeader>
              <CardTitle>โลโก้</CardTitle>
            </CardHeader>
            <CardContent>
              <MediaPicker
                value={logo}
                onChange={setLogo}
                label="โลโก้"
              />
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
