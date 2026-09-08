import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Flag,
  FolderKanban,
  LayoutList,
  LogOut,
  Menu,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { adminLogoutAction } from "@/lib/pages.server";

const NAV_ITEMS = [
  { to: "/admin", label: "Landing Pages", icon: LayoutList, exact: true },
  { to: "/admin/territories", label: "Territories", icon: Flag },
  { to: "/admin/owners", label: "Owners", icon: UserRound },
  { to: "/admin/campaigns", label: "Campaigns", icon: FolderKanban },
  { to: "/admin/users", label: "Users", icon: Users },
] as const;

function isActivePath(pathname: string, to: string, exact?: boolean) {
  if (exact) return pathname === "/admin" || pathname === "/admin/";
  return pathname === to || pathname.startsWith(`${to}/`);
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const nav = (
    <nav className="flex flex-1 flex-col gap-1 p-3">
      <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        Navigation
      </p>
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const active = isActivePath(pathname, item.to, "exact" in item ? item.exact : false);
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-slate-700 text-white"
                : "text-slate-300 hover:bg-slate-800 hover:text-white",
            )}
          >
            <Icon className="h-4 w-4 shrink-0 opacity-80" />
            {item.label}
          </Link>
        );
      })}
      <div className="mt-auto pt-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 px-3 text-slate-300 hover:bg-slate-800 hover:text-white"
          onClick={async () => {
            await adminLogoutAction();
            await navigate({ to: "/admin/login" });
          }}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-muted/40">
      <aside className="hidden w-60 shrink-0 flex-col bg-slate-900 text-white md:flex">
        <div className="border-b border-slate-700 px-4 py-4">
          <p className="text-sm font-semibold tracking-wide">MITCH OS</p>
          <p className="text-xs text-slate-400">Admin</p>
        </div>
        {nav}
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative flex h-full w-64 flex-col bg-slate-900 text-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-700 px-4 py-4">
              <div>
                <p className="text-sm font-semibold tracking-wide">MITCH OS</p>
                <p className="text-xs text-slate-400">Admin</p>
              </div>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="text-slate-300 hover:bg-slate-800 hover:text-white"
                onClick={() => setMobileOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            {nav}
          </aside>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b bg-background px-4 py-3 md:hidden">
          <Button type="button" size="icon" variant="outline" onClick={() => setMobileOpen(true)}>
            <Menu className="h-4 w-4" />
          </Button>
          <span className="text-sm font-semibold">Admin</span>
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
