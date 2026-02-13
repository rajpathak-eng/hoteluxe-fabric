 import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
 import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
 import { usePublicBlogPosts, usePublicBlogCategories, PublicBlogPost } from "@/hooks/useBlog";
 import { SeoMetaHead } from "@/components/admin/SeoMetaHead";
 import { Skeleton } from "@/components/ui/skeleton";

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState("te-gjitha");
 
   const { data: posts, isLoading: postsLoading } = usePublicBlogPosts();
   const { data: categories, isLoading: categoriesLoading } = usePublicBlogCategories();
 
   const allCategories = useMemo(() => {
     const baseCategory = { id: "te-gjitha", name: "Të gjitha", slug: "te-gjitha" };
     if (!categories) return [baseCategory];
     return [baseCategory, ...categories];
   }, [categories]);

   const filteredPosts = useMemo(() => {
     if (!posts) return [];
     if (activeCategory === "te-gjitha") return posts;
     return posts.filter((post) => post.category?.slug === activeCategory);
   }, [posts, activeCategory]);
   const isLoading = postsLoading || categoriesLoading;
 

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("sq-AL", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

 return (
   <div className="min-h-screen">
     <SeoMetaHead
       pageSlug="blog"
       fallbackTitle="Blog - EMA Hotelling"
       fallbackDescription="Lexoni artikujt tanë më të fundit rreth tekstileve dhe industrisë së mikpritjes."
     />
     <Header />
     <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-14">
            <span className="typo-label text-muted-foreground mb-6">
              Blog
            </span>
            <h1 className="typo-h1 text-foreground mb-4">
              Artikuj & këshilla
            </h1>
            <p className="typo-body text-muted-foreground max-w-2xl mx-auto">
              Lexoni artikujt tanë për tekstilet e hotelerisë, këshilla për biznesin tuaj dhe trendet më të fundit në industri.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex justify-center mb-12">
            <Tabs value={activeCategory} onValueChange={setActiveCategory}>
              <TabsList className="flex-wrap h-auto gap-1 p-1 bg-background border border-border">
                 {allCategories.map((category) => (
                  <TabsTrigger
                     key={category.slug}
                     value={category.slug}
                    className="text-sm px-4 py-2"
                  >
                     {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Blog Grid */}
           {isLoading ? (
             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
               {[1, 2, 3].map((i) => (
                 <div key={i} className="space-y-4">
                   <Skeleton className="aspect-[16/10] w-full rounded-[15px]" />
                   <Skeleton className="h-4 w-1/4" />
                   <Skeleton className="h-6 w-3/4" />
                   <Skeleton className="h-20 w-full" />
                 </div>
               ))}
             </div>
           ) : (
             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
               {filteredPosts.map((post) => (
                 <BlogCard key={post.id} post={post} formatDate={formatDate} />
               ))}
             </div>
           )}

          {filteredPosts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground">Nuk ka artikuj në këtë kategori.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

interface BlogCardProps {
   post: PublicBlogPost;
  formatDate: (date: string) => string;
}

const BlogCard = ({ post, formatDate }: BlogCardProps) => {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group bg-background border border-border hover:border-foreground/20 luxury-transition hover-lift overflow-hidden rounded-[15px]"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden rounded-t-[15px]">
         {post.featured_image && (
           <img
             src={post.featured_image}
          alt={post.title}
             className="absolute inset-0 w-full h-full object-cover luxury-transition group-hover:scale-105 rounded-t-[15px]"
           />
         )}
        <div className="absolute top-4 left-4">
           {post.category && (
             <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1">
               {post.category.name}
             </span>
           )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center gap-4 text-muted-foreground text-xs mb-4">
          <span className="flex items-center gap-1.5">
             <Calendar className="w-3.5 h-3.5" />
             {post.published_at ? formatDate(post.published_at) : "Pa datë"}
          </span>
          <span className="flex items-center gap-1.5">
             <Clock className="w-3.5 h-3.5" />
             {post.read_time}
          </span>
        </div>

        <h3 className="typo-h3 text-foreground mb-3 leading-tight group-hover:text-accent luxury-transition">
          {post.title}
        </h3>

        <p className="typo-body-sm text-muted-foreground mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        <span className="text-sm font-medium tracking-wide text-foreground flex items-center gap-2 group-hover:gap-3 luxury-transition">
          Lexo më shumë
          <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </Link>
  );
};

export default Blog;
