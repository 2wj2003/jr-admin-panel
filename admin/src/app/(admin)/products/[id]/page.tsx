"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { fetchSingle, fetchCollection, updateEntry, createEntry, getStrapiMediaUrl, MediaFile } from "@/lib/strapi";
import { api } from "@/lib/api";
import { MediaPicker } from "@/components/media-picker";
import { RichTextEditor } from "@/components/rich-text-editor";
import { SeoEditor, SeoData, emptySeo, parseSeoFromApi, seoToPayload } from "@/components/seo-editor";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

interface CategoryOption {
  id: number;
  name: string;
}

interface BrandOption {
  id: number;
  name: string;
}

const RESOLUTION_OPTIONS = [
  { value: "", label: "ไม่ระบุ" },
  { value: "cctv-2mp", label: "2MP" },
  { value: "cctv-3mp", label: "3MP" },
  { value: "cctv-4mp", label: "4MP" },
  { value: "cctv-5mp", label: "5MP" },
  { value: "cctv-8mp", label: "8MP" },
];

const WARRANTY_UNIT_OPTIONS = [
  { value: "DAYS", label: "วัน" },
  { value: "MONTHS", label: "เดือน" },
  { value: "YEARS", label: "ปี" },
];

export default function ProductEditPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const isNew = productId === "new";

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [brands, setBrands] = useState<BrandOption[]>([]);
  const [coverImage, setCoverImage] = useState<MediaFile | null>(null);
  const [seo, setSeo] = useState<SeoData>({ ...emptySeo });

  // Form state
  const [form, setForm] = useState({
    name: "",
    slug: "",
    sku: "",
    originalPrice: 0,
    discountPrice: 0,
    description: "",
    keyFeature: "",
    specification: "",
    warrantyDuration: 3,
    warrantyDurationUnit: "YEARS",
    warrantyDescription: "",
    installation: false,
    resolution: "",
    position: 9999,
    instalment: 0,
    category: "",
    brands: [] as number[],
  });

  // Load categories and brands for dropdowns
  const loadOptions = useCallback(async () => {
    try {
      const [catRes, brandRes] = await Promise.all([
        fetchCollection("categories", { pageSize: 100, sort: "name:ASC" }),
        fetchCollection("brands", { pageSize: 100, sort: "name:ASC" }),
      ]);
      setCategories(catRes.data.map((c) => ({ id: c.id, name: c.attributes.name })));
      setBrands(brandRes.data.map((b) => ({ id: b.id, name: b.attributes.name })));
    } catch (error) {
      console.error("Failed to load options:", error);
    }
  }, []);

  // Load existing product data
  const loadProduct = useCallback(async () => {
    if (isNew) return;
    setLoading(true);
    try {
      const response = await fetchSingle("products", Number(productId));
      const data = response.data;

      // Relations from Content Manager API may be { count: N } or array or object with id
      const brandIds: number[] = Array.isArray(data.brands)
        ? data.brands.map((b: any) => b.id)
        : [];
      const categoryId = typeof data.category === "object" && data.category?.id
        ? String(data.category.id)
        : "";

      setForm({
        name: data.name || "",
        slug: data.slug || "",
        sku: data.sku || "",
        originalPrice: data.originalPrice || 0,
        discountPrice: data.discountPrice || 0,
        description: data.description || "",
        keyFeature: data.keyFeature || "",
        specification: data.specification || "",
        warrantyDuration: data.warrantyDuration ?? 3,
        warrantyDurationUnit: data.warrantyDurationUnit || "YEARS",
        warrantyDescription: data.warrantyDescription || "",
        installation: data.installation || false,
        resolution: data.resolution || "",
        position: data.position ?? 9999,
        instalment: data.instalment || 0,
        category: categoryId,
        brands: brandIds,
      });

      if (data.coverImage && typeof data.coverImage === "object" && data.coverImage.id) {
        setCoverImage(data.coverImage as MediaFile);
      }
      if (data.seo) {
        setSeo(parseSeoFromApi(data.seo));
      }
    } catch (error: any) {
      console.error("Failed to load product:", error);
      console.error("Error response:", error?.response?.status, error?.response?.data);
      alert(`ไม่สามารถโหลดข้อมูลสินค้าได้: ${error?.response?.status || "unknown"} - ${JSON.stringify(error?.response?.data?.error?.message || error?.message || "unknown error")}`);
    } finally {
      setLoading(false);
    }
  }, [isNew, productId, router]);

  useEffect(() => {
    loadOptions();
    loadProduct();
  }, [loadOptions, loadProduct]);

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

    if (!form.name || !form.slug || !form.sku) {
      alert("กรุณากรอกข้อมูลที่จำเป็น: ชื่อสินค้า, Slug, SKU");
      return;
    }

    setSaving(true);
    try {
      const payload: Record<string, any> = {
        name: form.name,
        slug: form.slug,
        sku: form.sku,
        originalPrice: Number(form.originalPrice),
        discountPrice: form.discountPrice ? Number(form.discountPrice) : null,
        description: form.description,
        keyFeature: form.keyFeature,
        specification: form.specification,
        warrantyDuration: Number(form.warrantyDuration),
        warrantyDurationUnit: form.warrantyDurationUnit,
        warrantyDescription: form.warrantyDescription,
        installation: form.installation,
        resolution: form.resolution || null,
        position: Number(form.position),
        instalment: Number(form.instalment),
        category: form.category ? Number(form.category) : null,
        brands: form.brands,
        coverImage: coverImage ? coverImage.id : null,
        seo: seoToPayload(seo),
      };

      if (isNew) {
        await createEntry("products", payload);
        alert("สร้างสินค้าสำเร็จ");
      } else {
        await updateEntry("products", Number(productId), payload);
        alert("บันทึกสินค้าสำเร็จ");
      }
      router.push("/products");
    } catch (error: any) {
      console.error("Failed to save product:", error);
      const message = error?.response?.data?.error?.message || "ไม่สามารถบันทึกข้อมูลได้";
      alert(message);
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (isNew) return;
    try {
      const uid = "api::product.product";
      await api.post(`/content-manager/collection-types/${uid}/${productId}/actions/publish`);
      alert("เผยแพร่สินค้าสำเร็จ");
      loadProduct();
    } catch (error) {
      console.error("Failed to publish:", error);
      alert("ไม่สามารถเผยแพร่ได้");
    }
  };

  const handleUnpublish = async () => {
    if (isNew) return;
    try {
      const uid = "api::product.product";
      await api.post(`/content-manager/collection-types/${uid}/${productId}/actions/unpublish`);
      alert("ยกเลิกเผยแพร่สำเร็จ");
      loadProduct();
    } catch (error) {
      console.error("Failed to unpublish:", error);
      alert("ไม่สามารถยกเลิกเผยแพร่ได้");
    }
  };

  const toggleBrand = (brandId: number) => {
    setForm((prev) => ({
      ...prev,
      brands: prev.brands.includes(brandId)
        ? prev.brands.filter((id) => id !== brandId)
        : [...prev.brands, brandId],
    }));
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
          <Button variant="ghost" size="sm" onClick={() => router.push("/products")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            กลับ
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isNew ? "สร้างสินค้าใหม่" : "แก้ไขสินค้า"}
            </h1>
            {!isNew && (
              <p className="text-muted-foreground mt-1">ID: {productId}</p>
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
        {/* Main content - 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>ข้อมูลพื้นฐาน</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">ชื่อสินค้า *</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="ชื่อสินค้า"
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="slug"
                      value={form.slug}
                      onChange={(e) => handleChange("slug", e.target.value)}
                      placeholder="product-slug"
                      required
                    />
                    <Button type="button" variant="outline" size="sm" onClick={generateSlug}>
                      สร้าง
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU *</Label>
                  <Input
                    id="sku"
                    value={form.sku}
                    onChange={(e) => handleChange("sku", e.target.value)}
                    placeholder="SKU-001"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>ราคา</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="originalPrice">ราคาปกติ (บาท) *</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    min={0}
                    value={form.originalPrice}
                    onChange={(e) => handleChange("originalPrice", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discountPrice">ราคาลด (บาท)</Label>
                  <Input
                    id="discountPrice"
                    type="number"
                    min={0}
                    value={form.discountPrice}
                    onChange={(e) => handleChange("discountPrice", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instalment">ผ่อนชำระ (เดือน)</Label>
                  <Input
                    id="instalment"
                    type="number"
                    min={0}
                    value={form.instalment}
                    onChange={(e) => handleChange("instalment", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>รายละเอียด</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>รายละเอียดสินค้า</Label>
                <RichTextEditor
                  value={form.description}
                  onChange={(val) => handleChange("description", val)}
                  placeholder="รายละเอียดสินค้า"
                  minHeight="180px"
                />
              </div>
              <div className="space-y-2">
                <Label>จุดเด่น</Label>
                <RichTextEditor
                  value={form.keyFeature}
                  onChange={(val) => handleChange("keyFeature", val)}
                  placeholder="จุดเด่นของสินค้า"
                  minHeight="120px"
                />
              </div>
              <div className="space-y-2">
                <Label>สเปค</Label>
                <RichTextEditor
                  value={form.specification}
                  onChange={(val) => handleChange("specification", val)}
                  placeholder="สเปคสินค้า"
                  minHeight="120px"
                />
              </div>
            </CardContent>
          </Card>

          {/* Warranty */}
          <Card>
            <CardHeader>
              <CardTitle>การรับประกัน</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="warrantyDuration">ระยะเวลารับประกัน</Label>
                  <Input
                    id="warrantyDuration"
                    type="number"
                    min={0}
                    value={form.warrantyDuration}
                    onChange={(e) => handleChange("warrantyDuration", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>หน่วย</Label>
                  <Select
                    value={form.warrantyDurationUnit}
                    onValueChange={(v) => handleChange("warrantyDurationUnit", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {WARRANTY_UNIT_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="warrantyDescription">รายละเอียดการรับประกัน</Label>
                <Textarea
                  id="warrantyDescription"
                  value={form.warrantyDescription}
                  onChange={(e) => handleChange("warrantyDescription", e.target.value)}
                  placeholder="รายละเอียดการรับประกัน"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - 1 column */}
        <div className="space-y-6">
          {/* Cover Image */}
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

          {/* SEO */}
          <SeoEditor value={seo} onChange={setSeo} />

          {/* Category */}
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

          {/* Brands */}
          <Card>
            <CardHeader>
              <CardTitle>แบรนด์</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {brands.map((brand) => (
                  <Badge
                    key={brand.id}
                    variant={form.brands.includes(brand.id) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleBrand(brand.id)}
                  >
                    {brand.name}
                  </Badge>
                ))}
              </div>
              {brands.length === 0 && (
                <p className="text-sm text-muted-foreground">ไม่มีแบรนด์</p>
              )}
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle>ตั้งค่า</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>ความละเอียด</Label>
                <Select
                  value={form.resolution}
                  onValueChange={(v) => handleChange("resolution", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกความละเอียด" />
                  </SelectTrigger>
                  <SelectContent>
                    {RESOLUTION_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value || "none"} value={opt.value || "none"}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">ลำดับการแสดง</Label>
                <Input
                  id="position"
                  type="number"
                  value={form.position}
                  onChange={(e) => handleChange("position", e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="installation">รวมติดตั้ง</Label>
                <Switch
                  id="installation"
                  checked={form.installation}
                  onCheckedChange={(v) => handleChange("installation", v)}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
