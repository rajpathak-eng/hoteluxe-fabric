import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RichTextEditor } from "./RichTextEditor";
import { ImageUpload } from "./ImageUpload";
import { MultiCategorySelect } from "./MultiCategorySelect";
import { toast } from "@/hooks/use-toast";
import { Loader2, Save, Trash2, Plus, Eye, EyeOff } from "lucide-react";
import {
  useBlogPosts,
  useBlogCategories,
  useCreateBlogPost,
  useUpdateBlogPost,
  useDeleteBlogPost,
  BlogPost,
} from "@/hooks/useCms";
import { useBlogPostCategoryLinks, useUpdateBlogPostCategories } from "@/hooks/useMultipleCategories";
 
export function BlogEditor() {
  const { data: posts, isLoading: loadingPosts } = useBlogPosts();
  const { data: categories } = useBlogCategories();
  const createPost = useCreateBlogPost();
  const updatePost = useUpdateBlogPost();
  const deletePost = useDeleteBlogPost();
  const updatePostCategories = useUpdateBlogPostCategories();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [isNew, setIsNew] = useState(false);

  // Fetch category links for selected post
  const { data: categoryLinks } = useBlogPostCategoryLinks(selectedId || undefined);
  const [form, setForm] = useState<Partial<BlogPost & { meta_description?: string; published_at?: string | null }>>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featured_image: null,
    category_id: null,
    is_published: false,
    read_time: "5 min",
    author: "EMA Hotelling",
    meta_description: "",
    published_at: null,
  });
 
   const selectedPost = posts?.find((p) => p.id === selectedId);
 
  useEffect(() => {
    if (selectedPost && !isNew) {
      setForm({
        title: selectedPost.title || "",
        slug: selectedPost.slug || "",
        excerpt: selectedPost.excerpt || "",
        content: selectedPost.content || "",
        featured_image: selectedPost.featured_image || null,
        category_id: selectedPost.category_id || null,
        is_published: selectedPost.is_published || false,
        read_time: selectedPost.read_time || "5 min",
        author: selectedPost.author || "EMA Hotelling",
        meta_description: (selectedPost as any).meta_description || "",
        published_at: selectedPost.published_at || null,
      });
    }
  }, [selectedPost, isNew]);

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
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      featured_image: null,
      category_id: categories?.[0]?.id || null,
      is_published: false,
      read_time: "5 min",
      author: "EMA Hotelling",
      meta_description: "",
      published_at: new Date().toISOString().split('T')[0],
    });
  };
 
  const handleSave = async () => {
    if (!form.title || !form.slug) {
      toast({
        title: "Gabim",
        description: "Titulli dhe slug janë të detyrueshme",
        variant: "destructive",
      });
      return;
    }

    try {
      const data = {
        ...form,
        published_at: form.published_at || (form.is_published ? new Date().toISOString() : null),
      };

      if (isNew) {
        const result = await createPost.mutateAsync(data as any);
        // Save additional categories
        if (selectedCategoryIds.length > 0) {
          await updatePostCategories.mutateAsync({
            postId: result.id,
            categoryIds: selectedCategoryIds,
          });
        }
        toast({ title: "Sukses", description: "Artikulli u krijua" });
        setIsNew(false);
        setSelectedId(result.id);
      } else if (selectedId) {
        await updatePost.mutateAsync({ id: selectedId, ...data });
        // Update category links
        await updatePostCategories.mutateAsync({
          postId: selectedId,
          categoryIds: selectedCategoryIds,
        });
        toast({ title: "Sukses", description: "Artikulli u përditësua" });
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
     if (!confirm("Jeni të sigurt që doni të fshini këtë artikull?")) return;
 
     try {
       await deletePost.mutateAsync(selectedId);
       toast({ title: "Sukses", description: "Artikulli u fshi" });
       setSelectedId(null);
     } catch (error: any) {
       toast({
         title: "Gabim",
         description: error.message,
         variant: "destructive",
       });
     }
   };
 
   const generateSlug = (title: string) => {
     return title
       .toLowerCase()
       .replace(/ë/g, "e")
       .replace(/ç/g, "c")
       .replace(/[^a-z0-9]+/g, "-")
       .replace(/(^-|-$)/g, "");
   };
 
   return (
     <div className="grid lg:grid-cols-3 gap-6">
       {/* Post List */}
       <Card className="lg:col-span-1">
         <CardHeader className="flex flex-row items-center justify-between">
           <CardTitle className="text-lg">Artikujt</CardTitle>
           <Button size="sm" onClick={handleNew}>
             <Plus className="h-4 w-4 mr-1" />
             Shto
           </Button>
         </CardHeader>
         <CardContent className="max-h-[600px] overflow-y-auto">
           {loadingPosts ? (
             <Loader2 className="h-6 w-6 animate-spin mx-auto" />
           ) : (
             <div className="space-y-1">
               {posts?.map((post) => (
                 <button
                   key={post.id}
                   onClick={() => {
                     setSelectedId(post.id);
                     setIsNew(false);
                   }}
                   className={`w-full text-left p-3 rounded-md transition-colors ${
                     selectedId === post.id
                       ? "bg-primary text-primary-foreground"
                       : "hover:bg-muted"
                   }`}
                 >
                   <div className="flex items-center gap-2">
                     {post.is_published ? (
                       <Eye className="h-3 w-3 flex-shrink-0" />
                     ) : (
                       <EyeOff className="h-3 w-3 flex-shrink-0 opacity-50" />
                     )}
                     <span className="font-medium text-sm truncate">{post.title}</span>
                   </div>
                   <div className="text-xs opacity-70 truncate mt-1">
                     {(post.blog_categories as any)?.name || "Pa kategori"}
                   </div>
                 </button>
               ))}
             </div>
           )}
         </CardContent>
       </Card>
 
       {/* Editor */}
       <Card className="lg:col-span-2">
         <CardHeader>
           <CardTitle>{isNew ? "Artikull i ri" : selectedPost?.title || "Zgjidh artikull"}</CardTitle>
         </CardHeader>
         <CardContent className="space-y-6">
           {(selectedId || isNew) ? (
             <>
               <div className="grid md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <Label>Titulli *</Label>
                   <Input
                     value={form.title}
                     onChange={(e) => {
                       setForm({
                         ...form,
                         title: e.target.value,
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
                <Label>Kategoritë</Label>
                <MultiCategorySelect
                  categories={categories || []}
                  selectedIds={selectedCategoryIds}
                  onChange={(ids) => {
                    setSelectedCategoryIds(ids);
                    // Update primary category if needed
                    if (ids.length > 0 && !ids.includes(form.category_id || "")) {
                      setForm({ ...form, category_id: ids[0] });
                    } else if (ids.length === 0) {
                      setForm({ ...form, category_id: null });
                    }
                  }}
                  primaryCategoryId={form.category_id || undefined}
                  onPrimaryCategoryChange={(id) => setForm({ ...form, category_id: id })}
                  placeholder="Zgjidh një ose më shumë kategori"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Koha e leximit</Label>
                  <Input
                    value={form.read_time}
                    onChange={(e) => setForm({ ...form, read_time: e.target.value })}
                    placeholder="5 min"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Autori</Label>
                  <Input
                    value={form.author}
                    onChange={(e) => setForm({ ...form, author: e.target.value })}
                  />
                </div>
              </div>
 
                <div className="flex items-center gap-2">
                  <Switch
                    checked={form.is_published}
                    onCheckedChange={(v) => setForm({ ...form, is_published: v })}
                  />
                  <Label>I publikuar</Label>
                </div>

                <div className="space-y-2">
                  <Label>Data e Publikimit</Label>
                  <Input
                    type="date"
                    value={form.published_at ? form.published_at.split('T')[0] : ''}
                    onChange={(e) => setForm({ ...form, published_at: e.target.value ? new Date(e.target.value).toISOString() : null })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Meta Description (SEO)</Label>
                  <Textarea
                    value={form.meta_description || ""}
                    onChange={(e) => setForm({ ...form, meta_description: e.target.value })}
                    rows={2}
                    placeholder="Përshkrim për SEO (max 160 karaktere)"
                    maxLength={160}
                  />
                  <p className="text-xs text-muted-foreground">{(form.meta_description || "").length}/160 karaktere</p>
                </div>

                <div className="space-y-2">
                  <Label>Përshkrim i shkurtër (excerpt)</Label>
                 <Textarea
                   value={form.excerpt || ""}
                   onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                   rows={2}
                 />
               </div>
 
               <div className="space-y-2">
                 <Label>Përmbajtja (Rich Text)</Label>
                 <RichTextEditor
                   content={form.content || ""}
                   onChange={(v) => setForm({ ...form, content: v })}
                 />
               </div>
 
               <div className="space-y-2">
                 <Label>Imazhi kryesor (featured image)</Label>
                 <ImageUpload
                   value={form.featured_image}
                   onChange={(v) => setForm({ ...form, featured_image: v })}
                   folder="blog"
                 />
               </div>
 
               <div className="flex gap-2">
                 <Button onClick={handleSave} disabled={createPost.isPending || updatePost.isPending}>
                   {(createPost.isPending || updatePost.isPending) ? (
                     <Loader2 className="h-4 w-4 animate-spin mr-2" />
                   ) : (
                     <Save className="h-4 w-4 mr-2" />
                   )}
                   Ruaj
                 </Button>
                 {!isNew && selectedId && (
                   <Button variant="destructive" onClick={handleDelete} disabled={deletePost.isPending}>
                     <Trash2 className="h-4 w-4 mr-2" />
                     Fshi
                   </Button>
                 )}
               </div>
             </>
           ) : (
             <p className="text-muted-foreground text-center py-8">
               Zgjidhni një artikull ose krijoni një të ri
             </p>
           )}
         </CardContent>
       </Card>
     </div>
   );
 }