import { usePageSection, PageSection } from "@/hooks/usePageSections";
import { useState, useRef } from "react";
import { Volume2, VolumeX, Play, Pause } from "lucide-react";

interface VideoSectionProps {
  section?: PageSection;
  pageSlug?: string;
  sectionKey?: string;
}

interface VideoSettings {
  video_url: string;
  video_type: "upload" | "youtube" | "vimeo";
  autoplay: boolean;
  loop: boolean;
  muted: boolean;
  display_mode: "background" | "standalone";
  overlay_opacity: number;
}

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?\s]+)/);
  return match ? match[1] : null;
}

function getVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return match ? match[1] : null;
}

const VideoSection = ({ section: externalSection, pageSlug = "home", sectionKey = "video" }: VideoSectionProps) => {
  const { data: fetchedSection } = usePageSection(pageSlug, sectionKey);
  const section = externalSection || fetchedSection;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  if (!section) return null;

  const settings: VideoSettings = {
    video_url: "",
    video_type: "upload",
    autoplay: true,
    loop: true,
    muted: true,
    display_mode: "background",
    overlay_opacity: 50,
    ...(section.items as any)?.[0],
  };

  if (!settings.video_url) return null;

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const isBackground = settings.display_mode === "background";

  // Embedded video (YouTube/Vimeo)
  if (settings.video_type === "youtube" || settings.video_type === "vimeo") {
    let embedUrl = "";
    if (settings.video_type === "youtube") {
      const id = getYouTubeId(settings.video_url);
      if (!id) return null;
      const params = new URLSearchParams({
        autoplay: settings.autoplay ? "1" : "0",
        loop: settings.loop ? "1" : "0",
        mute: settings.muted ? "1" : "0",
        controls: isBackground ? "0" : "1",
        playlist: settings.loop ? id : "",
      });
      embedUrl = `https://www.youtube.com/embed/${id}?${params}`;
    } else {
      const id = getVimeoId(settings.video_url);
      if (!id) return null;
      const params = new URLSearchParams({
        autoplay: settings.autoplay ? "1" : "0",
        loop: settings.loop ? "1" : "0",
        muted: settings.muted ? "1" : "0",
        controls: isBackground ? "0" : "1",
        background: isBackground ? "1" : "0",
      });
      embedUrl = `https://player.vimeo.com/video/${id}?${params}`;
    }

    return (
      <section className={`relative ${isBackground ? "min-h-[60vh] md:min-h-[80vh]" : "py-20 bg-background"}`}>
        {isBackground ? (
          <>
            <div className="absolute inset-0 overflow-hidden">
              <iframe
                src={embedUrl}
                className="absolute inset-0 w-full h-full"
                style={{ transform: "scale(1.2)" }}
                allow="autoplay; fullscreen"
                allowFullScreen
                title={section.title || "Video"}
              />
              <div
                className="absolute inset-0 bg-primary"
                style={{ opacity: (settings.overlay_opacity || 50) / 100 }}
              />
            </div>
            <div className="relative z-10 container mx-auto px-4 flex items-center justify-center min-h-[60vh] md:min-h-[80vh]">
              <div className="text-center max-w-3xl">
                {section.subtitle && (
                  <span className="text-primary-foreground/80 font-medium text-xs tracking-widest uppercase mb-4 block">
                    {section.subtitle}
                  </span>
                )}
                {section.title && (
                  <h2 className="font-serif text-4xl md:text-6xl font-semibold text-primary-foreground mb-6 tracking-tight">
                    {section.title}
                  </h2>
                )}
                {section.content && (
                  <p className="text-primary-foreground/90 text-lg leading-relaxed">
                    {section.content}
                  </p>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="container mx-auto px-4">
            {(section.title || section.subtitle) && (
              <div className="text-center mb-14">
                {section.subtitle && (
                  <span className="text-muted-foreground font-medium text-xs tracking-widest uppercase mb-4 block">
                    {section.subtitle}
                  </span>
                )}
                {section.title && (
                  <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-4 tracking-tight">
                    {section.title}
                  </h2>
                )}
                {section.content && (
                  <p className="text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed text-sm">
                    {section.content}
                  </p>
                )}
              </div>
            )}
            <div className="max-w-5xl mx-auto rounded-[15px] overflow-hidden aspect-video">
              <iframe
                src={embedUrl}
                className="w-full h-full"
                allow="autoplay; fullscreen"
                allowFullScreen
                title={section.title || "Video"}
              />
            </div>
          </div>
        )}
      </section>
    );
  }

  // Direct video (mp4/upload)
  return (
    <section className={`relative ${isBackground ? "min-h-[60vh] md:min-h-[80vh]" : "py-20 bg-background"}`}>
      {isBackground ? (
        <>
          <div className="absolute inset-0 overflow-hidden">
            <video
              ref={videoRef}
              src={settings.video_url}
              autoPlay={settings.autoplay}
              loop={settings.loop}
              muted={isMuted}
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div
              className="absolute inset-0 bg-primary"
              style={{ opacity: (settings.overlay_opacity || 50) / 100 }}
            />
          </div>
          <div className="relative z-10 container mx-auto px-4 flex items-center justify-center min-h-[60vh] md:min-h-[80vh]">
            <div className="text-center max-w-3xl">
              {section.subtitle && (
                <span className="text-primary-foreground/80 font-medium text-xs tracking-widest uppercase mb-4 block">
                  {section.subtitle}
                </span>
              )}
              {section.title && (
                <h2 className="font-serif text-4xl md:text-6xl font-semibold text-primary-foreground mb-6 tracking-tight">
                  {section.title}
                </h2>
              )}
              {section.content && (
                <p className="text-primary-foreground/90 text-lg leading-relaxed">
                  {section.content}
                </p>
              )}
            </div>
          </div>
          {/* Video Controls */}
          <div className="absolute bottom-6 right-6 z-20 flex gap-2">
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-background/20 backdrop-blur-sm flex items-center justify-center text-primary-foreground hover:bg-background/40 luxury-transition"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={toggleMute}
              className="w-10 h-10 rounded-full bg-background/20 backdrop-blur-sm flex items-center justify-center text-primary-foreground hover:bg-background/40 luxury-transition"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </>
      ) : (
        <div className="container mx-auto px-4">
          {(section.title || section.subtitle) && (
            <div className="text-center mb-14">
              {section.subtitle && (
                <span className="text-muted-foreground font-medium text-xs tracking-widest uppercase mb-4 block">
                  {section.subtitle}
                </span>
              )}
              {section.title && (
                <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-4 tracking-tight">
                  {section.title}
                </h2>
              )}
              {section.content && (
                <p className="text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed text-sm">
                  {section.content}
                </p>
              )}
            </div>
          )}
          <div className="max-w-5xl mx-auto rounded-[15px] overflow-hidden">
            <video
              ref={videoRef}
              src={settings.video_url}
              autoPlay={settings.autoplay}
              loop={settings.loop}
              muted={isMuted}
              controls
              playsInline
              className="w-full aspect-video object-cover rounded-[15px]"
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default VideoSection;
