"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, Save, X, GripVertical } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "react-hot-toast";

interface FeaturedCategory {
  id: number;
  title: string;
  order: number;
  description: string;
  isActive: boolean;
  category?: any;
  image?: any;
}

export default function FeaturedCategoriesPage() {
  const [categories, setCategories] = useState<FeaturedCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    order: 1,
    description: "",
    isActive: true,
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await api.get("/api/featured-categories?sort=order:asc");
      setCategories(response.data.data.map((item: any) => ({
        id: item.id,
        ...item.attributes,
      })));
    } catch (error) {
      toast.error("ไม่สามารถโหลดข้อมูลได้");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/content-manager/collection-types/api::featured-category.featured-category/${editingId}`, formData);
        toast.success("แก้ไขสำเร็จ");
      } else {
        await api.post("/content-manager/collection-types/api::featured-category.featured-category", formData);
        toast.success("เพิ่มสำเร็จ");
      }
      setFormData({ title: "", order: 1, description: "", isActive: true });
      setEditingId(null);
      loadCategories();
    } catch (error) {
      toast.error("เกิดข้อผิดพลาด");
    }
  };

  const handleEdit = (cat: FeaturedCategory) => {
    setEditingId(cat.id);
    setFormData({
      title: cat.title,
      order: cat.order,
      description: cat.description,
      isActive: cat.isActive,
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("ต้องการลบรายการนี้?")) return;
    try {
      await api.delete(`/content-manager/collection-types/api::featured-category.featured-category/${id}`);
      toast.success("ลบสำเร็จ");
      loadCategories();
    } catch (error) {
      toast.error("ไม่สามารถลบได้");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ title: "", order: 1, description: "", isActive: true });
  };

  if (loading) {
    return <div className="p-8">กำลังโหลด...</div>;
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">จัดการหมวดหมู่หน้าแรก</h1>
        <p className="text-slate-600 mt-2">จัดการ 6 หมวดหมู่ที่แสดงบนหน้าแรกของเว็บไซต์</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <Card className="p-6 lg:col-span-1">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? "แก้ไขหมวดหมู่" : "เพิ่มหมวดหมู่ใหม่"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">ชื่อหมวดหมู่ *</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="ชุดกล้องพร้อมติดตั้งระบบ Analog"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">ลำดับ (1-6) *</label>
              <Input
                type="number"
                min={1}
                max={6}
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">คำอธิบาย</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="ชุดกล้องวงจรปิดระบบ Analog คุณภาพสูง พร้อมติดตั้ง"
                rows={3}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="isActive" className="text-sm font-medium">แสดงบนหน้าเว็บ</label>
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                {editingId ? "บันทึก" : "เพิ่ม"}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={handleCancel}>
                  <X className="w-4 h-4 mr-2" />
                  ยกเลิก
                </Button>
              )}
            </div>
          </form>
        </Card>

        {/* List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">รายการหมวดหมู่ ({categories.length}/6)</h2>
          </div>

          {categories.length === 0 ? (
            <Card className="p-8 text-center text-slate-500">
              ยังไม่มีหมวดหมู่ เพิ่มหมวดหมู่แรกของคุณ
            </Card>
          ) : (
            <div className="space-y-3">
              {categories.map((cat) => (
                <Card key={cat.id} className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center gap-2 text-slate-400">
                      <GripVertical className="w-5 h-5" />
                      <span className="font-semibold text-lg">{cat.order}</span>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-slate-900">{cat.title}</h3>
                      {cat.description && (
                        <p className="text-sm text-slate-600 mt-1">{cat.description}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-xs px-2 py-1 rounded ${cat.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                          {cat.isActive ? "แสดง" : "ซ่อน"}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(cat)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(cat.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
