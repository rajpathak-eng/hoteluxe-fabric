import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Loader2, Save, Globe, Package, FolderOpen } from "lucide-react";
import {
  useSeoPages,
  useUpdateSeoPage,
  useCategoriesWithSeo,
  useUpdateCategorySeo,
  useProductsWithSeo,
  useUpdateProductSeo,
} from "@/hooks/useSeoMetadata";

export function SeoEditor() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-serif font-semibold">SEO & Metadata</h2>
        <p className="text-muted-foreground mt-1">
          Menaxho Meta Title dhe Meta Description për çdo faqe, kategori dhe produkt
        </p>
      </div>

      <Tabs defaultValue="pages" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="pages" className="gap-2">
            <Globe className="h-4 w-4" />
            Faqet
          </TabsTrigger>
          <TabsTrigger value="categories" className="gap-2">
            <FolderOpen className="h-4 w-4" />
            Kategoritë
          </TabsTrigger>
          <TabsTrigger value="products" className="gap-2">
            <Package className="h-4 w-4" />
            Produktet
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pages">
          <PagesSeoEditor />
        </TabsContent>
        <TabsContent value="categories">
          <CategoriesSeoEditor />
        </TabsContent>
        <TabsContent value="products">
          <ProductsSeoEditor />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PagesSeoEditor() {
  const { data: pages, isLoading } = useSeoPages();
  const updateSeo = useUpdateSeoPage();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ meta_title: "", meta_description: "" });

  const handleEdit = (page: any) => {
    setEditingId(page.id);
    setForm({
      meta_title: page.meta_title || "",
      meta_description: page.meta_description || "",
    });
  };

  const handleSave = async () => {
    if (!editingId) return;
    try {
      await updateSeo.mutateAsync({ id: editingId, ...form });
      toast({ title: "Sukses", description: "SEO u përditësua" });
      setEditingId(null);
    } catch (error: any) {
      toast({ title: "Gabim", description: error.message, variant: "destructive" });
    }
  };

  if (isLoading) {
    return <Loader2 className="h-6 w-6 animate-spin mx-auto" />;
  }

  return (
    <div className="grid gap-4">
      {pages?.map((page) => (
        <Card key={page.id}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">{page.page_name}</CardTitle>
            <CardDescription>/{page.page_slug === "home" ? "" : page.page_slug}</CardDescription>
          </CardHeader>
          <CardContent>
            {editingId === page.id ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Meta Title</Label>
                  <Input
                    value={form.meta_title}
                    onChange={(e) => setForm({ ...form, meta_title: e.target.value })}
                    placeholder="Titulli që shfaqet në rezultatet e kërkimit"
                    maxLength={60}
                  />
                  <p className="text-xs text-muted-foreground">{form.meta_title.length}/60 karaktere</p>
                </div>
                <div className="space-y-2">
                  <Label>Meta Description</Label>
                  <Textarea
                    value={form.meta_description}
                    onChange={(e) => setForm({ ...form, meta_description: e.target.value })}
                    placeholder="Përshkrimi që shfaqet në rezultatet e kërkimit"
                    maxLength={160}
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">{form.meta_description.length}/160 karaktere</p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSave} disabled={updateSeo.isPending} size="sm">
                    {updateSeo.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                    Ruaj
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setEditingId(null)}>
                    Anulo
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium">Title: </span>
                  <span className="text-sm text-muted-foreground">{page.meta_title || "Pa vendosur"}</span>
                </div>
                <div>
                  <span className="text-sm font-medium">Description: </span>
                  <span className="text-sm text-muted-foreground">{page.meta_description || "Pa vendosur"}</span>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleEdit(page)} className="mt-2">
                  Edito
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function CategoriesSeoEditor() {
  const { data: categories, isLoading } = useCategoriesWithSeo();
  const updateSeo = useUpdateCategorySeo();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ meta_title: "", meta_description: "" });

  const handleEdit = (category: any) => {
    setEditingId(category.id);
    setForm({
      meta_title: category.meta_title || "",
      meta_description: category.meta_description || "",
    });
  };

  const handleSave = async () => {
    if (!editingId) return;
    try {
      await updateSeo.mutateAsync({ id: editingId, ...form });
      toast({ title: "Sukses", description: "SEO u përditësua" });
      setEditingId(null);
    } catch (error: any) {
      toast({ title: "Gabim", description: error.message, variant: "destructive" });
    }
  };

  if (isLoading) {
    return <Loader2 className="h-6 w-6 animate-spin mx-auto" />;
  }

  return (
    <div className="grid gap-4">
      {categories?.map((category) => (
        <Card key={category.id}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">{category.name}</CardTitle>
            <CardDescription>/products/{category.slug}</CardDescription>
          </CardHeader>
          <CardContent>
            {editingId === category.id ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Meta Title</Label>
                  <Input
                    value={form.meta_title}
                    onChange={(e) => setForm({ ...form, meta_title: e.target.value })}
                    placeholder="Titulli që shfaqet në rezultatet e kërkimit"
                    maxLength={60}
                  />
                  <p className="text-xs text-muted-foreground">{form.meta_title.length}/60 karaktere</p>
                </div>
                <div className="space-y-2">
                  <Label>Meta Description</Label>
                  <Textarea
                    value={form.meta_description}
                    onChange={(e) => setForm({ ...form, meta_description: e.target.value })}
                    placeholder="Përshkrimi që shfaqet në rezultatet e kërkimit"
                    maxLength={160}
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">{form.meta_description.length}/160 karaktere</p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSave} disabled={updateSeo.isPending} size="sm">
                    {updateSeo.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                    Ruaj
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setEditingId(null)}>
                    Anulo
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium">Title: </span>
                  <span className="text-sm text-muted-foreground">{category.meta_title || "Pa vendosur"}</span>
                </div>
                <div>
                  <span className="text-sm font-medium">Description: </span>
                  <span className="text-sm text-muted-foreground">{category.meta_description || "Pa vendosur"}</span>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleEdit(category)} className="mt-2">
                  Edito
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ProductsSeoEditor() {
  const { data: products, isLoading } = useProductsWithSeo();
  const updateSeo = useUpdateProductSeo();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ meta_title: "", meta_description: "" });

  const handleEdit = (product: any) => {
    setEditingId(product.id);
    setForm({
      meta_title: product.meta_title || "",
      meta_description: product.meta_description || "",
    });
  };

  const handleSave = async () => {
    if (!editingId) return;
    try {
      await updateSeo.mutateAsync({ id: editingId, ...form });
      toast({ title: "Sukses", description: "SEO u përditësua" });
      setEditingId(null);
    } catch (error: any) {
      toast({ title: "Gabim", description: error.message, variant: "destructive" });
    }
  };

  if (isLoading) {
    return <Loader2 className="h-6 w-6 animate-spin mx-auto" />;
  }

  return (
    <div className="grid gap-4">
      {products?.map((product) => (
        <Card key={product.id}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">{product.name}</CardTitle>
            <CardDescription>
              {(product as any).product_categories?.name && `Kategoria: ${(product as any).product_categories.name}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {editingId === product.id ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Meta Title</Label>
                  <Input
                    value={form.meta_title}
                    onChange={(e) => setForm({ ...form, meta_title: e.target.value })}
                    placeholder="Titulli që shfaqet në rezultatet e kërkimit"
                    maxLength={60}
                  />
                  <p className="text-xs text-muted-foreground">{form.meta_title.length}/60 karaktere</p>
                </div>
                <div className="space-y-2">
                  <Label>Meta Description</Label>
                  <Textarea
                    value={form.meta_description}
                    onChange={(e) => setForm({ ...form, meta_description: e.target.value })}
                    placeholder="Përshkrimi që shfaqet në rezultatet e kërkimit"
                    maxLength={160}
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">{form.meta_description.length}/160 karaktere</p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSave} disabled={updateSeo.isPending} size="sm">
                    {updateSeo.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                    Ruaj
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setEditingId(null)}>
                    Anulo
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium">Title: </span>
                  <span className="text-sm text-muted-foreground">{product.meta_title || "Pa vendosur"}</span>
                </div>
                <div>
                  <span className="text-sm font-medium">Description: </span>
                  <span className="text-sm text-muted-foreground">{product.meta_description || "Pa vendosur"}</span>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleEdit(product)} className="mt-2">
                  Edito
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
