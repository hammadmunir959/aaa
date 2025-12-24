import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
// Hero section with video background. Image overlays have been removed to ensure video always shows.

const Hero = () => {
  const { theme, loading } = useTheme();

  // Get hero background from theme - only use color backgrounds, ignore images
  const heroBackground = theme?.theme?.hero_background;
  const isColorBackground = heroBackground?.startsWith('#') || heroBackground?.startsWith('rgb');

  return (
    <section
      className="relative h-[600px] lg:h-[700px] flex items-center justify-center overflow-hidden bg-black"
      style={
        isColorBackground
          ? { backgroundColor: heroBackground }
          : {}
      }
    >
      {/* Always show video background - removed image overlay functionality */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/placeholder.svg"
      >
        <source src="/1475065_People_Business_3840x2160.mp4" type="video/mp4" />
        {/* Fallback for browsers that don't support <video> */}
        Your browser does not support the video tag.
      </video>

      {/* Gradient overlay on top of the video/background to keep text readable */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 leading-tight animate-fadeInUp">
            Trusted <span className="text-gold">Car Accident Management</span> at No Cost
          </h1>
          <p className="text-lg lg:text-xl text-white/90 mb-8 max-w-3xl mx-auto animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            Had a non-fault accident? We handle your claim and provide a replacement vehicle for free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
            <Link to="/contact">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8 py-6">
                Contact Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
