"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  fetchMediaFiles,
  uploadFiles,
  getStrapiMediaUrl,
  MediaFile,
  StrapiPagination,
} from "@/lib/strapi";
import {
  Search,
  Upload,
  ChevronLeft,
  ChevronRight,
  FileImage,
  FileVideo,
  FileText,
  File,
  Loader2,
  X,
  Check,
  ImagePlus,
} from "lucide-react";

interface MediaPickerProps {
  value?: MediaFile | null;
  onChange: (file: MediaFile | null) => void;
  label?: string;
  accept?: string;
}

const PICKER_PAGE_SIZE = 18;

function isImageMime(mime: string) {
  return mime.startsWith("image/");
}

function getFileIcon(mime: string) {
  if (mime.startsWith("image/")) return FileImage;
  if (mime.startsWith("video/")) return FileVideo;
  if (mime.startsWith("text/") || mime.includes("pdf")) return FileText;
  return File;
}

export function MediaPicker({
  value,
  onChange,
  label = "รูปภาพ",
  accept = "image/*",
}: MediaPickerProps) {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [pagination, setPagination] = useState<StrapiPagination>({
    page: 1,
    pageSize: PICKER_PAGE_SIZE,
    pageCount: 1,
    total: 0,
  });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  const loadFiles = useCallback(async (page = 1, query = "") => {
    setLoading(true);
    try {
      const result = await fetchMediaFiles({
        page,
        pageSize: PICKER_PAGE_SIZE,
        sort: "createdAt:DESC",
        _q: query || undefined,
      });
      setFiles(result.results);
      setPagination(result.pagination);
    } catch (error) {
      console.error("Failed to load media:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      loadFiles();
      setSelectedId(value?.id || null);
    }
  }, [open, loadFiles, value]);

  const handleSearch = (val: string) => {
    setSearch(val);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      loadFiles(1, val);
    }, 400);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;
    setUploading(true);
    try {
      const uploaded = await uploadFiles(Array.from(selectedFiles));
      await loadFiles(1, search);
      if (uploaded.length > 0) {
        setSelectedId(uploaded[0].id);
      }
    } catch (error: any) {
      console.error("Upload failed:", error);
      alert(`อัปโหลดไม่สำเร็จ: ${error?.response?.data?.error?.message || error?.message || "Unknown"}`);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleConfirm = () => {
    const file = files.find((f) => f.id === selectedId) || null;
    onChange(file);
    setOpen(false);
  };

  const handleRemove = () => {
    onChange(null);
  };

  const previewUrl = value ? getStrapiMediaUrl(value) : "";

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {value && previewUrl ? (
        <div className="relative inline-block">
          <div className="w-40 h-40 rounded-lg border overflow-hidden bg-muted">
            {isImageMime(value.mime) ? (
              <Image
                src={previewUrl}
                alt={value.alternativeText || value.name}
                width={160}
                height={160}
                className="w-full h-full object-cover"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                {(() => {
                  const Icon = getFileIcon(value.mime);
                  return <Icon className="h-10 w-10 text-muted-foreground" />;
                })()}
              </div>
            )}
          </div>
          <Button
            variant="destructive"
            size="sm"
            className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
            onClick={handleRemove}
            type="button"
          >
            <X className="h-3 w-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="mt-2 w-full"
            onClick={() => setOpen(true)}
            type="button"
          >
            เปลี่ยนรูป
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          className="h-40 w-40 flex flex-col items-center justify-center gap-2 border-dashed"
          onClick={() => setOpen(true)}
          type="button"
        >
          <ImagePlus className="h-8 w-8 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">เลือก{label}</span>
        </Button>
      )}

      {/* Picker Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>เลือก{label}</DialogTitle>
            <DialogDescription>
              เลือกไฟล์จาก Media Library หรืออัปโหลดไฟล์ใหม่
            </DialogDescription>
          </DialogHeader>

          {/* Toolbar */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ค้นหาไฟล์..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={accept}
              className="hidden"
              onChange={handleUpload}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              type="button"
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              อัปโหลด
            </Button>
          </div>

          {/* File Grid */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : files.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <FileImage className="h-10 w-10 mx-auto mb-3 opacity-50" />
                <p>ไม่พบไฟล์</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 py-2">
                {files.map((file) => {
                  const isImage = isImageMime(file.mime);
                  const thumbUrl =
                    file.formats?.thumbnail?.url || file.formats?.small?.url;
                  const displayUrl = thumbUrl
                    ? getStrapiMediaUrl({ url: thumbUrl })
                    : isImage
                    ? getStrapiMediaUrl(file)
                    : "";
                  const isSelected = selectedId === file.id;
                  const FileIcon = getFileIcon(file.mime);

                  return (
                    <div
                      key={file.id}
                      className={`relative aspect-square rounded-lg border-2 overflow-hidden cursor-pointer transition-all ${
                        isSelected
                          ? "border-primary ring-2 ring-primary/30"
                          : "border-transparent hover:border-muted-foreground/30"
                      }`}
                      onClick={() => setSelectedId(file.id)}
                    >
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        {isImage && displayUrl ? (
                          <Image
                            src={displayUrl}
                            alt={file.alternativeText || file.name}
                            width={120}
                            height={120}
                            className="w-full h-full object-cover"
                            unoptimized
                          />
                        ) : (
                          <FileIcon className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>
                      {isSelected && (
                        <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full p-0.5">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-1 py-0.5">
                        <p className="text-[10px] text-white truncate">
                          {file.name}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination.pageCount > 1 && (
            <div className="flex items-center justify-between pt-2 border-t">
              <p className="text-xs text-muted-foreground">
                หน้า {pagination.page}/{pagination.pageCount}
              </p>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page <= 1}
                  onClick={() => loadFiles(pagination.page - 1, search)}
                  type="button"
                >
                  <ChevronLeft className="h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page >= pagination.pageCount}
                  onClick={() => loadFiles(pagination.page + 1, search)}
                  type="button"
                >
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              type="button"
            >
              ยกเลิก
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!selectedId}
              type="button"
            >
              เลือกไฟล์นี้
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
