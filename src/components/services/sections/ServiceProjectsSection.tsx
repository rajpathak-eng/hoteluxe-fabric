import { Link } from "react-router-dom";
import { usePublicProjects } from "@/hooks/useProjects";
import { PageSection } from "@/hooks/usePageSections";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight } from "lucide-react";

interface ServiceProjectsSectionProps {
  section: PageSection;
  service: {
    title: string;
    related_projects?: string[];
  };
}

export function ServiceProjectsSection({ section, service }: ServiceProjectsSectionProps) {
  const { data: allProjects, isLoading } = usePublicProjects();
  
  // Priority: section.items > service.related_projects
  const sectionItems = section.items as any[] | null;
  let projectSlugs: string[] = [];
  
  if (sectionItems && sectionItems.length > 0) {
    projectSlugs = sectionItems.map(item => 
      typeof item === 'string' ? item : (item?.slug || '')
    ).filter(Boolean);
  }
  
  // Fallback to service.related_projects
  if (projectSlugs.length === 0 && service.related_projects && service.related_projects.length > 0) {
    projectSlugs = service.related_projects;
  }
  
  // Map slugs to project data, preserving order
  const relatedProjects = projectSlugs
    .map(slug => allProjects?.find(p => p.slug === slug))
    .filter(Boolean);
  
  // Don't render if no projects
  if (!isLoading && relatedProjects.length === 0) {
    return null;
  }

  const title = section.title || "Projekte të realizuara";
  const subtitle = section.subtitle || "Shikoni disa nga projektet tona ku kemi ofruar këtë shërbim";

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-4">
            {title}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="aspect-[4/3] rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProjects.map((project) => (
              <Link
                key={project!.id}
                to={`/projekte/${project!.slug}`}
                className="group relative overflow-hidden rounded-lg aspect-[4/3]"
              >
                <img
                  src={project!.hero_image || "/placeholder.svg"}
                  alt={project!.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="inline-block text-primary-foreground/70 text-xs font-medium tracking-widest uppercase mb-2">
                    {project!.tag}
                  </span>
                  <h3 className="font-serif text-xl font-medium text-primary-foreground mb-2">
                    {project!.title}
                  </h3>
                  <span className="inline-flex items-center text-sm text-primary-foreground/80 group-hover:text-primary-foreground transition-colors">
                    Shiko projektin
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* View All Link */}
        <div className="text-center mt-10">
          <Link
            to="/projekte"
            className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Shiko të gjitha projektet
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
