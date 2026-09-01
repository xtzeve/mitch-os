import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  checkAdminAuth,
  createAdminUserAction,
  deleteAdminUserAction,
  fetchAdminUsers,
} from "@/lib/pages.server";

export const Route = createFileRoute("/admin/users/")({
  head: () => ({
    meta: [{ name: "robots", content: "noindex, nofollow" }, { title: "Admin — Users" }],
  }),
  loader: async () => {
    const [users, auth] = await Promise.all([fetchAdminUsers(), checkAdminAuth()]);
    return { users, currentUsername: auth.username };
  },
  component: AdminUsersPage,
});

function AdminUsersPage() {
  const { users, currentUsername } = Route.useLoaderData();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Admin Users</h1>
          <p className="text-sm text-muted-foreground">
            Signed in as {currentUsername ?? "admin"}.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link to="/admin">Back to Pages</Link>
        </Button>
      </div>

      <div className="mb-8 rounded-lg border bg-background p-6">
        <h2 className="mb-4 text-lg font-medium">Create user</h2>
        <form
          className="grid gap-4 sm:grid-cols-2"
          onSubmit={async (event) => {
            event.preventDefault();
            setLoading(true);
            setError(null);
            try {
              const result = await createAdminUserAction({ data: { username, password } });
              if (!result.success) {
                setError(result.error ?? "Failed to create user.");
                return;
              }
              setUsername("");
              setPassword("");
              await router.invalidate();
            } catch {
              setError("Failed to create user.");
            } finally {
              setLoading(false);
            }
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="new-username">Username</Label>
            <Input
              id="new-username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">Password</Label>
            <Input
              id="new-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
            />
          </div>
          <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create user"}
            </Button>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
          </div>
        </form>
        <p className="mt-4 text-xs text-muted-foreground">
          Username: 3–32 characters (letters, numbers, underscore). Password: at least 8 characters.
        </p>
      </div>

      <div className="rounded-lg border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.user_id}>
                <TableCell>{user.user_id}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.date_added}</TableCell>
                <TableCell className="text-right">
                  {user.username.toLowerCase() === currentUsername?.toLowerCase() ? (
                    <span className="text-xs text-muted-foreground">Current session</span>
                  ) : (
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={busyId === user.user_id}
                      onClick={async () => {
                        if (!window.confirm(`Delete user "${user.username}"?`)) return;
                        setBusyId(user.user_id);
                        try {
                          const result = await deleteAdminUserAction({
                            data: { userId: user.user_id },
                          });
                          if (!result.success) {
                            window.alert(result.error ?? "Failed to delete user.");
                            return;
                          }
                          await router.invalidate();
                        } finally {
                          setBusyId(null);
                        }
                      }}
                    >
                      Delete
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
