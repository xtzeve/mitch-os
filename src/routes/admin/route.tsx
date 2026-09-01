import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { checkAdminAuth } from "@/lib/pages.server";

export const Route = createFileRoute("/admin")({
  beforeLoad: async ({ location }) => {
    if (location.pathname === "/admin/login") return;
    const { authenticated } = await checkAdminAuth();
    if (!authenticated) {
      throw redirect({ to: "/admin/login" });
    }
  },
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <div className="min-h-screen bg-muted/30">
      <Outlet />
    </div>
  );
}
