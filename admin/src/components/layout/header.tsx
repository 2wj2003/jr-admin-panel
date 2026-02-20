"use client";

import { useAuthStore } from "@/store/auth-store";
import { logout } from "@/lib/auth";
import { LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const { user } = useAuthStore();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-white px-6">
      <div className="flex flex-1 items-center justify-between">
        <div>
          <h2 className="text-sm text-muted-foreground">
            ยินดีต้อนรับกลับมา
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <span className="font-medium">
              {user?.username || user?.email || "Admin"}
            </span>
          </div>
          <Button variant="ghost" size="icon" onClick={logout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
