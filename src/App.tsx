import React, { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Instagram, Linkedin, Twitter, Banana } from "lucide-react";
import Hls from "hls.js";
import { fadeUp } from "./utils/animations";
import { cn } from "./lib/utils";

// HLS Video Component
const HLSVideo = ({ src, className }: { src: string; className?: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;

    if (Hls.isSupported()) {
      hls = new Hls({ enableWorker: false });
      hls.loadSource(src);
      hls.attachMedia(video);
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      className={className}
      autoPlay
      muted
      loop
      playsInline
    />
  );
};

// Word by Word Reveal Component
const ScrollRevealText = ({
  text,
  highlightWords = [],
  className,
}: {
  text: string;
  highlightWords?: string[];
  className?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 50%"],
  });

  const words = text.split(" ");

  return (
    <div ref={containerRef} className={cn("flex flex-wrap gap-x-[0.25em] gap-y-1", className)}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        const opacity = useTransform(scrollYProgress, [start, end], [0.15, 1]);
        const cleanWord = word.replace(/[^\w\s]/gi, "").toLowerCase();
        const isHighlight = highlightWords.includes(cleanWord);

        return (
          <motion.span
            key={i}
            style={{ opacity }}
            className={isHighlight ? "text-foreground" : "text-[var(--color-hero-subtitle)]"}
          >
            {word}
          </motion.span>
        );
      })}
    </div>
  );
};

// Main App
export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-foreground selection:text-background font-sans overflow-x-hidden">
      {/* 1. Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 py-8 px-6 md:px-16 flex items-center justify-between">
        <div className="flex items-center gap-12">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative w-7 h-7 rounded-full border-2 border-foreground/60 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full border border-foreground/60" />
            </div>
            <span className="font-bold text-xl tracking-tight">Mindloop</span>
          </div>

          {/* Links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Home</a>
            <span className="opacity-30">•</span>
            <a href="#" className="hover:text-foreground transition-colors">How It Works</a>
            <span className="opacity-30">•</span>
            <a href="#" className="hover:text-foreground transition-colors">Philosophy</a>
            <span className="opacity-30">•</span>
            <a href="#" className="hover:text-foreground transition-colors">Use Cases</a>
          </div>
        </div>

        {/* Social Icons */}
        <div className="flex items-center gap-3">
          <a href="#" className="liquid-glass w-10 h-10 rounded-full flex items-center justify-center text-foreground hover:scale-105 transition-transform">
            <Instagram className="w-4 h-4" />
          </a>
          <a href="#" className="liquid-glass w-10 h-10 rounded-full flex items-center justify-center text-foreground hover:scale-105 transition-transform">
            <Linkedin className="w-4 h-4" />
          </a>
          <a href="#" className="liquid-glass w-10 h-10 rounded-full flex items-center justify-center text-foreground hover:scale-105 transition-transform">
            <Twitter className="w-4 h-4" />
          </a>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="relative w-full h-[100svh] flex flex-col justify-center items-center text-center overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover opacity-50"
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_120549_0cd82c36-56b3-4dd9-b190-069cfc3a623f.mp4"
          />
          {/* Gradient */}
          <div className="absolute bottom-0 inset-x-0 h-[300px] bg-gradient-to-t from-background to-transparent z-[1]" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-5xl px-8 flex flex-col items-center pt-28 md:pt-32">
          {/* Avatars */}
          <motion.div {...fadeUp(0.2)} className="flex flex-col sm:flex-row items-center sm:-space-x-3 mb-6">
            <div className="flex -space-x-3">
              <div className="w-8 h-8 rounded-full border-2 border-background overflow-hidden bg-zinc-800 flex items-center justify-center">
                <Banana className="w-4 h-4 text-white" />
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-background overflow-hidden bg-zinc-700">
                <img src="/avatar-2.png" alt="User 2" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = "https://api.dicebear.com/7.x/notionists/svg?seed=Aneka")} />
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-background overflow-hidden bg-zinc-600">
                <img src="/avatar-3.png" alt="User 3" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = "https://api.dicebear.com/7.x/notionists/svg?seed=Sam")} />
              </div>
            </div>
            <span className="sm:ml-6 mt-4 sm:mt-0 text-sm text-[#a6a6a6] font-medium">7,000+ people already subscribed</span>
          </motion.div>

          <motion.h1 {...fadeUp(0.3)} className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight mb-6">
            Get <span className="font-serif italic font-normal">Inspired</span> with Us
          </motion.h1>

          <motion.p {...fadeUp(0.4)} className="text-[var(--color-hero-subtitle)] text-lg max-w-2xl mb-12">
            Join our feed for meaningful updates, news around technology and a shared journey toward depth and direction.
          </motion.p>

          <motion.div {...fadeUp(0.5)} className="w-full max-w-lg mx-auto p-2 rounded-full liquid-glass flex">
            <input
              type="email"
              placeholder="Enter your email..."
              className="bg-transparent border-none outline-none text-foreground px-6 py-2 flex-grow placeholder:text-white/40"
            />
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="bg-foreground text-background whitespace-nowrap rounded-full px-8 py-3 font-bold shrink-0 transition-transform"
            >
              SUBSCRIBE
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* 3. Search has changed Section */}
      <section className="pt-52 md:pt-64 pb-6 md:pb-9 px-6 md:px-16 w-full max-w-7xl mx-auto">
        <motion.div {...fadeUp(0.1)} className="text-center mb-24">
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight mb-6">
            Search has <span className="font-serif italic font-normal">changed.</span> Have you?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            The era of scrolling through links is ending. AI answers questions before you even click. If you are not producing unique insights, you will be abstracted away.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-20">
          <motion.div {...fadeUp(0.2)} className="flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
            <div className="w-48 xl:w-[200px] aspect-square rounded-2xl liquid-glass mb-8 flex items-center justify-center p-4">
              <div className="w-full h-full rounded-2xl overflow-hidden flex items-center justify-center bg-black">
                <img src="https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=400&auto=format&fit=crop" alt="Abstract neon wave" className="w-full h-full object-cover" />
              </div>
            </div>
            <h3 className="font-semibold text-base mb-2">ChatGPT</h3>
            <p className="text-muted-foreground text-sm max-w-[250px]">Synthesizing information across domains instantly.</p>
          </motion.div>
          
          <motion.div {...fadeUp(0.3)} className="flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
            <div className="w-48 xl:w-[200px] aspect-square rounded-2xl liquid-glass mb-8 flex items-center justify-center p-4">
              <div className="w-full h-full rounded-2xl overflow-hidden flex items-center justify-center bg-black">
                <img src="https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=400&auto=format&fit=crop" alt="Abstract neon wave" className="w-full h-full object-cover" />
              </div>
            </div>
            <h3 className="font-semibold text-base mb-2">Perplexity</h3>
            <p className="text-muted-foreground text-sm max-w-[250px]">Direct answers with citations, bypassing content farms.</p>
          </motion.div>

          <motion.div {...fadeUp(0.4)} className="flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
            <div className="w-48 xl:w-[200px] aspect-square rounded-2xl liquid-glass mb-8 flex items-center justify-center p-4">
              <div className="w-full h-full rounded-2xl overflow-hidden flex items-center justify-center bg-black">
                <img src="https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=400&auto=format&fit=crop" alt="Abstract neon wave" className="w-full h-full object-cover" />
              </div>
            </div>
            <h3 className="font-semibold text-base mb-2">Google AI</h3>
            <p className="text-muted-foreground text-sm max-w-[250px]">Overviews pushing organic blue links below the fold.</p>
          </motion.div>
        </div>

        <motion.p {...fadeUp(0.5)} className="text-muted-foreground text-sm text-center">
          If you don't answer the questions, someone else will.
        </motion.p>
      </section>

      {/* 4. Mission Section */}
      <section className="pt-0 pb-32 md:pb-44 px-6 md:px-16 w-full max-w-7xl mx-auto flex flex-col items-center">
        <motion.div {...fadeUp(0.2)} className="w-full max-w-[800px] aspect-square rounded-3xl overflow-hidden mb-24 relative">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_132944_a0d124bb-eaa1-4082-aa30-2310efb42b4b.mp4"
          />
           <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-3xl pointer-events-none" />
        </motion.div>

        <div className="max-w-[900px] text-center flex flex-col gap-10">
          <ScrollRevealText
            text="We're building a space where curiosity meets clarity — where readers find depth, writers find reach, and every newsletter becomes a conversation worth having."
            highlightWords={["curiosity", "meets", "clarity"]}
            className="justify-center text-2xl md:text-4xl lg:text-5xl font-medium tracking-tight leading-snug"
          />
          <ScrollRevealText
            text="A platform where content, community, and insight flow together — with less noise, less friction, and more meaning for everyone involved."
            className="justify-center text-xl md:text-2xl lg:text-3xl font-medium leading-snug"
          />
        </div>
      </section>

      {/* 5. Solution Section */}
      <section className="py-32 md:py-44 px-6 md:px-16 border-t border-border/30 w-full">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp(0.1)} className="mb-16">
            <span className="text-xs tracking-[3px] uppercase text-muted-foreground mb-4 block">
              SOLUTION
            </span>
            <h2 className="text-4xl md:text-6xl font-medium tracking-tight">
              The platform for <span className="font-serif italic font-normal">meaningful</span> content
            </h2>
          </motion.div>

          <motion.div {...fadeUp(0.3)} className="w-full aspect-[3/1] rounded-2xl overflow-hidden mb-20 relative">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_125119_8e5ae31c-0021-4396-bc08-f7aebeb877a2.mp4"
            />
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl pointer-events-none" />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                title: "Curated Feed",
                desc: "Signal over noise. A reading experience designed to reward focus with a distraction-free environment.",
              },
              {
                title: "Writer Tools",
                desc: "A distraction-free, rich-text editor that gets out of your way and lets your ideas flow natively.",
              },
              {
                title: "Community",
                desc: "High-signal discussions anchored to the text. We filter out the generic to elevate the profound.",
              },
              {
                title: "Distribution",
                desc: "Algorithmic discovery that values deep engagement over fleeting virality. Grow your true audience.",
              },
            ].map((feature, idx) => (
              <motion.div {...fadeUp(0.4 + idx * 0.1)} key={idx} className="flex flex-col gap-3 border-t border-border/30 pt-6">
                <h3 className="font-semibold text-base">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CTA Section */}
      <section className="relative w-full py-32 md:py-44 border-t border-border/30 min-h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Background HLS Video */}
        <div className="absolute inset-0 z-0">
          <HLSVideo
            className="w-full h-full object-cover opacity-80"
            src="https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8"
          />
        </div>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-background/45 z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-[1]" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-2xl px-8 flex flex-col items-center text-center">
          <motion.div {...fadeUp(0.1)} className="mb-8">
            <div className="relative w-10 h-10 rounded-full border-2 border-foreground/80 flex items-center justify-center">
              <div className="w-5 h-5 rounded-full border border-foreground/80" />
            </div>
          </motion.div>

          <motion.h2 {...fadeUp(0.2)} className="text-5xl md:text-7xl font-serif italic mb-6">
            Start Your Journey
          </motion.h2>
          
          <motion.p {...fadeUp(0.3)} className="text-muted-foreground text-lg mb-10 max-w-lg">
            Join the creators and readers exploring the frontiers of technology, design, and culture.
          </motion.p>

          <motion.div {...fadeUp(0.4)} className="flex flex-col sm:flex-row items-center gap-4">
            <button className="w-full sm:w-auto bg-foreground text-background font-medium rounded-lg px-8 py-3.5 hover:bg-foreground/90 transition-colors">
              Subscribe Now
            </button>
            <button className="w-full sm:w-auto liquid-glass font-medium rounded-lg px-8 py-3.5 hover:bg-white/10 transition-colors">
              Start Writing
            </button>
          </motion.div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="py-12 px-6 md:px-16 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-border/30 z-10 relative bg-background">
        <p className="text-muted-foreground text-sm">
          © 2026 Mindloop. All rights reserved.
        </p>
        <div className="flex gap-6 text-sm text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
          <a href="#" className="hover:text-foreground transition-colors">Terms</a>
          <a href="#" className="hover:text-foreground transition-colors">Contact</a>
        </div>
      </footer>
    </div>
  );
}
