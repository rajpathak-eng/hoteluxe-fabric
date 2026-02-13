import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "./ImageUpload";
import { toast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2, Save, Edit2, X } from "lucide-react";
import { useClients, useCreateClient, useUpdateClient, useDeleteClient, Client } from "@/hooks/useClients";

export function ClientEditor() {
  const { data: clients, isLoading } = useClients();
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();
  const deleteClient = useDeleteClient();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Client>>({ name: "", logo_url: null, website_url: "" });

  const resetForm = () => {
    setEditingId(null);
    setForm({ name: "", logo_url: null, website_url: "" });
  };

  const startEdit = (client: Client) => {
    setEditingId(client.id);
    setForm({ name: client.name, logo_url: client.logo_url, website_url: client.website_url || "" });
  };

  const handleSave = async () => {
    if (!form.name?.trim()) {
      toast({ title: "Gabim", description: "Emri është i detyrueshëm", variant: "destructive" });
      return;
    }
    try {
      if (editingId) {
        await updateClient.mutateAsync({ id: editingId, ...form });
        toast({ title: "Sukses", description: "Klienti u përditësua" });
      } else {
        const maxOrder = clients?.reduce((max, c) => Math.max(max, c.display_order || 0), 0) || 0;
        await createClient.mutateAsync({ ...form, display_order: maxOrder + 1 });
        toast({ title: "Sukses", description: "Klienti u shtua" });
      }
      resetForm();
    } catch (e: any) {
      toast({ title: "Gabim", description: e.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Jeni të sigurt që doni ta fshini "${name}"?`)) return;
    try {
      await deleteClient.mutateAsync(id);
      toast({ title: "Sukses", description: "Klienti u fshi" });
      if (editingId === id) resetForm();
    } catch (e: any) {
      toast({ title: "Gabim", description: e.message, variant: "destructive" });
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Form */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-lg">{editingId ? "Edito Klientin" : "Shto Klient të Ri"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Emri *</Label>
            <Input value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Website URL</Label>
            <Input value={form.website_url || ""} onChange={(e) => setForm({ ...form, website_url: e.target.value })} placeholder="https://..." />
          </div>
          <div className="space-y-2">
            <Label>Logo</Label>
            <ImageUpload value={form.logo_url} onChange={(v) => setForm({ ...form, logo_url: v })} folder="clients" />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={createClient.isPending || updateClient.isPending}>
              {(createClient.isPending || updateClient.isPending) ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              {editingId ? "Përditëso" : "Shto"}
            </Button>
            {editingId && (
              <Button variant="ghost" onClick={resetForm}>
                <X className="h-4 w-4 mr-1" /> Anulo
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Client Grid */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">Klientët ({clients?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Loader2 className="h-6 w-6 animate-spin mx-auto" />
          ) : clients?.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Nuk ka klientë. Shtoni një të ri.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {clients?.map((client) => (
                <div key={client.id} className="border border-border rounded-lg p-3 flex flex-col items-center gap-2 group relative">
                  {client.logo_url ? (
                    <img src={client.logo_url} alt={client.name} className="h-16 w-full object-contain" />
                  ) : (
                    <div className="h-16 w-full bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">No logo</div>
                  )}
                  <span className="text-xs font-medium text-center truncate w-full">{client.name}</span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" variant="ghost" onClick={() => startEdit(client)}>
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(client.id, client.name)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
