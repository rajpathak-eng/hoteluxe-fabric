import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2, Save, Edit2, X } from "lucide-react";
import { useProjectCategories, ProjectCategory } from "@/hooks/useProjectCategories";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[ëë]/g, "e")
    .replace(/[çç]/g, "c")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export function ProjectCategoryManager() {
  const { data: categories, isLoading } = useProjectCategories();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [newName, setNewName] = useState("");
  const [newSlug, setNewSlug] = useState("");

  const createMutation = useMutation({
    mutationFn: async ({ name, slug }: { name: string; slug: string }) => {
      const maxOrder = categories?.reduce((max, c) => Math.max(max, c.display_order || 0), 0) || 0;
      const { error } = await supabase
        .from("project_categories")
        .insert({ name, slug, display_order: maxOrder + 1 });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-categories"] });
      setNewName("");
      setNewSlug("");
      toast({ title: "Sukses", description: "Kategoria u krijua" });
    },
    onError: (e: Error) => toast({ title: "Gabim", description: e.message, variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, name, slug }: { id: string; name: string; slug: string }) => {
      const { error } = await supabase
        .from("project_categories")
        .update({ name, slug })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-categories"] });
      queryClient.invalidateQueries({ queryKey: ["all-project-category-links"] });
      queryClient.invalidateQueries({ queryKey: ["public-projects"] });
      setEditingId(null);
      toast({ title: "Sukses", description: "Kategoria u përditësua" });
    },
    onError: (e: Error) => toast({ title: "Gabim", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("project_categories")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-categories"] });
      queryClient.invalidateQueries({ queryKey: ["all-project-category-links"] });
      toast({ title: "Sukses", description: "Kategoria u fshi" });
    },
    onError: (e: Error) => toast({ title: "Gabim", description: e.message, variant: "destructive" }),
  });

  const handleCreate = () => {
    const name = newName.trim();
    if (!name) return;
    const slug = newSlug.trim() || generateSlug(name);
    createMutation.mutate({ name, slug });
  };

  const startEdit = (cat: ProjectCategory) => {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditSlug(cat.slug);
  };

  const handleUpdate = () => {
    if (!editingId || !editName.trim()) return;
    updateMutation.mutate({ id: editingId, name: editName.trim(), slug: editSlug.trim() || generateSlug(editName) });
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Jeni të sigurt që doni ta fshini kategorinë "${name}"?`)) return;
    deleteMutation.mutate(id);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Menaxho Kategoritë e Projekteve</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add new */}
        <div className="flex gap-2 items-end">
          <div className="flex-1 space-y-1">
            <Label className="text-xs">Emri</Label>
            <Input
              placeholder="P.sh. Hotele"
              value={newName}
              onChange={(e) => {
                setNewName(e.target.value);
                if (!newSlug) setNewSlug(generateSlug(e.target.value));
              }}
            />
          </div>
          <div className="flex-1 space-y-1">
            <Label className="text-xs">Slug</Label>
            <Input
              placeholder="hotele"
              value={newSlug}
              onChange={(e) => setNewSlug(e.target.value)}
            />
          </div>
          <Button onClick={handleCreate} disabled={createMutation.isPending || !newName.trim()}>
            {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-1" />}
            Shto
          </Button>
        </div>

        {/* List */}
        {isLoading ? (
          <Loader2 className="h-6 w-6 animate-spin mx-auto" />
        ) : (
          <div className="space-y-2">
            {categories?.map((cat) => (
              <div key={cat.id} className="flex items-center gap-2 p-3 border border-border rounded-md">
                {editingId === cat.id ? (
                  <>
                    <Input
                      className="flex-1"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                    <Input
                      className="flex-1"
                      value={editSlug}
                      onChange={(e) => setEditSlug(e.target.value)}
                    />
                    <Button size="sm" onClick={handleUpdate} disabled={updateMutation.isPending}>
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 font-medium text-sm">{cat.name}</span>
                    <span className="flex-1 text-xs text-muted-foreground">{cat.slug}</span>
                    <Button size="sm" variant="ghost" onClick={() => startEdit(cat)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(cat.id, cat.name)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            ))}
            {categories?.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">Nuk ka kategori. Shtoni një të re më sipër.</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
