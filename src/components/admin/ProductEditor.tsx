import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MultiImageUpload } from "./MultiImageUpload";
import { WashingIconsEditor } from "./WashingIconsEditor";
import { ProductFeaturesEditor } from "./ProductFeaturesEditor";
import { ProductVariantsEditor, ProductVariant } from "./ProductVariantsEditor";
import { ProductSortableList } from "./ProductSortableList";
import { MultiCategorySelect } from "./MultiCategorySelect";
import { toast } from "@/hooks/use-toast";
import { Loader2, Save, Trash2 } from "lucide-react";
import {
  useProductsAdmin,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useCategoriesAdmin,
  ProductFull,
} from "@/hooks/useCms";
import { useProductCategoryLinks, useUpdateProductCategories } from "@/hooks/useMultipleCategories";
 
export function ProductEditor() {
  const { data: products, isLoading: loadingProducts } = useProductsAdmin();
  const { data: categories } = useCategoriesAdmin();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const updateProductCategories = useUpdateProductCategories();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);

  // Fetch category links for selected product
  const { data: categoryLinks } = useProductCategoryLinks(selectedId || undefined);
   const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState<Partial<ProductFull & { variants: ProductVariant[] }>>({
    name: "",
    slug: "",
    description: "",
    short_description: "",
    content: "",
    category_id: "",
    images: [],
    features: [],
    is_featured: false,
    display_order: 0,
    meta_title: "",
    meta_description: "",
    // New structured fields
    washing_icons: [],
    product_features: [],
    variants: [],
  });
 
   const selectedProduct = products?.find((p) => p.id === selectedId);
 
  useEffect(() => {
    if (selectedProduct && !isNew) {
      setForm({
        name: selectedProduct.name || "",
        slug: selectedProduct.slug || "",
        description: selectedProduct.description || "",
        short_description: (selectedProduct as any).short_description || "",
        content: (selectedProduct as any).content || "",
        category_id: selectedProduct.category_id || "",
        images: selectedProduct.images || [],
        features: selectedProduct.features || [],
        is_featured: selectedProduct.is_featured || false,
        display_order: selectedProduct.display_order || 0,
        meta_title: (selectedProduct as any).meta_title || "",
        meta_description: (selectedProduct as any).meta_description || "",
        washing_icons: (selectedProduct as any).washing_icons || [],
        product_features: (selectedProduct as any).product_features || [],
        variants: (selectedProduct as any).variants || [],
      });
    }
  }, [selectedProduct, isNew]);

  // Sync category links to local state
  useEffect(() => {
    if (categoryLinks && !isNew) {
      setSelectedCategoryIds(categoryLinks.map((link: any) => link.category_id));
    }
  }, [categoryLinks, isNew]);
 
  const handleNew = () => {
    setIsNew(true);
    setSelectedId(null);
    setSelectedCategoryIds([]);
    setForm({
      name: "",
      slug: "",
      description: "",
      short_description: "",
      content: "",
      category_id: categories?.[0]?.id || "",
      images: [],
      features: [],
      is_featured: false,
      display_order: 0,
      meta_title: "",
      meta_description: "",
      washing_icons: [],
      product_features: [],
      variants: [],
    });
  };
 
  const handleSave = async () => {
    if (!form.name || !form.slug || !form.category_id) {
      toast({
        title: "Gabim",
        description: "Emri, slug dhe kategoria kryesore janë të detyrueshme",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isNew) {
        const result = await createProduct.mutateAsync(form as any);
        // Save additional categories
        if (selectedCategoryIds.length > 0) {
          await updateProductCategories.mutateAsync({
            productId: result.id,
            categoryIds: selectedCategoryIds,
          });
        }
        toast({ title: "Sukses", description: "Produkti u krijua" });
        setIsNew(false);
        setSelectedId(result.id);
      } else if (selectedId) {
        await updateProduct.mutateAsync({ id: selectedId, ...form });
        // Update category links
        await updateProductCategories.mutateAsync({
          productId: selectedId,
          categoryIds: selectedCategoryIds,
        });
        toast({ title: "Sukses", description: "Produkti u përditësua" });
      }
    } catch (error: any) {
      toast({
        title: "Gabim",
        description: error.message,
        variant: "destructive",
      });
    }
  };
 
   const handleDelete = async () => {
     if (!selectedId) return;
     if (!confirm("Jeni të sigurt që doni të fshini këtë produkt?")) return;
 
     try {
       await deleteProduct.mutateAsync(selectedId);
       toast({ title: "Sukses", description: "Produkti u fshi" });
       setSelectedId(null);
     } catch (error: any) {
       toast({
         title: "Gabim",
         description: error.message,
         variant: "destructive",
       });
     }
   };
 
   const generateSlug = (name: string) => {
     return name
       .toLowerCase()
       .replace(/ë/g, "e")
       .replace(/ç/g, "c")
       .replace(/[^a-z0-9]+/g, "-")
       .replace(/(^-|-$)/g, "");
   };
 
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Product List with Drag & Drop */}
      <ProductSortableList
        selectedId={selectedId}
        onSelectProduct={(id) => {
          setSelectedId(id);
          setIsNew(false);
        }}
        onNewProduct={handleNew}
      />

      {/* Editor */}
      <Card className="lg:col-span-2">
         <CardHeader>
           <CardTitle>{isNew ? "Produkt i ri" : selectedProduct?.name || "Zgjidh produkt"}</CardTitle>
         </CardHeader>
         <CardContent className="space-y-6">
           {(selectedId || isNew) ? (
             <>
               <div className="grid md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <Label>Emri *</Label>
                   <Input
                     value={form.name}
                     onChange={(e) => {
                       setForm({
                         ...form,
                         name: e.target.value,
                         slug: isNew ? generateSlug(e.target.value) : form.slug,
                       });
                     }}
                   />
                 </div>
                 <div className="space-y-2">
                   <Label>Slug *</Label>
                   <Input
                     value={form.slug}
                     onChange={(e) => setForm({ ...form, slug: e.target.value })}
                   />
                 </div>
               </div>
 
              <div className="space-y-2">
                <Label>Kategoritë *</Label>
                <MultiCategorySelect
                  categories={categories || []}
                  selectedIds={selectedCategoryIds}
                  onChange={(ids) => {
                    setSelectedCategoryIds(ids);
                    // Update primary category if needed
                    if (ids.length > 0 && !ids.includes(form.category_id || "")) {
                      setForm({ ...form, category_id: ids[0] });
                    }
                  }}
                  primaryCategoryId={form.category_id || undefined}
                  onPrimaryCategoryChange={(id) => setForm({ ...form, category_id: id || "" })}
                  placeholder="Zgjidh një ose më shumë kategori"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Renditja</Label>
                  <Input
                    type="number"
                    value={form.display_order}
                    onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
 
               <div className="flex items-center gap-2">
                 <Switch
                   checked={form.is_featured}
                   onCheckedChange={(v) => setForm({ ...form, is_featured: v })}
                 />
                 <Label>Produkt i veçantë (featured)</Label>
               </div>
 
              <div className="space-y-2">
                  <Label>Përshkrimi i produktit</Label>
                  <Textarea
                    value={form.description || ""}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={4}
                    placeholder="Përshkruani produktin me detaje..."
                  />
                  <p className="text-xs text-muted-foreground">
                    Përshkrimi kryesor i produktit që shfaqet në faqen e produktit
                  </p>
                </div>
 
                {/* Karakteristikat e Produktit - Text only */}
                <div className="border-t border-border pt-6 mt-6">
                  <ProductFeaturesEditor
                    value={form.product_features || []}
                    onChange={(v) => setForm({ ...form, product_features: v })}
                  />
                </div>

                {/* Product Variants */}
                <div className="border-t border-border pt-6 mt-6">
                  <ProductVariantsEditor
                    value={form.variants || []}
                    onChange={(v) => setForm({ ...form, variants: v })}
                  />
                </div>

                {/* Washing Icons Section */}
                <div className="border-t border-border pt-6 mt-6">
                  <WashingIconsEditor
                    value={form.washing_icons || []}
                    onChange={(v) => setForm({ ...form, washing_icons: v })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Imazhet e produktit</Label>
                  <MultiImageUpload
                    value={form.images || []}
                    onChange={(v) => setForm({ ...form, images: v })}
                    folder="products"
                    maxImages={5}
                  />
                </div>


               <div className="grid md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <Label>Meta Title</Label>
                   <Input
                     value={form.meta_title || ""}
                     onChange={(e) => setForm({ ...form, meta_title: e.target.value })}
                     maxLength={60}
                   />
                 </div>
                 <div className="space-y-2">
                   <Label>Meta Description</Label>
                   <Textarea
                     value={form.meta_description || ""}
                     onChange={(e) => setForm({ ...form, meta_description: e.target.value })}
                     maxLength={160}
                     rows={2}
                   />
                 </div>
               </div>
 
               <div className="flex gap-2">
                 <Button onClick={handleSave} disabled={createProduct.isPending || updateProduct.isPending}>
                   {(createProduct.isPending || updateProduct.isPending) ? (
                     <Loader2 className="h-4 w-4 animate-spin mr-2" />
                   ) : (
                     <Save className="h-4 w-4 mr-2" />
                   )}
                   Ruaj
                 </Button>
                 {!isNew && selectedId && (
                   <Button variant="destructive" onClick={handleDelete} disabled={deleteProduct.isPending}>
                     <Trash2 className="h-4 w-4 mr-2" />
                     Fshi
                   </Button>
                 )}
               </div>
             </>
           ) : (
             <p className="text-muted-foreground text-center py-8">
               Zgjidhni një produkt ose krijoni një të ri
             </p>
           )}
         </CardContent>
       </Card>
     </div>
   );
 }