"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchActivityLogs, ActivityLog } from "@/lib/strapi";
import { LogActions, LogEntities } from "@/lib/activity-log";
import { Search, Filter, RefreshCw, History, User, Calendar, Activity } from "lucide-react";
import dayjs from "dayjs";

const PAGE_SIZE = 25;

export default function ActivityLogPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: PAGE_SIZE,
    pageCount: 1,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [entityFilter, setEntityFilter] = useState("");

  const loadLogs = useCallback(async (page: number, searchQuery: string, action: string, entity: string) => {
    setLoading(true);
    try {
      const filters: Record<string, any> = {};
      if (searchQuery) filters._q = searchQuery;
      if (action) filters.action = action;
      if (entity) filters.entity = entity;

      const response = await fetchActivityLogs({
        page,
        pageSize: PAGE_SIZE,
        sort: "timestamp:desc",
        filters,
      });
      setLogs(response.results);
      setPagination(response.pagination);
    } catch (error) {
      console.error("Failed to load activity logs:", error);
      setLogs([]);
      setPagination({ page: 1, pageSize: PAGE_SIZE, pageCount: 1, total: 0 });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLogs(1, search, actionFilter, entityFilter);
  }, [loadLogs, search, actionFilter, entityFilter]);

  const handleSearch = () => {
    loadLogs(1, search, actionFilter, entityFilter);
  };

  const handlePageChange = (page: number) => {
    loadLogs(page, search, actionFilter, entityFilter);
  };

  const handleRefresh = () => {
    loadLogs(pagination.page, search, actionFilter, entityFilter);
  };

  const getActionBadge = (action: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      create: "default",
      update: "secondary",
      delete: "destructive",
      login: "outline",
      logout: "outline",
      publish: "default",
      unpublish: "secondary",
      upload: "secondary",
      download: "outline",
      view: "outline",
      export: "outline",
      import: "outline",
      settings_update: "secondary",
    };
    return variants[action] || "outline";
  };

  const getActionIcon = (action: string) => {
    const icons: Record<string, string> = {
      create: "➕",
      update: "✏️",
      delete: "🗑️",
      login: "🔑",
      logout: "🚪",
      publish: "📢",
      unpublish: "🔇",
      upload: "📤",
      download: "📥",
      view: "👁️",
      export: "📊",
      import: "📋",
      settings_update: "⚙️",
    };
    return icons[action] || "📝";
  };

  const getEntityBadge = (entity: string) => {
    const colors: Record<string, string> = {
      product: "bg-blue-100 text-blue-800",
      blog: "bg-green-100 text-green-800",
      category: "bg-purple-100 text-purple-800",
      brand: "bg-orange-100 text-orange-800",
      showcase: "bg-pink-100 text-pink-800",
      province: "bg-indigo-100 text-indigo-800",
      page: "bg-cyan-100 text-cyan-800",
      media: "bg-yellow-100 text-yellow-800",
      user: "bg-red-100 text-red-800",
      global: "bg-gray-100 text-gray-800",
      setting: "bg-gray-100 text-gray-800",
    };
    return colors[entity] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <History className="h-8 w-8" />
            Activity Logs
          </h1>
          <p className="text-muted-foreground mt-1">
            ประวัติการใช้งานระบบ ({pagination.total} รายการ)
          </p>
        </div>
        <Button onClick={handleRefresh} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          รีเฟรช
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            ตัวกรอง
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="search">ค้นหา</Label>
              <div className="flex gap-2">
                <Input
                  id="search"
                  placeholder="ค้นหาชื่อ, ผู้ใช้..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <Button onClick={handleSearch} size="sm">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>การกระทำ</Label>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="ทั้งหมด" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">ทั้งหมด</SelectItem>
                  {Object.entries(LogActions).map(([key, value]) => (
                    <SelectItem key={key} value={value}>
                      <span className="flex items-center gap-2">
                        <span>{getActionIcon(value)}</span>
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>ประเภท</Label>
              <Select value={entityFilter} onValueChange={setEntityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="ทั้งหมด" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">ทั้งหมด</SelectItem>
                  {Object.entries(LogEntities).map(([key, value]) => (
                    <SelectItem key={key} value={value}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>จำนวนต่อหน้า</Label>
              <Select value={String(pagination.pageSize)} onValueChange={() => {}}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            รายการประวัติ
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <History className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p>ไม่พบประวัติการใช้งาน</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">การกระทำ</TableHead>
                    <TableHead>ประเภท</TableHead>
                    <TableHead>รายการ</TableHead>
                    <TableHead>ผู้ใช้</TableHead>
                    <TableHead className="w-32">วันที่/เวลา</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <Badge variant={getActionBadge(log.action)} className="flex items-center gap-1">
                          <span>{getActionIcon(log.action)}</span>
                          {log.action.charAt(0).toUpperCase() + log.action.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getEntityBadge(log.entity)}>
                          {log.entity.charAt(0).toUpperCase() + log.entity.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-medium">{log.entityName}</div>
                          {log.details?.changes && (
                            <div className="text-xs text-muted-foreground mt-1">
                              เปลี่ยนแปลง: {Object.keys(log.details.changes).join(", ")}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{log.username}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div>{dayjs(log.timestamp).format("DD/MM/YYYY")}</div>
                            <div className="text-xs text-muted-foreground">
                              {dayjs(log.timestamp).format("HH:mm:ss")}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {pagination.pageCount > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    แสดง {((pagination.page - 1) * pagination.pageSize) + 1} -{" "}
                    {Math.min(pagination.page * pagination.pageSize, pagination.total)} จาก{" "}
                    {pagination.total} รายการ
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page <= 1}
                    >
                      ก่อนหน้า
                    </Button>
                    <span className="text-sm">
                      หน้า {pagination.page} จาก {pagination.pageCount}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page >= pagination.pageCount}
                    >
                      ถัดไป
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
