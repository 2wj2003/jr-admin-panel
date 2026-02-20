"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  fetchMediaFiles,
  uploadFiles,
  deleteMediaFile,
  getStrapiMediaUrl,
  MediaFile,
  StrapiPagination,
} from "@/lib/strapi";
import {
  Search,
  Upload,
  Trash2,
  ChevronLeft,
  ChevronRight,
  FileImage,
  FileVideo,
  FileText,
  File,
  X,
  Loader2,
  Eye,
  Copy,
  Check,
  LayoutGrid,
  List,
} from "lucide-react";
import dayjs from "dayjs";

const PAGE_SIZE = 24;

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(mime: string) {
  if (mime.startsWith("image/")) return FileImage;
  if (mime.startsWith("video/")) return FileVideo;
  if (mime.startsWith("text/") || mime.includes("pdf")) return FileText;
  return File;
}

function isImageMime(mime: string) {
  return mime.startsWith("image/");
}

export default function MediaLibraryPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [pagination, setPagination] = useState<StrapiPagination>({
    page: 1,
    pageSize: PAGE_SIZE,
    pageCount: 1,
    total: 0,
  });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  const loadFiles = useCallback(
    async (page = 1, query = "") => {
      setLoading(true);
      try {
        const result = await fetchMediaFiles({
          page,
          pageSize: PAGE_SIZE,
          sort: "createdAt:DESC",
          _q: query || undefined,
        });
        setFiles(result.results);
        setPagination(result.pagination);
      } catch (error) {
        console.error("Failed to load media files:", error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  const handleSearch = (value: string) => {
    setSearch(value);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      loadFiles(1, value);
    }, 400);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    setUploading(true);
    try {
      const fileArray = Array.from(selectedFiles);
      await uploadFiles(fileArray);
      await loadFiles(pagination.page, search);
    } catch (error: any) {
      console.error("Upload failed:", error);
      alert(
        `อัปโหลดไม่สำเร็จ: ${error?.response?.data?.error?.message || error?.message || "Unknown error"}`
      );
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (file: MediaFile) => {
    if (!confirm(`ต้องการลบไฟล์ "${file.name}" หรือไม่?`)) return;
    setDeleting(file.id);
    try {
      await deleteMediaFile(file.id);
      await loadFiles(pagination.page, search);
      if (selectedFile?.id === file.id) {
        setDetailOpen(false);
        setSelectedFile(null);
      }
    } catch (error: any) {
      console.error("Delete failed:", error);
      alert(
        `ลบไม่สำเร็จ: ${error?.response?.data?.error?.message || error?.message || "Unknown error"}`
      );
    } finally {
      setDeleting(null);
    }
  };

  const handleCopyUrl = (file: MediaFile) => {
    const url = getStrapiMediaUrl(file);
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openDetail = (file: MediaFile) => {
    setSelectedFile(file);
    setDetailOpen(true);
    setCopied(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Media Library</h1>
          <p className="text-muted-foreground mt-1">
            จัดการไฟล์สื่อทั้งหมดในระบบ ({pagination.total} ไฟล์)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*,application/pdf,.doc,.docx,.xls,.xlsx"
            className="hidden"
            onChange={handleUpload}
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            {uploading ? "กำลังอัปโหลด..." : "อัปโหลดไฟล์"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ค้นหาไฟล์..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-1 border rounded-md">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : files.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <FileImage className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">ไม่พบไฟล์</p>
              <p className="text-sm mt-1">
                {search
                  ? "ลองค้นหาด้วยคำอื่น"
                  : "เริ่มต้นด้วยการอัปโหลดไฟล์"}
              </p>
            </div>
          ) : viewMode === "grid" ? (
            /* Grid View */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {files.map((file) => {
                const FileIcon = getFileIcon(file.mime);
                const isImage = isImageMime(file.mime);
                const thumbUrl =
                  file.formats?.thumbnail?.url || file.formats?.small?.url;
                const displayUrl = thumbUrl
                  ? getStrapiMediaUrl({ url: thumbUrl })
                  : isImage
                  ? getStrapiMediaUrl(file)
                  : "";

                return (
                  <div
                    key={file.id}
                    className="group relative border rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                    onClick={() => openDetail(file)}
                  >
                    <div className="aspect-square bg-muted flex items-center justify-center">
                      {isImage && displayUrl ? (
                        <Image
                          src={displayUrl}
                          alt={file.alternativeText || file.name}
                          width={200}
                          height={200}
                          className="w-full h-full object-cover"
                          unoptimized
                        />
                      ) : (
                        <FileIcon className="h-10 w-10 text-muted-foreground" />
                      )}
                    </div>
                    <div className="p-2">
                      <p className="text-xs font-medium truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size * 1024)}
                      </p>
                    </div>
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(file);
                      }}
                      disabled={deleting === file.id}
                    >
                      {deleting === file.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Trash2 className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>
          ) : (
            /* List View */
            <div className="space-y-1">
              {files.map((file) => {
                const FileIcon = getFileIcon(file.mime);
                const isImage = isImageMime(file.mime);
                const thumbUrl = file.formats?.thumbnail?.url;
                const displayUrl = thumbUrl
                  ? getStrapiMediaUrl({ url: thumbUrl })
                  : isImage
                  ? getStrapiMediaUrl(file)
                  : "";

                return (
                  <div
                    key={file.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer group"
                    onClick={() => openDetail(file)}
                  >
                    <div className="w-10 h-10 rounded bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {isImage && displayUrl ? (
                        <Image
                          src={displayUrl}
                          alt={file.alternativeText || file.name}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                          unoptimized
                        />
                      ) : (
                        <FileIcon className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {file.ext} · {formatFileSize(file.size * 1024)}
                        {file.width && file.height
                          ? ` · ${file.width}×${file.height}`
                          : ""}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {dayjs(file.createdAt).format("DD/MM/YYYY")}
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyUrl(file);
                        }}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(file);
                        }}
                        disabled={deleting === file.id}
                      >
                        {deleting === file.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Trash2 className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {pagination.pageCount > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                หน้า {pagination.page} จาก {pagination.pageCount} (
                {pagination.total} ไฟล์)
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page <= 1}
                  onClick={() => loadFiles(pagination.page - 1, search)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page >= pagination.pageCount}
                  onClick={() => loadFiles(pagination.page + 1, search)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* File Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>รายละเอียดไฟล์</DialogTitle>
            <DialogDescription>
              ข้อมูลและ URL ของไฟล์สื่อ
            </DialogDescription>
          </DialogHeader>
          {selectedFile && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Preview */}
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                {isImageMime(selectedFile.mime) ? (
                  <Image
                    src={getStrapiMediaUrl(selectedFile)}
                    alt={selectedFile.alternativeText || selectedFile.name}
                    width={400}
                    height={400}
                    className="w-full h-full object-contain"
                    unoptimized
                  />
                ) : (
                  (() => {
                    const Icon = getFileIcon(selectedFile.mime);
                    return <Icon className="h-16 w-16 text-muted-foreground" />;
                  })()
                )}
              </div>

              {/* Info */}
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground">
                    ชื่อไฟล์
                  </Label>
                  <p className="text-sm font-medium break-all">
                    {selectedFile.name}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      ประเภท
                    </Label>
                    <p className="text-sm">{selectedFile.mime}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      ขนาด
                    </Label>
                    <p className="text-sm">
                      {formatFileSize(selectedFile.size * 1024)}
                    </p>
                  </div>
                </div>
                {selectedFile.width && selectedFile.height && (
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      ขนาดภาพ
                    </Label>
                    <p className="text-sm">
                      {selectedFile.width} × {selectedFile.height} px
                    </p>
                  </div>
                )}
                <div>
                  <Label className="text-xs text-muted-foreground">
                    อัปโหลดเมื่อ
                  </Label>
                  <p className="text-sm">
                    {dayjs(selectedFile.createdAt).format(
                      "DD/MM/YYYY HH:mm"
                    )}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Provider
                  </Label>
                  <Badge variant="outline">{selectedFile.provider}</Badge>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">URL</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      readOnly
                      value={getStrapiMediaUrl(selectedFile)}
                      className="text-xs h-8"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-2 flex-shrink-0"
                      onClick={() => handleCopyUrl(selectedFile)}
                    >
                      {copied ? (
                        <Check className="h-3 w-3 text-green-600" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => selectedFile && handleDelete(selectedFile)}
              disabled={deleting === selectedFile?.id}
            >
              {deleting === selectedFile?.id ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              ลบไฟล์
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
