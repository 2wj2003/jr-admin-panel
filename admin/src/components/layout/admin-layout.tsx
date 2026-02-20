"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { useAuthStore } from "@/store/auth-store";
import { getAuthToken } from "@/lib/auth";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, hydrate } = useAuthStore();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    hydrate();
    setChecked(true);
  }, [hydrate]);

  useEffect(() => {
    if (checked && !isAuthenticated) {
      const token = getAuthToken();
      if (!token) {
        router.push("/login");
      }
    }
  }, [checked, isAuthenticated, router]);

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated && !getAuthToken()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64">
        <Header />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
