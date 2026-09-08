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
  createCatalogAction,
  deleteCatalogAction,
  updateCatalogAction,
} from "@/lib/pages.server";
import { CATALOG_META, type CatalogKind, type CatalogRecord } from "@/lib/catalog-types";

type CatalogCrudPageProps = {
  kind: CatalogKind;
  items: CatalogRecord[];
  onChanged: () => Promise<void>;
};

export function CatalogCrudPage({ kind, items, onChanged }: CatalogCrudPageProps) {
  const meta = CATALOG_META[kind];
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">{meta.labelPlural}</h1>
        <p className="text-sm text-muted-foreground">Create and manage {meta.labelPlural.toLowerCase()}.</p>
      </div>

      <div className="mb-8 rounded-lg border bg-background p-6">
        <h2 className="mb-4 text-lg font-medium">Add {meta.label}</h2>
        <form
          className="flex flex-wrap items-end gap-3"
          onSubmit={async (event) => {
            event.preventDefault();
            setLoading(true);
            setError(null);
            try {
              const result = await createCatalogAction({ data: { kind, name } });
              if (!result.success) {
                setError(result.error ?? "Failed to create.");
                return;
              }
              setName("");
              await onChanged();
            } catch {
              setError("Failed to create.");
            } finally {
              setLoading(false);
            }
          }}
        >
          <div className="min-w-[16rem] flex-1 space-y-2">
            <Label htmlFor={`${kind}-name`}>Name</Label>
            <Input
              id={`${kind}-name`}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={`e.g. ${kind === "campaign" ? "NIS2" : kind === "owner" ? "Vince" : "DE"}`}
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Add"}
          </Button>
        </form>
        {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}
      </div>

      <div className="rounded-lg border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Modified</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                  No {meta.labelPlural.toLowerCase()} yet.
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>
                    {editingId === item.id ? (
                      <Input
                        value={editingName}
                        onChange={(event) => setEditingName(event.target.value)}
                        className="max-w-xs"
                      />
                    ) : (
                      item.name
                    )}
                  </TableCell>
                  <TableCell>{item.date_modified}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {editingId === item.id ? (
                        <>
                          <Button
                            size="sm"
                            disabled={busyId === item.id}
                            onClick={async () => {
                              setBusyId(item.id);
                              try {
                                const result = await updateCatalogAction({
                                  data: { kind, id: item.id, name: editingName },
                                });
                                if (!result.success) {
                                  window.alert(result.error ?? "Failed to update.");
                                  return;
                                }
                                setEditingId(null);
                                await onChanged();
                              } finally {
                                setBusyId(null);
                              }
                            }}
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingId(null)}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingId(item.id);
                              setEditingName(item.name);
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            disabled={busyId === item.id}
                            onClick={async () => {
                              if (!window.confirm(`Delete "${item.name}"?`)) return;
                              setBusyId(item.id);
                              try {
                                const result = await deleteCatalogAction({
                                  data: { kind, id: item.id },
                                });
                                if (!result.success) {
                                  window.alert(result.error ?? "Failed to delete.");
                                  return;
                                }
                                await onChanged();
                              } finally {
                                setBusyId(null);
                              }
                            }}
                          >
                            Delete
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
