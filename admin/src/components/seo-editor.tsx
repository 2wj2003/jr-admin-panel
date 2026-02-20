"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MediaPicker } from "@/components/media-picker";
import { MediaFile } from "@/lib/strapi";
import { Search, ChevronDown, ChevronUp } from "lucide-react";

export interface SeoData {
  metaTitle: string;
  metaDescription: string;
  metaImage: MediaFile | null;
  keywords: string;
  metaRobots: string;
  metaViewport: string;
  canonicalURL: string;
  structuredData: string;
}

export const emptySeo: SeoData = {
  metaTitle: "",
  metaDescription: "",
  metaImage: null,
  keywords: "",
  metaRobots: "",
  metaViewport: "",
  canonicalURL: "",
  structuredData: "",
};

export function parseSeoFromApi(seo: any): SeoData {
  if (!seo || typeof seo !== "object") return { ...emptySeo };
  return {
    metaTitle: seo.metaTitle || "",
    metaDescription: seo.metaDescription || "",
    metaImage:
      seo.metaImage && typeof seo.metaImage === "object" && seo.metaImage.id
        ? seo.metaImage
        : null,
    keywords: seo.keywords || "",
    metaRobots: seo.metaRobots || "",
    metaViewport: seo.metaViewport || "",
    canonicalURL: seo.canonicalURL || "",
    structuredData: seo.structuredData
      ? typeof seo.structuredData === "string"
        ? seo.structuredData
        : JSON.stringify(seo.structuredData, null, 2)
      : "",
  };
}

export function seoToPayload(seo: SeoData): Record<string, any> {
  const payload: Record<string, any> = {};

  // Only include fields that have values
  if (seo.metaTitle) payload.metaTitle = seo.metaTitle;
  if (seo.metaDescription) payload.metaDescription = seo.metaDescription;
  if (seo.metaImage) payload.metaImage = seo.metaImage.id;
  if (seo.keywords) payload.keywords = seo.keywords;
  if (seo.metaRobots) payload.metaRobots = seo.metaRobots;
  if (seo.metaViewport) payload.metaViewport = seo.metaViewport;
  if (seo.canonicalURL) payload.canonicalURL = seo.canonicalURL;

  if (seo.structuredData) {
    try {
      payload.structuredData = JSON.parse(seo.structuredData);
    } catch {
      // Skip structuredData if invalid JSON
    }
  }

  return payload;
}

interface SeoEditorProps {
  value: SeoData;
  onChange: (seo: SeoData) => void;
}

export function SeoEditor({ value, onChange }: SeoEditorProps) {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (field: keyof SeoData, val: any) => {
    onChange({ ...value, [field]: val });
  };

  return (
    <Card>
      <CardHeader
        className="cursor-pointer select-none"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">SEO</CardTitle>
            {value.metaTitle && (
              <span className="text-xs text-muted-foreground ml-2 truncate max-w-[200px]">
                — {value.metaTitle}
              </span>
            )}
          </div>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" type="button">
            {expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      {expanded && (
        <CardContent className="space-y-4 pt-0">
          {/* Meta Title */}
          <div className="space-y-2">
            <Label>
              Meta Title{" "}
              <span className="text-muted-foreground text-xs">
                ({value.metaTitle.length}/60)
              </span>
            </Label>
            <Input
              value={value.metaTitle}
              onChange={(e) => handleChange("metaTitle", e.target.value)}
              placeholder="Page title for search engines"
              maxLength={60}
            />
          </div>

          {/* Meta Description */}
          <div className="space-y-2">
            <Label>
              Meta Description{" "}
              <span className="text-muted-foreground text-xs">
                ({value.metaDescription.length}/160, ขั้นต่ำ 50)
              </span>
            </Label>
            <Textarea
              value={value.metaDescription}
              onChange={(e) => handleChange("metaDescription", e.target.value)}
              placeholder="Short description for search engines (50-160 chars)"
              rows={3}
              maxLength={160}
            />
          </div>

          {/* Meta Image */}
          <MediaPicker
            value={value.metaImage}
            onChange={(file) => handleChange("metaImage", file)}
            label="Meta Image (og:image)"
          />

          {/* Keywords */}
          <div className="space-y-2">
            <Label>Keywords</Label>
            <Input
              value={value.keywords}
              onChange={(e) => handleChange("keywords", e.target.value)}
              placeholder="keyword1, keyword2, keyword3"
            />
            <p className="text-xs text-muted-foreground">คั่นด้วยเครื่องหมายจุลภาค (,)</p>
          </div>

          {/* Canonical URL */}
          <div className="space-y-2">
            <Label>Canonical URL</Label>
            <Input
              value={value.canonicalURL}
              onChange={(e) => handleChange("canonicalURL", e.target.value)}
              placeholder="https://example.com/page"
            />
          </div>

          {/* Meta Robots */}
          <div className="space-y-2">
            <Label>Meta Robots</Label>
            <Input
              value={value.metaRobots}
              onChange={(e) => handleChange("metaRobots", e.target.value)}
              placeholder="index, follow"
            />
          </div>

          {/* Meta Viewport */}
          <div className="space-y-2">
            <Label>Meta Viewport</Label>
            <Input
              value={value.metaViewport}
              onChange={(e) => handleChange("metaViewport", e.target.value)}
              placeholder="width=device-width, initial-scale=1"
            />
          </div>

          {/* Structured Data */}
          <div className="space-y-2">
            <Label>Structured Data (JSON-LD)</Label>
            <Textarea
              value={value.structuredData}
              onChange={(e) => handleChange("structuredData", e.target.value)}
              placeholder='{"@context": "https://schema.org", ...}'
              rows={4}
              className="font-mono text-xs"
            />
          </div>

          {/* Google Preview */}
          {(value.metaTitle || value.metaDescription) && (
            <div className="border rounded-lg p-4 bg-white">
              <p className="text-xs text-muted-foreground mb-1">ตัวอย่าง Google Search</p>
              <p className="text-blue-700 text-base font-medium leading-tight hover:underline cursor-pointer">
                {value.metaTitle || "ชื่อหน้า"}
              </p>
              <p className="text-green-700 text-xs mt-0.5">
                {value.canonicalURL || "https://example.com/page"}
              </p>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {value.metaDescription || "คำอธิบายหน้า..."}
              </p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
