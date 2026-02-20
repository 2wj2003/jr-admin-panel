"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
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
import { MediaPicker } from "@/components/media-picker";
import { RichTextEditor } from "@/components/rich-text-editor";
import { SeoEditor, SeoData, emptySeo, parseSeoFromApi, seoToPayload } from "@/components/seo-editor";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

interface ProvinceOption {
  id: number;
  name: string;
}

const TYPE_OPTIONS = [
  { value: "CCTV", label: "CCTV" },
  { value: "SOLAR", label: "SOLAR" },
  { value: "ATG", label: "ATG" },
];

export default function ShowcaseEditPage() {
  const router = useRouter();
  const params = useParams();
  const showcaseId = params.id as string;
  const isNew = showcaseId === "new";

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [provinces, setProvinces] = useState<ProvinceOption[]>([]);
  const [coverImage, setCoverImage] = useState<MediaFile | null>(null);
  const [seo, setSeo] = useState<SeoData>({ ...emptySeo });

  const [form, setForm] = useState({
    title: "",
    slug: "",
    type: "CCTV",
    description: "",
    province: "",
  });

  const loadOptions = useCallback(async () => {
    try {
      const provRes = await fetchCollection("provinces", { pageSize: 100, sort: "name_th:ASC" });
      setProvinces(provRes.data.map((p) => ({ id: p.id, name: p.attributes.name_th })));
    } catch (error) {
      console.error("Failed to load provinces:", error);
    }
  }, []);

  const loadShowcase = useCallback(async () => {
    if (isNew) return;
    setLoading(true);
    try {
      const response = await fetchSingle("showcases", Number(showcaseId));
      const data = response.data;

      const provinceId = typeof data.province === "object" && data.province?.id
        ? String(data.province.id)
        : "";

      setForm({
        title: data.title || "",
        slug: data.slug || "",
        type: data.type || "CCTV",
        description: data.description || "",
        province: provinceId,
      });

      if (data.cover && typeof data.cover === "object" && data.cover.id) {
        setCoverImage(data.cover as MediaFile);
      }
      if (data.seo) {
        setSeo(parseSeoFromApi(data.seo));
      }
    } catch (error) {
      console.error("Failed to load showcase:", error);
      alert("ไม่สามารถโหลดข้อมูลผลงานได้");
      router.push("/showcases");
    } finally {
      setLoading(false);
    }
  }, [isNew, showcaseId, router]);

  useEffect(() => {
    loadOptions();
    loadShowcase();
  }, [loadOptions, loadShowcase]);

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

    if (!form.title || !form.slug || !form.type) {
      alert("กรุณากรอกข้อมูลที่จำเป็น: ชื่อผลงาน, Slug, ประเภท");
      return;
    }

    setSaving(true);
    try {
      const payload: Record<string, any> = {
        title: form.title,
        slug: form.slug,
        type: form.type,
        description: form.description,
        province: form.province ? Number(form.province) : null,
        cover: coverImage ? coverImage.id : null,
        seo: seoToPayload(seo),
      };

      if (isNew) {
        await createEntry("showcases", payload);
        alert("สร้างผลงานสำเร็จ");
      } else {
        await updateEntry("showcases", Number(showcaseId), payload);
        alert("บันทึกผลงานสำเร็จ");
      }
      router.push("/showcases");
    } catch (error: any) {
      console.error("Failed to save showcase:", error);
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
          <Button variant="ghost" size="sm" onClick={() => router.push("/showcases")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            กลับ
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isNew ? "สร้างผลงานใหม่" : "แก้ไขผลงาน"}
            </h1>
            {!isNew && (
              <p className="text-muted-foreground mt-1">ID: {showcaseId}</p>
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
              <CardTitle>ข้อมูลผลงาน</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">ชื่อผลงาน *</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="ชื่อผลงาน"
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
                    placeholder="showcase-slug"
                    required
                  />
                  <Button type="button" variant="outline" size="sm" onClick={generateSlug}>
                    สร้าง
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>รายละเอียด</Label>
                <RichTextEditor
                  value={form.description}
                  onChange={(val) => handleChange("description", val)}
                  placeholder="รายละเอียดผลงาน"
                  minHeight="200px"
                />
              </div>
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
              <CardTitle>ประเภท *</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={form.type}
                onValueChange={(v) => handleChange("type", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TYPE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>จังหวัด</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={form.province}
                onValueChange={(v) => handleChange("province", v === "none" ? "" : v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="เลือกจังหวัด" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">ไม่ระบุ</SelectItem>
                  {provinces.map((prov) => (
                    <SelectItem key={prov.id} value={String(prov.id)}>
                      {prov.name}
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
