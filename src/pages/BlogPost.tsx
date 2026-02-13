import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Share2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { usePublicBlogPost, useRelatedBlogPosts } from "@/hooks/useBlog";
import { Skeleton } from "@/components/ui/skeleton";
import { DynamicSeoHead } from "@/components/seo/DynamicSeoHead";

const BlogPost = () => {
  const { postSlug } = useParams<{ postSlug: string }>();
  
   const { data: post, isLoading, error } = usePublicBlogPost(postSlug);
   const { data: relatedPosts = [] } = useRelatedBlogPosts(post?.category_id ?? null, post?.id ?? "");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("sq-AL", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

   if (isLoading) {
     return (
       <div className="min-h-screen">
         <Header />
         <main className="pt-32 pb-20">
           <div className="container mx-auto px-4">
             <Skeleton className="h-4 w-32 mb-8" />
             <div className="max-w-3xl mx-auto mb-12 space-y-4">
               <Skeleton className="h-6 w-24" />
               <Skeleton className="h-12 w-full" />
               <Skeleton className="h-4 w-48" />
             </div>
             <div className="max-w-4xl mx-auto mb-12">
               <Skeleton className="aspect-[21/9] w-full rounded-[15px]" />
             </div>
             <div className="max-w-3xl mx-auto space-y-4">
               <Skeleton className="h-4 w-full" />
               <Skeleton className="h-4 w-full" />
               <Skeleton className="h-4 w-3/4" />
             </div>
           </div>
         </main>
         <Footer />
       </div>
     );
   }
 
   if (!post || error) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-32 pb-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-serif text-4xl text-foreground mb-4">Artikulli nuk u gjet</h1>
            <p className="text-muted-foreground mb-8">Artikulli që po kërkoni nuk ekziston.</p>
            <Link to="/blog">
              <Button>Kthehu te blogu</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const sharePost = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      });
    }
  };

  // Generate SEO metadata
  const seoTitle = post.title + " | EMA Hotelling Blog";
  const seoDescription = post.meta_description || post.excerpt || `Lexoni artikullin "${post.title}" në blogun e EMA Hotelling.`;

  return (
    <div className="min-h-screen">
      <DynamicSeoHead
        title={seoTitle}
        description={seoDescription}
        ogImage={post.featured_image || undefined}
        ogType="article"
        canonicalUrl={`https://hoteluxe-fabrics.lovable.app/blog/${postSlug}`}
      />
      <Header />
      <main className="pt-32 pb-20">
        <article className="container mx-auto px-4">
          {/* Back Link */}
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground luxury-transition mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Kthehu te blogu</span>
          </Link>

          {/* Header */}
          <header className="max-w-3xl mx-auto mb-12">
            <span className="inline-block bg-primary text-primary-foreground text-xs font-medium px-3 py-1 mb-6">
               {post.category?.name}
            </span>

            <h1 className="font-serif text-3xl md:text-5xl font-medium text-foreground mb-6 tracking-tight leading-tight">
              {post.title}
            </h1>

            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4 text-muted-foreground text-sm">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                   {post.published_at ? formatDate(post.published_at) : "Pa datë"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                   {post.read_time}
                </span>
              </div>

              <Button variant="ghost" size="sm" onClick={sharePost} className="gap-2">
                <Share2 className="w-4 h-4" />
                Shpërndaje
              </Button>
            </div>
          </header>

          {/* Featured Image */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="aspect-[21/9] overflow-hidden rounded-[15px]">
               {post.featured_image && (
                 <img
                   src={post.featured_image}
                alt={post.title}
                   className="w-full h-full object-cover rounded-[15px]"
                 />
               )}
            </div>
          </div>

          {/* Content */}
          <div className="max-w-3xl mx-auto">
            <div
              className="prose prose-lg max-w-none 
                prose-headings:font-serif prose-headings:tracking-tight prose-headings:text-foreground
                prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                prose-p:text-muted-foreground prose-p:font-light prose-p:leading-relaxed prose-p:mb-6
                prose-p:empty:mb-4 prose-p:empty:min-h-[1em]
                prose-a:text-accent prose-a:no-underline hover:prose-a:underline
                prose-strong:text-foreground prose-strong:font-semibold
                prose-ul:text-muted-foreground prose-ol:text-muted-foreground
                prose-li:mb-2
                [&>p]:mb-6 [&>p:empty]:mb-4 [&>p:empty]:block [&>p:last-child]:mb-0"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* CTA */}
            <div className="mt-16 p-8 bg-secondary/50 text-center">
              <h3 className="font-serif text-2xl font-medium text-foreground mb-4">
                Keni pyetje rreth tekstileve?
              </h3>
              <p className="text-muted-foreground mb-6 font-light">
                Ekipi ynë është gati t'ju ndihmojë me zgjedhjen e produkteve të duhura.
              </p>
              <Button
                onClick={() => {
                  const message = `Përshëndetje! Sapo lexova artikullin "${post.title}" dhe dëshiroj të di më shumë.`;
                  window.open(`https://wa.me/355686000626?text=${encodeURIComponent(message)}`, "_blank");
                }}
              >
                Na kontaktoni
              </Button>
            </div>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="max-w-4xl mx-auto mt-20">
              <h2 className="font-serif text-2xl font-medium text-foreground mb-8">
                Artikuj të ngjashëm
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map((related) => (
                  <Link
                    key={related.id}
                    to={`/blog/${related.slug}`}
                    className="group"
                  >
                    <div className="aspect-[16/10] overflow-hidden mb-4 rounded-[15px]">
                      <img
                 src={related.featured_image || ""}
                        alt={related.title}
                        className="w-full h-full object-cover luxury-transition group-hover:scale-105 rounded-[15px]"
                      />
                    </div>
                    <h3 className="font-serif text-lg font-medium text-foreground group-hover:text-accent luxury-transition leading-tight">
                      {related.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </article>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default BlogPost;
