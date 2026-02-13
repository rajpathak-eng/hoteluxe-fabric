import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { SeoMetaHead } from "@/components/admin/SeoMetaHead";
import { usePublicProjects, Project } from "@/hooks/useProjects";
import { usePageSection } from "@/hooks/usePageSections";
import { useProjectCategories } from "@/hooks/useProjectCategories";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const PROJECTS_PER_PAGE = 9;

// Fetch all project-category links for filtering
function useAllProjectCategoryLinks() {
  return useQuery({
    queryKey: ["all-project-category-links"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_category_links")
        .select("project_id, category_id");
      if (error) throw error;
      return data;
    },
  });
}

const Projects = () => {
  const [activeTag, setActiveTag] = useState("te-gjitha");
  const [visibleCount, setVisibleCount] = useState(PROJECTS_PER_PAGE);
  const { data: projects, isLoading } = usePublicProjects();
  const { data: heroSection } = usePageSection("projects", "hero");
  const { data: projectCategories } = useProjectCategories();
  const { data: allLinks } = useAllProjectCategoryLinks();

  // Build a map: projectId -> categoryIds
  const projectCategoryMap = useMemo(() => {
    const map: Record<string, string[]> = {};
    allLinks?.forEach((link) => {
      if (!map[link.project_id]) map[link.project_id] = [];
      map[link.project_id].push(link.category_id);
    });
    return map;
  }, [allLinks]);

  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    if (activeTag === "te-gjitha") return projects;
    // activeTag is a category id now
    return projects.filter((p) => projectCategoryMap[p.id]?.includes(activeTag));
  }, [projects, activeTag, projectCategoryMap]);

  const visibleProjects = filteredProjects.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProjects.length;

  // Reset visible count when filter changes
  const handleTagChange = (tag: string) => {
    setActiveTag(tag);
    setVisibleCount(PROJECTS_PER_PAGE);
  };

  // Get tag color
  const getTagColor = (tag: string) => {
    switch (tag) {
      case "Hotel":
        return "bg-accent text-accent-foreground";
      case "Restorante":
        return "bg-primary text-primary-foreground";
      case "Bujtinë":
        return "bg-secondary text-secondary-foreground border border-border";
      case "Resort":
        return "bg-accent/80 text-accent-foreground";
      case "Airbnb":
        return "bg-primary/80 text-primary-foreground";
      case "SPA":
        return "bg-secondary text-secondary-foreground border border-border";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  // Build display tabs from project_categories
  const displayTags = useMemo(() => {
    const tags: { value: string; label: string }[] = [{ value: "te-gjitha", label: "Të gjitha" }];
    projectCategories?.forEach((cat) => {
      // Only show categories that have at least one project
      const hasProjects = allLinks?.some((l) => l.category_id === cat.id);
      if (hasProjects) {
        tags.push({ value: cat.id, label: cat.name });
      }
    });
    return tags;
  }, [projectCategories, allLinks]);

  // Get category names for a project
  const getProjectCategoryNames = (projectId: string) => {
    const catIds = projectCategoryMap[projectId] || [];
    return catIds
      .map((id) => projectCategories?.find((c) => c.id === id)?.name)
      .filter(Boolean);
  };

 return (
   <div className="min-h-screen">
     <SeoMetaHead
       pageSlug="projects"
       fallbackTitle="Projektet Tona - EMA Hotelling"
       fallbackDescription="Shikoni projektet tona të suksesshme me hotele dhe biznese të mikpritjes."
     />
     <Header />
     <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-14">
            <span className="typo-label text-muted-foreground mb-6">
              {heroSection?.subtitle || "Portfolio"}
            </span>
            <h1 className="typo-h1 text-foreground mb-4">
              {heroSection?.title || "Projektet tona"}
            </h1>
            <p className="typo-body text-muted-foreground max-w-2xl mx-auto">
              {heroSection?.content || "Shikoni disa nga projektet e suksesshme që kemi realizuar për klientët tanë në sektorë të ndryshëm."}
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex justify-center mb-12">
            <Tabs value={activeTag} onValueChange={handleTagChange}>
              <TabsList className="flex-wrap h-auto gap-1 p-1 bg-background border border-border">
                {displayTags.map((tag) => (
                  <TabsTrigger
                    key={tag.value}
                    value={tag.value}
                    className="text-sm px-4 py-2"
                  >
                    {tag.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Projects Grid */}
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="aspect-[4/3] rounded-[15px]" />
              ))}
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {visibleProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    getTagColor={getTagColor}
                    categoryNames={getProjectCategoryNames(project.id)}
                  />
                ))}
              </div>

              {hasMore && (
                <div className="text-center mt-12">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setVisibleCount((c) => c + PROJECTS_PER_PAGE)}
                  >
                    Shiko më shumë projekte
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}

          {!isLoading && filteredProjects.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground">Nuk ka projekte në këtë kategori.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

interface ProjectCardProps {
  project: Project;
  getTagColor: (tag: string) => string;
  categoryNames?: string[];
}

const ProjectCard = ({ project, getTagColor, categoryNames }: ProjectCardProps) => {
  const heroImage = project.hero_image || "/placeholder.svg";
  
  return (
    <Link
      to={`/projekte/${project.slug}`}
      className="group bg-background border border-border hover:border-foreground/20 luxury-transition hover-lift overflow-hidden rounded-[15px]"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-[15px]">
        <img
          src={heroImage}
          alt={project.title}
          className="absolute inset-0 w-full h-full object-cover luxury-transition group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
        <div className="absolute top-4 left-4 flex flex-wrap gap-1">
          {categoryNames && categoryNames.length > 0 ? (
            categoryNames.map((name) => (
              <span key={name} className={`text-xs font-medium px-3 py-1 ${getTagColor(name!)}`}>
                {name}
              </span>
            ))
          ) : (
            <span className={`text-xs font-medium px-3 py-1 ${getTagColor(project.tag)}`}>
              {project.tag}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="typo-h3 text-foreground mb-3 group-hover:text-accent luxury-transition">
          {project.title}
        </h3>

        <p className="typo-body-sm text-muted-foreground mb-4 line-clamp-2">
          {project.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">&nbsp;</span>
          <span className="text-sm font-medium tracking-wide text-foreground flex items-center gap-2 group-hover:gap-3 luxury-transition">
            Shiko
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default Projects;
