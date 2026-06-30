import { useState, useEffect, useCallback } from "react";
import emailjs from "@emailjs/browser";
import confetti from "canvas-confetti";
import { Toaster, toast } from "sonner";
import CinematicLogoAnimation from "./components/CinematicLogoAnimation";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, Cell
} from "recharts";
import {
  Phone, MapPin, Instagram, Film, Play, Star, Award,
  TrendingUp, Heart, Eye, Zap, Palette, Globe, Video,
  Monitor, Scissors, Layers, Share2, MessageCircle, ChevronRight,
  ChevronLeft, Menu, X, Mic, Music, Sliders, Volume2, Image,
  Youtube, Type, Megaphone, Tv, Camera, Clapperboard
} from "lucide-react";

// ─── THEME TOKENS ─────────────────────────────────────────────────────────────
const C = {
  gold: "#FF9F00",       // Primary Gold/Amber
  goldDim: "#D68500",    // Dimmer gold
  orange: "#FFC400",     // Accent Gold/Yellow
  orangeDim: "#D6A400",  // Darker accent
  bg: "#FFFDF8",         // Premium background
  bgSoft: "#FFF9EE",     // Soft warm background
  card: "rgba(255, 253, 248, 0.75)", // Warm glassmorphic card background
  fore: "#111111",       // Premium text
  muted: "#555555",      // Muted text
  border: "rgba(255, 159, 0, 0.15)", // Primary border
  borderHot: "rgba(255, 196, 0, 0.35)", // Focus/hover border
};


// ─── DATA ─────────────────────────────────────────────────────────────────────
const growthData = [
  { month: "Jan", followers: 5, reach: 25 },
  { month: "Feb", followers: 8, reach: 45 },
  { month: "Mar", followers: 12, reach: 72 },
  { month: "Apr", followers: 17, reach: 110 },
  { month: "May", followers: 24, reach: 165 },
  { month: "Jun", followers: 32, reach: 245 },
];

const projectData = [
  { name: "Reels", value: 18, fill: C.orange },
  { name: "Posters", value: 14, fill: C.gold },
  { name: "Videos", value: 11, fill: C.orangeDim },
  { name: "Branding", value: 8, fill: C.goldDim },
  { name: "Web", value: 4, fill: "#8A4010" },
];

const quotes = [
  "Every frame tells a story.",
  "Cinema is not just entertainment; it's emotion captured forever.",
  "Creativity is intelligence having fun.",
  "Stories create connections. Visuals create impact.",
  "Great films inspire people. Great brands inspire customers.",
];

const processSteps = [
  { num: "01", title: "Idea", icon: "💡", desc: "Conceptualise the vision" },
  { num: "02", title: "Script", icon: "📝", desc: "Craft the narrative arc" },
  { num: "03", title: "Shoot", icon: "🎬", desc: "Capture with precision" },
  { num: "04", title: "Edit", icon: "✂️", desc: "Refine every frame" },
  { num: "05", title: "Design", icon: "🎨", desc: "Visual excellence" },
  { num: "06", title: "Publish", icon: "🚀", desc: "Launch to the world" },
  { num: "07", title: "Grow", icon: "📈", desc: "Scale the brand" },
];

const digitalMarketing = [
  { icon: Share2, name: "Social Media Marketing" },
  { icon: Instagram, name: "Instagram Growth" },
  { icon: Globe, name: "Facebook Marketing" },
  { icon: MessageCircle, name: "WhatsApp Marketing" },
  { icon: TrendingUp, name: "Brand Promotion" },
];

const designingServices = [
  {
    icon: Star,
    name: "Logo Design",
    types: [
      "Minimal Logo",
      "Modern Logo",
      "Vintage Logo",
      "Mascot Logo",
      "3D Logo",
      "Corporate Logo"
    ]
  },
  {
    icon: Layers,
    name: "Poster Design",
    types: [
      "Movie Poster",
      "First Look Poster",
      "Character Poster",
      "Motion Poster",
      "Event Poster",
      "Promotional Poster",
      "Political Poster",
      "Festival Poster",
      "Product Poster"
    ]
  },
  {
    icon: Heart,
    name: "Social Media Creatives",
    types: [
      "Instagram Post",
      "Instagram Story",
      "Facebook Post",
      "YouTube Thumbnail",
      "YouTube Banner",
      "LinkedIn Banner",
      "Social Media Ads"
    ]
  },
  {
    icon: Award,
    name: "Business Branding",
    types: [
      "Business Card",
      "Letterhead",
      "Company Profile",
      "Brand Identity",
      "Packaging Design",
      "Brochure Design"
    ]
  },
  {
    icon: Monitor,
    name: "Portfolio Design",
    types: [
      "Personal Portfolio",
      "Photography Portfolio",
      "Film Portfolio",
      "Agency Portfolio",
      "Company Portfolio"
    ]
  },
  {
    icon: Eye,
    name: "UI/UX Design",
    types: [
      "Mobile App UI",
      "Website UI",
      "Dashboard Design",
      "Landing Page Design",
      "Wireframe Design"
    ]
  },
  {
    icon: Globe,
    name: "Website Design",
    types: [
      "Business Website",
      "Portfolio Website",
      "E-Commerce Website",
      "Media Company Website",
      "Landing Page Website",
      "Custom Website"
    ]
  }
];

const postProduction = [
  { icon: Scissors, name: "Video Editing" },
  { icon: Mic, name: "Dubbing" },
  { icon: Palette, name: "DI Color Grading" },
  { icon: Music, name: "Background Music Production" },
  { icon: Sliders, name: "Mix & Mastering" },
  { icon: Volume2, name: "Sound Effects (SFX)" },
  { icon: Image, name: "Movie Poster Design" },
  { icon: Youtube, name: "YouTube Thumbnail Design" },
  { icon: Type, name: "Subtitle Creation" },
  { icon: Megaphone, name: "Digital Promotions" },
  { icon: Film, name: "Trailer Cut & Teaser Editing" },
  { icon: Tv, name: "OTT & Streaming Delivery" },
];

const stats = [
  { value: "42+", label: "Projects Delivered" },
  { value: "18+", label: "Happy Clients" },
  { value: "480K+", label: "Total Reach" },
  { value: "96%", label: "Client Satisfaction" },
];

const beforeAfter = [
  { label: "Average Engagement", before: "2.1%", after: "6.8%", pct: "+224%" },
  { label: "Monthly Reach", before: "18K", after: "92K", pct: "+411%" },
  { label: "Brand Score", before: "38/100", after: "84/100", pct: "+121%" },
];

const teamMembers = [
  { name: "Nithis Kumar", role: "Co-Founder & Creative Director", specialty: "Brand & Art Direction", img: "/nithis.jpg", instagram: "" },
  { name: "Thulasi Ram", role: "Filmmaker & Ad-Creator", specialty: "Filmmaking & Ads", img: "/thulasiram.jpg", instagram: "" },
  { name: "Yokash", role: "Cinematographer, Motion Designer & Film Editor", specialty: "Motion Graphics", img: "/yokash.jpg", instagram: "" },
  { name: "Vishal", role: "UI/UX Designer", specialty: "UI/UX Design", img: "/vishal.jpg", instagram: "" },
  { name: "Hariharan", role: "Web Developer", specialty: "Web Development", img: "/hariharan.png", instagram: "" },
  { name: "Kathir", role: "Content Creator & Writer", specialty: "Content & Writing", img: "/kathir.jpg", instagram: "" },
  { name: "Prem Kumar", role: "Event Organizer", specialty: "Event Management", img: "/prem.png", instagram: "" },
  { name: "Nisanth", role: "Reel Creator", specialty: "Reel Creation", img: "/nisanth.jpg", instagram: "" },
];

const PAGE_TITLES = [
  "COVER", "ABOUT US", "SERVICES", "OUR WORKS",
  "RESULTS", "OUR TEAM", "OFFERS", "CONTACT"
];

// ─── SVG COMPONENTS ───────────────────────────────────────────────────────────




function FilmStripH({ count = 30 }: { count?: number }) {
  return (
    <div className="flex w-full overflow-hidden" style={{ height: 24, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, background: "rgba(255, 255, 255, 0.85)", backdropFilter: "blur(8px)" }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex-1 flex items-center justify-center"
          style={{ borderRight: `1px solid rgba(255, 170, 0, 0.12)` }}
        >
          <div
            style={{
              width: "50%",
              height: 12,
              borderRadius: 2,
              border: `1px solid ${C.orange}40`,
              background: `linear-gradient(135deg, ${C.gold}15, ${C.orange}25)`,
            }}
          />
        </div>
      ))}
    </div>
  );
}

function FilmStripV({ count = 12 }: { count?: number }) {
  return (
    <div className="flex flex-col overflow-hidden" style={{ width: 22, borderLeft: `1px solid ${C.border}`, borderRight: `1px solid ${C.border}`, background: "rgba(255, 255, 255, 0.85)", backdropFilter: "blur(8px)" }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex-1 flex items-center justify-center"
          style={{ borderBottom: `1px solid rgba(255, 170, 0, 0.12)` }}
        >
          <div
            style={{
              width: 12,
              height: "50%",
              borderRadius: 2,
              border: `1px solid ${C.orange}40`,
              background: `linear-gradient(135deg, ${C.gold}15, ${C.orange}25)`,
            }}
          />
        </div>
      ))}
    </div>
  );
}

function CinematicQR() {
  // A static, decorative QR-like SVG pattern for @filmdappa
  const rows = [
    [1,1,1,0,0,1,0,1,1,1],
    [1,0,1,0,1,0,0,1,0,1],
    [1,0,1,1,0,1,1,1,0,1],
    [1,1,1,0,0,0,0,0,1,0],
    [0,0,0,1,1,0,1,0,1,1],
    [1,1,0,0,0,1,0,1,1,0],
    [1,1,1,0,1,0,0,1,0,1],
    [1,0,1,1,0,1,0,1,0,1],
    [1,0,1,0,1,1,1,0,1,1],
    [1,1,1,0,0,0,1,1,1,0],
  ];
  const cell = 14;
  const size = rows.length * cell + 28;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>
      <rect x="0" y="0" width={size} height={size} fill="white" />
      {/* Corner markers */}
      {[[14,14],[size-14-3*cell,14],[14,size-14-3*cell]].map(([ox,oy],ci) => (
        <g key={ci}>
          <rect x={ox} y={oy} width={3*cell} height={3*cell} fill="black" />
          <rect x={ox+cell*0.5} y={oy+cell*0.5} width={2*cell} height={2*cell} fill="white" />
          <rect x={ox+cell} y={oy+cell} width={cell} height={cell} fill="black" />
        </g>
      ))}
      {/* Data cells */}
      {rows.map((row, ri) =>
        row.map((cell_v, ci) =>
          cell_v ? (
            <rect
              key={`${ri}-${ci}`}
              x={14 + ci * cell}
              y={14 + ri * cell}
              width={cell - 1}
              height={cell - 1}
              fill="black"
              rx={1}
            />
          ) : null
        )
      )}
    </svg>
  );
}

function GoldRule({ className = "" }: { className?: string }) {
  return (
    <div
      className={`h-px w-full ${className}`}
      style={{ background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)` }}
    />
  );
}

function CornerBox({
  children,
  className = "",
  style
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={`relative ${className}`} style={style}>
      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2" style={{ borderColor: C.gold }} />
      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2" style={{ borderColor: C.gold }} />
      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2" style={{ borderColor: C.gold }} />
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2" style={{ borderColor: C.gold }} />
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="text-[10px] tracking-[0.4em] uppercase"
      style={{ fontFamily: "var(--font-mono)", color: C.orange }}
    >
      {children}
    </span>
  );
}

function PageNum({ n, label }: { n: string; label: string }) {
  return (
    <div className="absolute bottom-6 right-8 flex items-center gap-3 opacity-30 select-none">
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: C.gold, letterSpacing: "0.3em" }}>{label}</span>
      <div style={{ width: 32, height: 1, background: C.gold }} />
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: C.gold }}>{n}</span>
    </div>
  );
}

function Spotlight({ top = "0%", left = "50%", color = C.orange }: { top?: string; left?: string; color?: string }) {
  return (
    <div
      className="absolute pointer-events-none hidden md:block"
      style={{
        top,
        left,
        transform: "translate(-50%, -50%)",
        width: 800,
        height: 600,
        background: `radial-gradient(ellipse at center, ${color}14 0%, transparent 70%)`,
      }}
    />
  );
}

// ─── NAV ──────────────────────────────────────────────────────────────────────
function Nav({
  current,
  total,
  onPrev,
  onNext,
  onGoto,
  open,
  setOpen,
}: {
  current: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  onGoto: (i: number) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  return (
    <>
      {/* Fixed top bar */}
      <div
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3"
        style={{
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255, 215, 0, 0.15)",
        }}
      >
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="FILMDAPPA Logo"
            className="h-[38px] md:h-[48px] w-auto object-contain"
          />
          <span
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 900,
              fontSize: 16,
              color: C.fore,
              letterSpacing: "0.15em",
            }}
          >
            FILM DAPPA
          </span>
        </div>

        <div className="hidden md:flex items-center gap-1">
          {PAGE_TITLES.map((t, i) => (
            <button
              key={t}
              onClick={() => onGoto(i)}
              className="px-3 py-1.5 transition-all duration-200 cursor-pointer"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9.5,
                letterSpacing: "0.2em",
                color: current === i ? C.orangeDim : "#444444",
                background: current === i ? "rgba(255, 107, 0, 0.08)" : "transparent",
                border: current === i ? "1px solid rgba(255, 107, 0, 0.15)" : "1px solid transparent",
                borderRadius: "20px",
                textTransform: "uppercase",
              }}
              onMouseEnter={(e) => {
                if (current !== i) {
                  e.currentTarget.style.color = C.orange;
                  e.currentTarget.style.background = "rgba(255, 215, 0, 0.06)";
                }
              }}
              onMouseLeave={(e) => {
                if (current !== i) {
                  e.currentTarget.style.color = "#444444";
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => setOpen(!open)} className="md:hidden cursor-pointer" style={{ color: C.fore }}>
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div
          className="fixed inset-0 z-40 md:hidden flex flex-col pt-16 px-6 pb-6 gap-2"
          style={{ 
            background: "rgba(255, 255, 255, 0.98)", 
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(255, 215, 0, 0.2)"
          }}
        >
          {PAGE_TITLES.map((t, i) => (
            <button
              key={t}
              onClick={() => { onGoto(i); setOpen(false); }}
              className="text-left py-3 border-b flex items-center gap-3 cursor-pointer"
              style={{ borderColor: "rgba(255, 215, 0, 0.15)" }}
            >
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: C.orange }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span style={{ fontFamily: "var(--font-sans)", fontWeight: 600, color: current === i ? C.orangeDim : C.fore }}>{t}</span>
            </button>
          ))}
        </div>
      )}

      {/* Dot nav — right side */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-2">
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            onClick={() => onGoto(i)}
            title={PAGE_TITLES[i]}
            className="transition-all duration-200 flex items-center justify-end gap-2"
          >
            <span
              className="text-[8px] opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ fontFamily: "var(--font-mono)", color: C.muted }}
            />
            <div
              className="rounded-full transition-all duration-200"
              style={{
                width: current === i ? 20 : 5,
                height: 5,
                background: current === i ? C.orange : `${C.gold}40`,
              }}
            />
          </button>
        ))}
      </div>
    </>
  );
}

// ─── PAGES ────────────────────────────────────────────────────────────────────

function Cover() {
  return (
    <section className="relative min-h-screen flex flex-col justify-between py-12 px-5 md:py-20 md:px-10 overflow-hidden bg-white" style={{ background: "#FFFFFF" }}>
      {/* Background atmosphere with floating black cinema elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        <Film size={54} className="animate-float-1 top-[18%] left-[8%] text-black/10 absolute" />
        <Video size={64} className="animate-float-2 top-[62%] left-[10%] text-black/12 absolute" />
        <Clapperboard size={58} className="animate-float-3 top-[22%] right-[12%] text-black/10 absolute" />
        <Camera size={60} className="animate-float-1 top-[68%] right-[10%] text-black/12 absolute" />
        <Tv size={48} className="animate-float-2 top-[42%] left-[85%] text-black/8 absolute" />
        <Scissors size={46} className="animate-float-3 bottom-[18%] left-[28%] text-black/10 absolute" />
      </div>

      {/* TOP: Spacer for vertical balance since PORTFOLIO BOOKLET text was removed */}
      <div className="h-12 md:h-16" />

      {/* CENTER: Title and Branding */}
      <div className="relative z-20 text-center w-full max-w-5xl mx-auto my-auto flex flex-col items-center justify-center gap-5">
        {/* Title Heading: FILM DAPPA Animated */}
        <CinematicLogoAnimation />

        {/* Sub-heading: MEDIA COMPANY */}
        <span
          className="tracking-[0.6em] uppercase font-extrabold text-center"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "clamp(18px, 2.5vw, 30px)",
            color: "#111111",
            textShadow: "0px 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          MEDIA COMPANY
        </span>

        {/* Tagline */}
        <p
          className="italic font-light max-w-xl text-center"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(18px, 2.4vw, 24px)",
            color: "#111111",
            letterSpacing: "0.15em",
            lineHeight: 1.4,
          }}
        >
          "Where Creativity Meets Growth"
        </p>
      </div>

      {/* BOTTOM: Services and Contacts */}
      <div className="relative z-20 w-full max-w-5xl mx-auto pb-6 flex flex-col items-center gap-5">
        {/* Contact details line (very minimal) */}
        <div className="flex flex-wrap items-center justify-center gap-x-10 md:gap-x-14 gap-y-3 opacity-95">
          {[
            { icon: Phone, v: "8489854125" },
            { icon: Instagram, v: "@filmdappa" },
            { icon: MapPin, v: "Tiruchengode, TN" },
          ].map(({ icon: Icon, v }) => (
            <div key={v} className="flex items-center gap-2">
              <Icon size={13} style={{ color: C.orangeDim }} />
              <span className="text-[12px] md:text-[13px] font-bold" style={{ fontFamily: "var(--font-sans)", color: "#111111" }}>{v}</span>
            </div>
          ))}
        </div>

        <div style={{ width: "100%", height: 1.5, background: `linear-gradient(90deg, transparent, ${C.border}, transparent)` }} />

        {/* Clean list of services */}
        <p
          className="w-full text-center text-[12px] sm:text-[13.5px] md:text-[15px] tracking-[0.35em] md:tracking-[0.4em] uppercase font-extrabold"
          style={{
            fontFamily: "var(--font-mono)",
            color: "#8A4010",
          }}
        >
          POST PRODUCTION &bull; DESIGNING SERVICES &bull; DIGITAL MARKETING
        </p>
      </div>

      <PageNum n="00" label="COVER" />
    </section>
  );
}

function About() {
  return (
    <section className="relative min-h-screen flex items-center py-16 md:py-28 overflow-hidden" style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #FFFDF8 100%)" }}>
      <Spotlight top="20%" left="70%" color={C.orange} />

      <div className="relative z-10 w-[92%] max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-8 md:gap-16 items-center">
        {/* Left */}
        <div className="relative w-full flex justify-center">
          <div
            className="relative flex flex-col items-center justify-center p-6 sm:p-10 select-none h-[380px] sm:h-[500px] w-full max-w-[500px] lg:max-w-[568px] transition-all duration-500 hover:shadow-xl"
            style={{
              background: "rgba(255, 255, 255, 0.75)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 215, 0, 0.25)",
              borderRadius: "24px",
              boxShadow: "0 20px 50px rgba(255, 215, 0, 0.08), 0 5px 15px rgba(0, 0, 0, 0.01)"
            }}
          >
            <img
              src="/logo.png"
              alt="FILMDAPPA Logo"
              className="about-logo h-[200px] sm:h-[280px] w-auto object-contain"
            />
            <div className="mt-6 text-center">
              <div
                style={{
                  fontFamily: "var(--font-heading)",
                  color: "#111111",
                  fontWeight: 900,
                  fontSize: "18px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase"
                }}
              >
                FILMDAPPA MEDIA COMPANY
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  color: "#666666",
                  fontSize: "clamp(7.5px, 2vw, 10px)",
                  letterSpacing: "0.02em",
                  marginTop: "8px",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  whiteSpace: "nowrap"
                }}
              >
                Shortfilm Post Production · Designing Service · Digital Marketing
              </div>
            </div>
          </div>
        </div>

        {/* Right */}
        <div>
          <Label>About Us · Page 01</Label>
          <h2
            className="font-black leading-tight mt-4 mb-6 premium-heading-bold"
            style={{ fontSize: "var(--text-section)", color: C.fore }}
          >
            Crafting{" "}
            <span style={{ background: "linear-gradient(135deg, #FF6B00 0%, #FFA500 50%, #FFD700 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Cinematic
            </span>
            <br />Excellence
          </h2>

          <p className="premium-body-bold" style={{ fontSize: "var(--text-body)", lineHeight: 1.8, marginBottom: 28 }}>
            <strong>Film Dappa</strong> is a full-spectrum creative media agency rooted in Tiruchengode, Tamil Nadu. We unite cinematic storytelling with strategic digital marketing — helping brands find their voice, grow their audience, and leave a lasting impression.
          </p>

          <GoldRule className="mb-8" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-5 mb-8">
            {[
              { t: "Our Vision", b: "To become South India's most trusted creative force — where every pixel and frame carries purpose." },
              { t: "Our Mission", b: "Delivering world-class design, post-production, and marketing that transforms brands into cultural movements." },
            ].map(({ t, b }) => (
              <div key={t} className="pl-4" style={{ borderLeft: `3px solid ${C.orangeDim}` }}>
                <div style={{ fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 800, color: C.orangeDim, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 6 }}>{t}</div>
                <p className="premium-body-bold" style={{ fontSize: "var(--text-small)", lineHeight: 1.7 }}>{b}</p>
              </div>
            ))}
          </div>

          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 9.5, color: C.orangeDim, letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 800, marginBottom: 14 }}>
              Why Choose Film Dappa
            </div>
            {[
              "End-to-end creative production under one roof",
              "Cinematic quality in every frame and pixel",
              "Data-driven marketing with an artistic soul",
              "Dedicated team with deep local & global vision",
            ].map((p) => (
              <div key={p} className="flex items-start gap-3 mb-3 hover:translate-x-1 transition-transform">
                <ChevronRight size={14} style={{ color: C.orange, marginTop: 2, flexShrink: 0 }} />
                <span className="premium-body-bold" style={{ fontSize: 14 }}>{p}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <PageNum n="01" label="ABOUT" />
    </section>
  );
}



function ServiceRow({ icon: Icon, name, color }: { icon: React.ElementType; name: string; color: string }) {
  return (
    <div
      className="flex items-center gap-3 p-2.5 transition-all duration-300 group rounded-xl border border-transparent cursor-default"
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(255, 107, 0, 0.2)";
        e.currentTarget.style.background = "rgba(255, 215, 0, 0.04)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "transparent";
        e.currentTarget.style.background = "transparent";
      }}
    >
      <div className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg" style={{ background: "rgba(255, 170, 0, 0.08)", border: "1px solid rgba(255, 170, 0, 0.25)" }}>
        <Icon size={12} style={{ color: C.orangeDim }} />
      </div>
      <span className="premium-body-bold group-hover:translate-x-1 transition-transform" style={{ fontSize: 13, opacity: 0.95 }}>{name}</span>
    </div>
  );
}

function DesigningServiceAccordionItem({
  icon: Icon,
  name,
  types,
  color,
  isOpen,
  onToggle
}: {
  icon: React.ElementType;
  name: string;
  types: string[];
  color: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const activeColor = C.orangeDim;
  return (
    <div
      className="flex flex-col transition-all duration-300 rounded-xl overflow-hidden mb-1"
      style={{
        border: `1px solid ${isOpen ? "rgba(255, 107, 0, 0.3)" : "rgba(255, 215, 0, 0.15)"}`,
        background: isOpen ? "rgba(255, 215, 0, 0.04)" : "transparent",
        boxShadow: isOpen ? "0 4px 15px rgba(255, 107, 0, 0.05)" : "none",
      }}
    >
      {/* Accordion header button */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-2.5 text-left transition-all duration-300 group cursor-pointer focus:outline-none rounded-xl"
      >
        <div className="flex items-center gap-3">
          <div
            className="flex-shrink-0 w-7 h-7 flex items-center justify-center transition-all duration-300 rounded-lg"
            style={{
              background: isOpen ? "rgba(255, 107, 0, 0.15)" : "rgba(255, 215, 0, 0.08)",
              border: `1px solid ${isOpen ? "rgba(255, 107, 0, 0.35)" : "rgba(255, 215, 0, 0.2)"}`,
              boxShadow: isOpen ? "0 0 8px rgba(255, 107, 0, 0.15)" : "none"
            }}
          >
            <Icon size={12} style={{ color: isOpen ? activeColor : C.orangeDim, transition: "color 0.3s" }} />
          </div>
          <span
            className="transition-colors duration-300 premium-body-bold"
            style={{
              fontSize: 13,
              color: isOpen ? activeColor : C.fore,
              opacity: isOpen ? 1 : 0.95,
              textShadow: isOpen ? "0 0 8px rgba(255, 107, 0, 0.2)" : "none"
            }}
          >
            {name}
          </span>
        </div>

        <ChevronRight
          size={13}
          className="transition-transform duration-300"
          style={{
            color: isOpen ? activeColor : C.muted,
            transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
          }}
        />
      </button>

      {/* Expandable sub-list */}
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: isOpen ? `${types.length * 36 + 8}px` : "0px",
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div className="pl-12 pr-4 pb-3 flex flex-col gap-1">
          {types.map((type) => (
            <div
              key={type}
              className="flex items-center gap-2 py-1.5 transition-all duration-200 hover:pl-1.5"
            >
              <div
                className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                style={{
                  background: isOpen ? activeColor : "rgba(255, 170, 0, 0.4)",
                  boxShadow: isOpen ? "0 0 4px rgba(255, 107, 0, 0.8)" : "none"
                }}
              />
              <span
                className="transition-colors duration-200 cursor-default premium-body-bold"
                style={{
                  fontSize: 12.5,
                  opacity: 0.85
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = C.fore;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = C.muted;
                }}
              >
                {type}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Services() {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const cols = [
    { num: "01", title: "Post Production", icon: Film, color: C.orangeDim, items: postProduction, desc: "Cinematic editing, grading, and motion that brings stories to life." },
    { num: "02", title: "Designing Services", icon: Palette, color: C.orangeDim, items: designingServices, desc: "Visually stunning identities and creative assets that demand attention.", featured: true },
    { num: "03", title: "Digital Marketing", icon: TrendingUp, color: C.orangeDim, items: digitalMarketing, desc: "Grow your brand's digital footprint across every platform." },
  ];
  return (
    <section className="relative min-h-screen py-16 md:py-28 overflow-hidden" style={{ background: "linear-gradient(180deg, #FFFDF8 0%, #FFFFFF 100%)" }}>
      <Spotlight top="10%" left="50%" color={C.gold} />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-10">
        <div className="text-center mb-16">
          <Label>Our Services · Page 02</Label>
          <h2
            className="font-black leading-tight mt-4 premium-heading-bold"
            style={{ fontSize: "var(--text-section)", color: C.fore }}
          >
            What We{" "}
            <span style={{ background: "linear-gradient(135deg, #FF6B00, #FFA500, #FFD700)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Create
            </span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {cols.map(({ num, title, icon: Icon, color, items, desc, featured }) => (
            <div
              key={title}
              className="relative flex flex-col rounded-3xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-default"
              style={{
                border: featured ? "1px solid rgba(255, 107, 0, 0.3)" : "1px solid rgba(255, 215, 0, 0.2)",
                background: featured ? "rgba(255, 255, 255, 0.95)" : "rgba(255, 255, 255, 0.75)",
                backdropFilter: "blur(20px)",
                boxShadow: featured 
                  ? "0 20px 40px rgba(255, 107, 0, 0.08)" 
                  : "0 10px 30px rgba(0, 0, 0, 0.02)",
              }}
            >
              {featured && (
                <div
                  className="absolute top-0 left-6 right-6 h-1 rounded-full"
                  style={{ background: "linear-gradient(90deg, #FFD700, #FF6B00)" }}
                />
              )}

              <div className="p-6 pb-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 flex items-center justify-center rounded-xl" style={{ background: "rgba(255, 107, 0, 0.08)", border: "1px solid rgba(255, 107, 0, 0.25)" }}>
                    <Icon size={17} style={{ color: C.orangeDim }} />
                  </div>
                  <div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 9.5, color: C.orangeDim, letterSpacing: "0.2em", fontWeight: 800 }}>{num}</div>
                    <div className="premium-heading-bold" style={{ fontSize: "var(--text-card)", color: C.fore }}>{title}</div>
                  </div>
                </div>
                <p className="premium-body-bold" style={{ fontSize: "var(--text-small)", lineHeight: 1.6, marginBottom: 16 }}>{desc}</p>
                <div style={{ height: 1, background: "linear-gradient(90deg, rgba(255, 107, 0, 0.2), transparent)", marginBottom: 16 }} />
              </div>

              <div className="flex-1 px-3 pb-6 space-y-0.5">
                {items.map((s) => {
                  const item = s as { icon: React.ElementType; name: string; types?: string[] };
                  if (item.types) {
                    return (
                      <DesigningServiceAccordionItem
                        key={item.name}
                        icon={item.icon}
                        name={item.name}
                        types={item.types}
                        color={color}
                        isOpen={openCategory === item.name}
                        onToggle={() => setOpenCategory(openCategory === item.name ? null : item.name)}
                      />
                    );
                  }
                  return (
                    <ServiceRow key={item.name} icon={item.icon} name={item.name} color={color} />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <PageNum n="02" label="SERVICES" />
    </section>
  );
}

function Works() {
  const [activeCategory, setActiveCategory] = useState<string>("Short Film");

  const portfolioItems = [
    // Short Film
    {
      title: "100 Rubaai",
      category: "Short Film",
      status: "Released",
      videoUrl: "https://youtu.be/WLdbzGxszo4?si=SV0PPfr0dr-Cuw5N",
      img: "/100_rubaai.png",
      cls: "col-span-1 row-span-2"
    },
    {
      title: "Adayaalam",
      category: "Short Film",
      status: "Released",
      videoUrl: "https://youtu.be/WoZlFqWxJ_U?si=_ZVSpOXSw6lbglID",
      img: "/adayaalam.png",
      cls: "col-span-1 row-span-1"
    },
    {
      title: "Immature",
      category: "Short Film",
      status: "Released",
      videoUrl: "https://youtu.be/oaI47J6ML0I?si=Amlr0cwYjt_vERN3",
      img: "/immature.jpg",
      cls: "col-span-2 row-span-1"
    },
    {
      title: "Uraiyadal",
      category: "Short Film",
      status: "Released",
      videoUrl: "https://youtu.be/ZQH6uXYhQr4?si=8HLn8wjeBNCZpgnU",
      img: "/uraiyadal.jpg",
      cls: "col-span-1 row-span-1"
    },
    {
      title: "Hidden Life",
      category: "Short Film",
      status: "Released",
      videoUrl: "https://youtu.be/GwDt0JgqLjk?si=BTT_UxUPQnuGd9aH",
      img: "/hidden_life.jpg",
      cls: "col-span-1 row-span-1"
    }
  ];

  const categories = ["Short Film"];
  const isAll = false;
  const filtered = portfolioItems;

  return (
    <section className="relative min-h-screen py-16 px-5 md:py-28 md:px-10 overflow-hidden" style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #FFFDF8 100%)" }}>
      <Spotlight top="50%" left="50%" color={C.orange} />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="mb-12">
          <Label>Our Works · Page 03</Label>
          <h2
            className="font-black leading-tight mt-4 premium-heading-bold"
            style={{ fontSize: "var(--text-section)", color: C.fore }}
          >
            Our{" "}
            <span style={{ background: "linear-gradient(135deg, #FF6B00, #FFA500, #FFD700)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Shortfilm
            </span>
          </h2>
          <p className="premium-body-bold" style={{ fontSize: 14, color: C.muted, marginTop: 8 }}>
            A curated showcase of our cinematic short films.
          </p>
        </div>

        {/* Desktop Gallery */}
        <div className="hidden md:grid grid-cols-3 gap-5" style={isAll ? { gridTemplateRows: "240px 240px 210px" } : {}}>
          {filtered.map((item) => (
            <div
              key={item.title}
              onClick={() => window.open(item.videoUrl, "_blank")}
              className={`${isAll ? item.cls : "col-span-1"} relative group overflow-hidden cursor-pointer rounded-2xl shadow-md transition-shadow duration-300 hover:shadow-xl`}
              style={{ border: "1px solid rgba(255, 215, 0, 0.25)", height: isAll ? "auto" : "260px" }}
            >
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 animate-fade-in"
                style={{ opacity: 0.8 }}
              />
              <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 20%, rgba(17, 17, 17, 0.95) 100%)" }} />

              {/* Corner marker */}
              <div className="absolute top-4 left-4 w-4 h-4" style={{ borderTop: "2px solid #FFA500", borderLeft: "2px solid #FFA500" }} />
              <div className="absolute top-4 right-4 w-4 h-4" style={{ borderTop: "2px solid #FFA500", borderRight: "2px solid #FFA500" }} />

              {/* Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-6 group-hover:translate-y-0 transition-transform duration-300 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 8.5, color: C.gold, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700 }}>
                    {item.category}
                  </span>
                  <span 
                    className="flex items-center gap-1.5 px-2 py-0.5" 
                    style={{ 
                      fontFamily: "var(--font-mono)", 
                      fontSize: 7.5, 
                      color: "#FFFFFF", 
                      background: "rgba(255, 107, 0, 0.85)", 
                      border: "1px solid rgba(255, 215, 0, 0.5)",
                      borderRadius: "4px",
                      fontWeight: 700
                    }}
                  >
                    <span 
                      className="w-1.5 h-1.5 rounded-full animate-pulse" 
                      style={{ backgroundColor: "#FFFFFF" }} 
                    />
                    {item.status}
                  </span>
                </div>
                <div style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 700, color: "#FFFFFF" }}>
                  {item.title}
                </div>
                {/* Watch Now Button */}
                <div className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div 
                    className="flex items-center justify-center gap-1.5 py-1.5 w-full text-[9px] tracking-[0.2em] font-bold uppercase transition-all rounded-lg"
                    style={{ border: `1px solid ${C.gold}`, color: "#FFFFFF", background: "rgba(255, 215, 0, 0.12)" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = C.gold;
                      e.currentTarget.style.color = "#111111";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(255, 215, 0, 0.12)";
                      e.currentTarget.style.color = "#FFFFFF";
                    }}
                  >
                    <Play size={8} fill="currentColor" />
                    WATCH NOW
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Gallery */}
        <div className="flex flex-col gap-5 md:hidden">
          {filtered.map((item) => (
            <div
              key={item.title}
              onClick={() => window.open(item.videoUrl, "_blank")}
              className="relative group overflow-hidden h-[240px] cursor-pointer rounded-2xl shadow-md"
              style={{ border: "1px solid rgba(255, 215, 0, 0.25)" }}
            >
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-full object-cover"
                style={{ opacity: 0.8 }}
              />
              <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 20%, rgba(17, 17, 17, 0.95) 100%)" }} />
              <div className="absolute top-4 left-4 w-3.5 h-3.5" style={{ borderTop: "1.5px solid #FFA500", borderLeft: "1.5px solid #FFA500" }} />
              <div className="absolute top-4 right-4 w-3.5 h-3.5" style={{ borderTop: "1.5px solid #FFA500", borderRight: "1.5px solid #FFA500" }} />
              
              <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 8.5, color: C.gold, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700 }}>
                    {item.category}
                  </span>
                  <span 
                    className="flex items-center gap-1 px-1.5 py-0.5" 
                    style={{ 
                      fontFamily: "var(--font-mono)", 
                      fontSize: 7.5, 
                      color: "#FFFFFF", 
                      background: "rgba(255, 107, 0, 0.85)", 
                      border: "1px solid rgba(255, 215, 0, 0.5)",
                      borderRadius: "4px",
                      fontWeight: 700
                    }}
                  >
                    <span 
                      className="w-1.5 h-1.5 rounded-full" 
                      style={{ backgroundColor: "#FFFFFF" }} 
                    />
                    {item.status}
                  </span>
                </div>
                <div style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 700, color: "#FFFFFF" }}>
                  {item.title}
                </div>
                <div 
                  className="flex items-center justify-center gap-1.5 py-2 w-full text-[8.5px] tracking-[0.2em] font-bold uppercase mt-1 rounded-lg"
                  style={{ border: `1px solid ${C.gold}`, color: "#FFFFFF", background: "rgba(255, 215, 0, 0.12)" }}
                >
                  <Play size={8} fill="currentColor" />
                  WATCH NOW
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <PageNum n="03" label="WORKS" />
    </section>
  );
}

const TooltipStyle = {
  contentStyle: { 
    background: "rgba(255, 255, 255, 0.95)", 
    border: "1px solid rgba(255, 215, 0, 0.35)", 
    borderRadius: "12px", 
    boxShadow: "0 10px 25px rgba(0,0,0,0.05)" 
  },
  labelStyle: { fontFamily: "var(--font-mono)", fontSize: 10, color: "#111111", fontWeight: 700 },
  itemStyle: { fontFamily: "var(--font-sans)", fontSize: 11, color: "#444444" },
};

function Results() {
  return (
    <section className="relative min-h-screen py-16 md:py-28 overflow-hidden" style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #FFFDF8 100%)" }}>
      <Spotlight top="30%" left="30%" color={C.gold} />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-10">
        <div className="mb-12">
          <Label>Client Results · Page 04</Label>
          <h2
            className="font-black leading-tight mt-4"
            style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-section)", color: C.fore }}
          >
            Growth{" "}
            <span style={{ background: "linear-gradient(135deg, #FF6B00, #FFA500, #FFD700)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Metrics
            </span>
          </h2>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="relative p-6 text-center group overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[rgba(255,215,0,0.06)]"
              style={{ border: "1px solid rgba(255, 215, 0, 0.25)", background: "rgba(255, 255, 255, 0.75)", backdropFilter: "blur(16px)" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.borderHot)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255, 215, 0, 0.25)")}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: `radial-gradient(ellipse at center, ${i % 2 === 0 ? C.orange : C.gold}08 0%, transparent 70%)` }}
              />
              <div
                className="font-black leading-none mb-2 transition-transform duration-300 group-hover:scale-105"
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "var(--text-section)",
                  background: i % 2 === 0
                    ? "linear-gradient(135deg, #FF6B00, #FFA500)"
                    : "linear-gradient(135deg, #FFA500, #FF6B00)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {s.value}
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-small)", color: C.muted, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600 }}>{s.label}</div>
              <div className="absolute top-2 right-2 w-3 h-3" style={{ borderTop: "1px solid rgba(255, 107, 0, 0.3)", borderRight: "1px solid rgba(255, 107, 0, 0.3)" }} />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Area chart */}
          <div 
            className="md:col-span-2 p-6 w-full overflow-hidden rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300" 
            style={{ border: "1px solid rgba(255, 215, 0, 0.25)", background: "rgba(255, 255, 255, 0.75)", backdropFilter: "blur(16px)" }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.borderHot)}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255, 215, 0, 0.25)")}
          >
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 9.5, color: C.orangeDim, letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 700, marginBottom: 20 }}>
              Follower & Reach Growth — 6 Months
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={growthData} margin={{ top: 10, right: 5, left: -15, bottom: 5 }}>
                <defs>
                  <linearGradient id="fGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={C.orange} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={C.orange} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="rGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={C.gold} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={C.gold} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 4" stroke="rgba(255, 215, 0, 0.15)" />
                <XAxis dataKey="month" tick={{ fill: "#666666", fontSize: 10, fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fill: "#666666", fontSize: 9, fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}K`} />
                <YAxis yAxisId="right" orientation="right" tick={{ fill: "#666666", fontSize: 9, fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}K`} />
                <Tooltip {...TooltipStyle} />
                <Area yAxisId="left" type="monotone" dataKey="followers" name="Followers" stroke={C.orangeDim} strokeWidth={2.5} fill="url(#fGrad)" />
                <Area yAxisId="right" type="monotone" dataKey="reach" name="Reach" stroke={C.goldDim} strokeWidth={2.5} fill="url(#rGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Radial */}
          <div 
            className="p-6 w-full overflow-hidden rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300" 
            style={{ border: "1px solid rgba(255, 215, 0, 0.25)", background: "rgba(255, 255, 255, 0.75)", backdropFilter: "blur(16px)" }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.borderHot)}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255, 215, 0, 0.25)")}
          >
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 9.5, color: C.orangeDim, letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 700, marginBottom: 20 }}>
              Projects by Category
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={projectData} layout="vertical" margin={{ left: 15, right: 15 }}>
                <CartesianGrid strokeDasharray="2 4" stroke="rgba(255, 215, 0, 0.15)" horizontal={false} />
                <XAxis type="number" tick={{ fill: "#666666", fontSize: 9, fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fill: "#666666", fontSize: 10, fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} width={75} />
                <Tooltip {...TooltipStyle} />
                <Bar dataKey="value" name="Projects" radius={[0, 4, 4, 0]}>
                  {projectData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Before / After */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {beforeAfter.map((item, i) => (
            <div 
              key={item.label} 
              className="p-5 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300" 
              style={{ border: "1px solid rgba(255, 215, 0, 0.25)", background: "rgba(255, 255, 255, 0.75)", backdropFilter: "blur(16px)" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.borderHot)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255, 215, 0, 0.25)")}
            >
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 8.5, color: C.muted, letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 14, fontWeight: 600 }}>{item.label}</div>
              <div className="flex items-center gap-3">
                <div className="flex-1 text-center">
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: C.muted, marginBottom: 4 }}>Before</div>
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-card)", fontWeight: 700, color: C.muted }}>{item.before}</div>
                </div>
                <div style={{ color: C.orangeDim, fontSize: 18, fontWeight: 700 }}>→</div>
                <div className="flex-1 text-center">
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: C.orangeDim, marginBottom: 4, fontWeight: 700 }}>After</div>
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-card)", fontWeight: 700, color: C.orangeDim }}>{item.after}</div>
                </div>
                <div style={{ fontFamily: "var(--font-heading)", fontSize: 20, fontWeight: 900, color: C.orangeDim }}>{item.pct}</div>
              </div>
              {/* Progress bar */}
              <div className="mt-4" style={{ height: 4, background: "rgba(255, 215, 0, 0.15)", borderRadius: 2 }}>
                <div style={{ height: "100%", width: `${[68, 92, 84][i]}%`, background: "linear-gradient(90deg, #FFD700, #FF6B00)", borderRadius: 2 }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <PageNum n="04" label="RESULTS" />
    </section>
  );
}

function Process() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section className="relative min-h-screen flex items-center py-16 md:py-28 overflow-hidden" style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #FFFDF8 100%)" }}>
      <Spotlight top="50%" left="50%" color={C.orange} />

      {/* Editing timeline tracks bg */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.02]">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              top: `${10 + i * 10}%`,
              left: 0,
              right: 0,
              height: 18,
              background: i % 2 === 0 ? C.gold : C.orange,
            }}
          />
        ))}
        {/* Timeline playhead */}
        <div className="absolute top-0 bottom-0" style={{ left: "38%", width: 2, background: C.orange }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-10 w-full">
        <div className="text-center mb-16">
          <Label>Creative Process · Page 04</Label>
          <h2
            className="font-black leading-tight mt-4"
            style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-section)", color: C.fore }}
          >
            How We{" "}
            <span style={{ background: "linear-gradient(135deg, #FF6B00, #FFA500, #FFD700)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Work
            </span>
          </h2>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: C.muted, marginTop: 8, maxWidth: 500, margin: "8px auto 0" }}>
            A disciplined 7-step workflow — from raw spark to measurable brand growth.
          </p>
        </div>

        {/* Horizontal workflow */}
        <div className="relative">
          {/* Connector line */}
          <div
            className="absolute top-14 left-[7%] right-[7%] h-px hidden md:block"
            style={{ background: "linear-gradient(90deg, transparent, rgba(255, 107, 0, 0.25), transparent)" }}
          />

          <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
            {processSteps.map((step, i) => {
              const isActive = active === i;
              const col = i % 2 === 0 ? C.orangeDim : C.goldDim;
              const colLight = i % 2 === 0 ? C.orange : C.gold;
              return (
                <button
                  key={step.num}
                  className="flex flex-col items-center text-center group cursor-pointer focus:outline-none"
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                >
                  {/* Step icon */}
                  <div
                    className="relative w-28 h-28 flex flex-col items-center justify-center mb-4 transition-all duration-300"
                    style={{
                      border: `1.5px solid ${isActive ? colLight : "rgba(255, 215, 0, 0.25)"}`,
                      background: isActive ? "rgba(255, 170, 0, 0.05)" : "rgba(255, 255, 255, 0.75)",
                      backdropFilter: "blur(16px)",
                      transform: isActive ? "scale(1.06)" : "scale(1)",
                      borderRadius: "16px",
                      boxShadow: isActive ? "0 10px 25px rgba(255, 107, 0, 0.12)" : "0 4px 12px rgba(0,0,0,0.01)"
                    }}
                  >
                    <div
                      className="absolute -top-1.5 -left-1.5 w-4 h-4"
                      style={{ borderTop: `2px solid ${colLight}`, borderLeft: `2px solid ${colLight}`, opacity: isActive ? 1 : 0.4 }}
                    />
                    <div
                      className="absolute -bottom-1.5 -right-1.5 w-4 h-4"
                      style={{ borderBottom: `2px solid ${colLight}`, borderRight: `2px solid ${colLight}`, opacity: isActive ? 1 : 0.4 }}
                    />
                    <div className="text-2xl mb-1">{step.icon}</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: col, letterSpacing: "0.2em", marginBottom: 2, fontWeight: 700 }}>{step.num}</div>
                    <div style={{ fontFamily: "var(--font-heading)", fontSize: 14, fontWeight: 700, color: C.fore }}>{step.title}</div>
                  </div>

                  <div
                    style={{ fontFamily: "var(--font-sans)", fontSize: 11.5, color: C.muted, lineHeight: 1.5, opacity: isActive ? 1 : 0.75, transition: "opacity 0.2s" }}
                  >
                    {step.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Editing timeline visual */}
        <div className="mt-16 relative w-full overflow-hidden rounded-2xl shadow-sm" style={{ border: "1px solid rgba(255, 215, 0, 0.25)", background: "rgba(255, 255, 255, 0.75)", backdropFilter: "blur(20px)", padding: "16px 20px" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: C.orangeDim, letterSpacing: "0.35em", textTransform: "uppercase", marginBottom: 14, fontWeight: 700 }}>
            Project Timeline — Editing Suite
          </div>
          <div className="grid gap-2">
            {[
              { label: "Concept / Script", w: "25%", color: C.goldDim },
              { label: "Shoot / Capture", w: "20%", ml: "25%", color: "#B8860B" },
              { label: "Edit / Post", w: "30%", ml: "45%", color: C.orange },
              { label: "Design / Review", w: "15%", ml: "75%", color: C.orangeDim },
              { label: "Publish / Grow", w: "10%", ml: "90%", color: C.goldDim },
            ].map((track) => (
              <div key={track.label} className="relative flex items-center gap-3" style={{ height: 24 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(7.5px, 1.5vw, 8px)", color: C.muted, width: 110, flexShrink: 0, fontWeight: 600 }}>{track.label}</span>
                <div className="flex-1 relative" style={{ height: 14, background: "rgba(255, 215, 0, 0.12)", borderRadius: 4 }}>
                  <div
                    className="absolute top-0 bottom-0"
                    style={{
                      left: (track as any).ml || "0%",
                      width: track.w,
                      background: `linear-gradient(90deg, ${track.color}90, ${track.color})`,
                      borderRadius: 4,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          {/* Playhead */}
          <div
            className="absolute top-10 bottom-4"
            style={{ left: "calc(110px + 20px + (100% - 110px - 60px) * 0.53 + 20px)", width: 1, background: C.orange, opacity: 0.7 }}
          >
            <div style={{ width: 7, height: 7, background: C.orange, borderRadius: "50%", marginLeft: -3, marginTop: -3 }} />
          </div>
        </div>

        <div className="mt-12 text-center">
          <GoldRule className="mb-8" />
          <p style={{ fontFamily: "var(--font-heading)", fontSize: 20, fontStyle: "italic", color: "#333333" }}>
            "From the first spark of an idea to the final frame — we own every step."
          </p>
          <GoldRule className="mt-8" />
        </div>
      </div>

      <PageNum n="04" label="PROCESS" />
    </section>
  );
}

function QuotesPage() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive((p) => (p + 1) % quotes.length), 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" style={{ background: "linear-gradient(180deg, #FFFDF8 0%, #FFFFFF 100%)" }}>
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&h=1080&fit=crop&auto=format"
          alt="Cinema"
          className="w-full h-full object-cover"
          style={{ opacity: 0.05 }}
        />
        <div className="absolute inset-0" style={{ background: "#FFFFFF", opacity: 0.85 }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(255, 215, 0, 0.1) 0%, transparent 70%)" }} />
      </div>

      {/* Spotlight beams */}
      <div className="absolute top-0 left-1/4 w-px h-1/2 opacity-20" style={{ background: "linear-gradient(180deg, #FFD700, transparent)" }} />
      <div className="absolute top-0 right-1/4 w-px h-1/2 opacity-20" style={{ background: "linear-gradient(180deg, #FFD700, transparent)" }} />

      <div className="relative z-10 max-w-4xl mx-auto px-10 text-center w-full">
        <Label>Cinema Quotes · Page 05</Label>

        <GoldRule className="mt-8 mb-12" />

        {/* Large quote mark */}
        <div
          className="absolute select-none pointer-events-none"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: 240,
            color: "rgba(255, 107, 0, 0.05)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -60%)",
            lineHeight: 1,
          }}
          aria-hidden
        >
          "
        </div>

        {/* Active quote */}
        <div style={{ minHeight: 160 }} className="flex flex-col items-center justify-center">
          <p
            key={active}
            className="italic font-bold leading-tight mb-6"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(22px,4vw,38px)",
              color: C.fore,
              transition: "opacity 0.5s",
            }}
          >
            "{quotes[active]}"
          </p>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: C.orangeDim, letterSpacing: "0.35em", fontWeight: 700 }}>
            — Film Dappa
          </div>
        </div>

        <GoldRule className="mt-12 mb-10" />

        {/* Dot nav */}
        <div className="flex items-center justify-center gap-3 mb-12">
          {quotes.map((_, i) => (
            <button key={i} onClick={() => setActive(i)} aria-label={`Quote ${i + 1}`} className="cursor-pointer">
              <div
                className="rounded-full transition-all duration-200"
                style={{ width: i === active ? 28 : 6, height: 6, background: i === active ? C.orange : "rgba(255, 215, 0, 0.4)" }}
              />
            </button>
          ))}
        </div>

        {/* All quotes mini */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {quotes.map((q, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="text-left p-4 transition-all duration-200 rounded-xl cursor-pointer"
              style={{
                border: `1px solid ${i === active ? "rgba(255, 107, 0, 0.35)" : "rgba(255, 215, 0, 0.15)"}`,
                background: i === active ? "rgba(255, 107, 0, 0.05)" : "rgba(255, 255, 255, 0.5)",
              }}
            >
              <p style={{ fontFamily: "var(--font-sans)", fontSize: 10, color: i === active ? C.fore : C.muted, lineHeight: 1.5, fontWeight: i === active ? 600 : 400 }}>
                "{q.length > 40 ? q.slice(0, 40) + "…" : q}"
              </p>
            </button>
          ))}
        </div>
      </div>

      <PageNum n="05" label="QUOTES" />
    </section>
  );
}

function ProcessedImage({ src, alt, className, style }: { src: string; alt: string; className?: string; style?: React.CSSProperties }) {
  const [processedSrc, setProcessedSrc] = useState<string>(src);

  useEffect(() => {
    const img = new window.Image();
    if (src.startsWith("http") || src.includes("unsplash.com")) {
      img.crossOrigin = "anonymous";
    }
    img.src = src;
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        const w = canvas.width;
        const h = canvas.height;

        // Sample corners to detect background color
        let sumR = 0, sumG = 0, sumB = 0, count = 0;
        const sampleSize = 8;
        const sampleOffsets = [
          [0, 0],
          [w - sampleSize, 0],
          [0, h - sampleSize],
          [w - sampleSize, h - sampleSize]
        ];

        for (const [sx, sy] of sampleOffsets) {
          for (let dy = 0; dy < sampleSize; dy++) {
            for (let dx = 0; dx < sampleSize; dx++) {
              const px = sx + dx;
              const py = sy + dy;
              if (px >= 0 && px < w && py >= 0 && py < h) {
                const idx = (py * w + px) * 4;
                sumR += data[idx];
                sumG += data[idx + 1];
                sumB += data[idx + 2];
                count++;
              }
            }
          }
        }

        const avgR = sumR / count;
        const avgG = sumG / count;
        const avgB = sumB / count;

        // Use queue-based flood fill from borders to make background transparent
        const visited = new Uint8Array(w * h);
        const queue: [number, number][] = [];

        // Initialize queue with border pixels
        for (let x = 0; x < w; x++) {
          queue.push([x, 0]);
          queue.push([x, h - 1]);
          visited[x] = 1;
          visited[(h - 1) * w + x] = 1;
        }
        for (let y = 1; y < h - 1; y++) {
          queue.push([0, y]);
          queue.push([w - 1, y]);
          visited[y * w] = 1;
          visited[y * w + w - 1] = 1;
        }

        const threshold = 48; // balanced color distance threshold

        while (queue.length > 0) {
          const [cx, cy] = queue.shift()!;
          const offset = (cy * w + cx) * 4;
          const r = data[offset];
          const g = data[offset + 1];
          const b = data[offset + 2];

          const dist = Math.sqrt(
            Math.pow(r - avgR, 2) +
            Math.pow(g - avgG, 2) +
            Math.pow(b - avgB, 2)
          );

          if (dist < threshold) {
            data[offset + 3] = 0; // set transparent

            const neighbors = [
              [cx + 1, cy],
              [cx - 1, cy],
              [cx, cy + 1],
              [cx, cy - 1]
            ];
            for (const [nx, ny] of neighbors) {
              if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
                const nIdx = ny * w + nx;
                if (visited[nIdx] === 0) {
                  visited[nIdx] = 1;
                  queue.push([nx, ny]);
                }
              }
            }
          }
        }

        ctx.putImageData(imgData, 0, 0);

        // Crop bounding box of visible content
        let minX = w, minY = h, maxX = 0, maxY = 0;
        let hasVisible = false;
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const a = data[(y * w + x) * 4 + 3];
            if (a > 15) {
              if (x < minX) minX = x;
              if (y < minY) minY = y;
              if (x > maxX) maxX = x;
              if (y > maxY) maxY = y;
              hasVisible = true;
            }
          }
        }

        if (hasVisible) {
          const cropW = maxX - minX + 1;
          const cropH = maxY - minY + 1;
          const cropCanvas = document.createElement("canvas");
          cropCanvas.width = cropW;
          cropCanvas.height = cropH;
          const cropCtx = cropCanvas.getContext("2d");
          if (cropCtx) {
            cropCtx.drawImage(canvas, minX, minY, cropW, cropH, 0, 0, cropW, cropH);
            setProcessedSrc(cropCanvas.toDataURL());
          } else {
            setProcessedSrc(canvas.toDataURL());
          }
        } else {
          setProcessedSrc(canvas.toDataURL());
        }
      } catch (err) {
        console.warn("Dynamic background removal failed, using original src:", src, err);
        setProcessedSrc(src);
      }
    };
    img.onerror = () => {
      setProcessedSrc(src);
    };
  }, [src]);

  return (
    <img
      src={processedSrc}
      alt={alt}
      className={className}
      style={style}
    />
  );
}

function Team() {
  const [imgHovered, setImgHovered] = useState(false);

  return (
    <section className="relative min-h-screen py-16 md:py-28 overflow-hidden" style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #FFFDF8 100%)" }}>
      <Spotlight top="15%" left="80%" color={C.orange} />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-10">
        <div className="mb-12">
          <Label>Founder & Team · Page 05</Label>
          <h2
            className="font-black leading-tight mt-4"
            style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-section)", color: C.fore }}
          >
            The Creative{" "}
            <span style={{ background: "linear-gradient(135deg, #FF6B00, #FFA500, #FFD700)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Force
            </span>
          </h2>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: C.muted, marginTop: 8 }}>
            Storytellers, designers, editors, and strategists working as one.
          </p>
        </div>

        {/* Team cards */}
        <div className="space-y-5">
          {/* Row 1: 4 members (Founder + first 3 workers) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {/* Founder Card */}
            <div className="group team-member-card flex flex-col h-full overflow-hidden rounded-2xl shadow-sm cursor-default">
              <div className="relative overflow-hidden" style={{ height: 230, background: "radial-gradient(circle at center, #3A3D42 0%, #151619 100%)" }}>
                <img
                  src="/founder.png"
                  alt="Lakshan Sudhakar"
                  className="w-full h-full object-cover object-center card-img"
                />
                <div className="absolute top-4 left-4 w-4 h-4" style={{ borderTop: "2px solid #D9A441", borderLeft: "2px solid #D9A441" }} />
                <div className="absolute top-4 right-4 w-4 h-4" style={{ borderTop: "2px solid #D9A441", borderRight: "2px solid #D9A441" }} />
                <div
                  className="absolute bottom-4 left-4 px-2.5 py-1 rounded-md"
                  style={{ background: "rgba(217, 164, 65, 0.08)", border: "1px solid rgba(217, 164, 65, 0.25)", backdropFilter: "blur(8px)" }}
                >
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: "#D9A441", letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: 700 }}>Founder</span>
                </div>
              </div>
              <div className="p-4 flex flex-col items-start flex-1 min-h-[92px]">
                <div style={{ fontFamily: "var(--font-sans)", fontSize: 14.5, fontWeight: 700, color: C.fore }}>Lakshan Sudhakar</div>
                <div style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: C.muted, marginTop: 2 }}>Founder of FilmDappa, Filmmaker, Graphic Designer & Creative Entrepreneur</div>
              </div>
            </div>

            {/* First 3 Worker Cards */}
            {teamMembers.slice(0, 3).map((m) => (
              <div
                key={m.name || m.role}
                className="group team-member-card flex flex-col h-full overflow-hidden rounded-2xl shadow-sm cursor-default"
              >
                <div className="relative overflow-hidden" style={{ height: 230, background: "radial-gradient(circle at center, #3A3D42 0%, #151619 100%)" }}>
                  <img
                    src={m.img.startsWith("/") ? m.img : `https://images.unsplash.com/photo-${m.img}?w=400&h=400&fit=crop&auto=format`}
                    alt={m.name || m.role}
                    className="w-full h-full object-cover object-center card-img"
                    style={{ opacity: 0.95 }}
                  />
                  <div className="absolute top-4 left-4 w-4 h-4" style={{ borderTop: "2px solid #D9A441", borderLeft: "2px solid #D9A441" }} />
                  <div className="absolute top-4 right-4 w-4 h-4" style={{ borderTop: "2px solid #D9A441", borderRight: "2px solid #D9A441" }} />
                  <div
                    className="absolute bottom-4 left-4 px-2.5 py-1 rounded-md"
                    style={{ background: "rgba(217, 164, 65, 0.08)", border: "1px solid rgba(217, 164, 65, 0.25)", backdropFilter: "blur(8px)" }}
                  >
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: "#D9A441", letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: 700 }}>{m.specialty}</span>
                  </div>
                </div>
                <div className="p-4 flex flex-col items-start flex-1 min-h-[92px]">
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: 14.5, fontWeight: 700, color: C.fore }}>{m.name || m.role}</div>
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: C.muted, marginTop: 2 }}>{m.role}</div>
                  {m.instagram && (
                    <a
                      href={`https://instagram.com/${m.instagram.replace("@", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-2 text-[10px] font-semibold transition-colors"
                      style={{ color: C.orangeDim }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = C.orange)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = C.orangeDim)}
                    >
                      <Instagram size={10} />
                      {m.instagram}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Row 2: Remaining members centered */}
          <div className="flex flex-wrap justify-center gap-5">
            {teamMembers.slice(3).map((m) => (
              <div
                key={m.name || m.role}
                className="w-[calc(50%-10px)] md:w-[calc(25%-15px)] flex flex-col h-full overflow-hidden rounded-2xl shadow-sm cursor-default group team-member-card"
              >
                <div className="relative overflow-hidden" style={{ height: 230, background: "radial-gradient(circle at center, #3A3D42 0%, #151619 100%)" }}>
                  <img
                    src={m.img.startsWith("/") ? m.img : `https://images.unsplash.com/photo-${m.img}?w=400&h=400&fit=crop&auto=format`}
                    alt={m.name || m.role}
                    className="w-full h-full object-cover object-center card-img"
                    style={{ opacity: 0.95 }}
                  />
                  <div className="absolute top-4 left-4 w-4 h-4" style={{ borderTop: "2px solid #D9A441", borderLeft: "2px solid #D9A441" }} />
                  <div className="absolute top-4 right-4 w-4 h-4" style={{ borderTop: "2px solid #D9A441", borderRight: "2px solid #D9A441" }} />
                  <div
                    className="absolute bottom-4 left-4 px-2.5 py-1 rounded-md"
                    style={{ background: "rgba(217, 164, 65, 0.08)", border: "1px solid rgba(217, 164, 65, 0.25)", backdropFilter: "blur(8px)" }}
                  >
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: "#D9A441", letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: 700 }}>{m.specialty}</span>
                  </div>
                </div>
                <div className="p-4 flex flex-col items-start flex-1 min-h-[92px]">
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: 14.5, fontWeight: 700, color: C.fore }}>{m.name || m.role}</div>
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: C.muted, marginTop: 2 }}>{m.role}</div>
                  {m.instagram && (
                    <a
                      href={`https://instagram.com/${m.instagram.replace("@", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-2 text-[10px] font-semibold transition-colors"
                      style={{ color: C.orangeDim }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = C.orange)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = C.orangeDim)}
                    >
                      <Instagram size={10} />
                      {m.instagram}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Studio stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.slice(2).concat(stats.slice(0, 2)).map((s) => (
            <div key={s.label + "team"} className="flex items-center gap-4 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow" style={{ border: "1px solid rgba(255, 215, 0, 0.2)", background: "rgba(255, 255, 255, 0.75)", backdropFilter: "blur(16px)" }}>
              <div style={{ width: 3, height: 32, background: "linear-gradient(180deg, #FF6B00, #FFA500)", flexShrink: 0 }} />
              <div>
                <div style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-card)", fontWeight: 900, color: C.orangeDim }}>{s.value}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-small)", color: C.muted, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <PageNum n="05" label="TEAM" />
    </section>
  );
}

function Contact() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim() || !message.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }

    const trimmedContact = contact.trim();
    const isTenDigits = /^\d{10}$/.test(trimmedContact);
    const isGmail = trimmedContact.toLowerCase().includes("@gmail.com") || trimmedContact.toLowerCase().includes("@gmail,com");

    if (!isTenDigits && !isGmail) {
      toast.error("Please enter a valid 10-digit phone number or a Gmail address (containing @gmail.com).");
      return;
    }

    const validatedContact = trimmedContact.toLowerCase().includes("@gmail,com")
      ? trimmedContact.replace(/@gmail,com/i, "@gmail.com")
      : trimmedContact;

    setStatus("submitting");
    emailjs.send(
      "service_m8nh23t",
      "template_aajl4am",
      {
        name: name,
        from_name: name,
        email: validatedContact,
        from_email: validatedContact,
        contact: validatedContact,
        message: message,
        to_email: "filmdappa@gmail.com"
      },
      "T1_z2_B3EhKob9bM-"
    )
    .then(() => {
      setStatus("success");
      setShowSuccessModal(true);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
      setName("");
      setContact("");
      setMessage("");
      setTimeout(() => setStatus("idle"), 3000);
    })
    .catch((err) => {
      console.error("EmailJS Error:", err);
      setStatus("error");
      setShowErrorModal(true);
      toast.error("Something went wrong. Please try again.");
      setTimeout(() => setStatus("idle"), 3000);
    });
  };

  return (
    <section className="relative min-h-screen flex items-center py-16 md:py-28 overflow-hidden" style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #FFFDF8 100%)" }}>
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600&h=900&fit=crop&auto=format"
          alt="Camera"
          className="w-full h-full object-cover"
          style={{ opacity: 0.05 }}
        />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(255, 215, 0, 0.08) 0%, transparent 70%)" }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-10 w-full">
        {/* Contact form grid */}

        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* Contact details */}
          <div className="space-y-6">
            <div className="space-y-4">
              {[
                { icon: Phone, label: "Call Us", value: "8489854125", sub: "Mon–Sat · 9 AM – 7 PM IST", href: "tel:8489854125", color: C.orangeDim },
                { icon: Instagram, label: "Instagram", value: "@filmdappa", sub: "DM us for quick creative chats", href: "https://instagram.com/filmdappa", color: C.orange },
                { icon: Youtube, label: "YouTube Channel", value: "FILMDAPPA", sub: "Subscribe for creative films", href: "https://youtube.com/@filmdappa?si=DmTt0mLuiNMqWTbF", color: "#FF0000" },
                { icon: MapPin, label: "Studio", value: "VISIT OFFICE", sub: "Tamil Nadu, India — 637211", href: "https://maps.app.goo.gl/NPmCvy21gRPYHGyw6", color: C.orangeDim },
              ].map((c) => (
                <a 
                  key={c.label} 
                  href={c.href} 
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="flex items-start gap-5 group p-4 rounded-2xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md cursor-pointer border"
                  style={{
                    border: "1px solid rgba(255, 215, 0, 0.25)",
                    background: "rgba(255, 255, 255, 0.75)",
                    backdropFilter: "blur(16px)"
                  }}
                >
                  <div
                    className="w-12 h-12 flex items-center justify-center flex-shrink-0 transition-all duration-350 rounded-xl"
                    style={{ border: `1px solid ${c.color}35`, background: `${c.color}08` }}
                  >
                    <c.icon size={17} style={{ color: c.color }} />
                  </div>
                  <div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 9.5, color: c.color, letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>{c.label}</div>
                    <div
                      style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-card)", fontWeight: 700, color: C.fore }}
                    >
                      {c.value}
                    </div>
                    <div style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: C.muted, marginTop: 3 }}>{c.sub}</div>
                  </div>
                </a>
              ))}
            </div>

          </div>

          {/* Form + CTA */}
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 sm:p-8 rounded-3xl shadow-lg border"
                  style={{
                    background: "rgba(255, 255, 255, 0.8)",
                    backdropFilter: "blur(20px)",
                    borderColor: "rgba(255, 215, 0, 0.25)"
                  }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: C.orangeDim, letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>
                Send a Direct Message
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label style={{ fontFamily: "var(--font-sans)", fontSize: 12.5, fontWeight: 700, color: "#444444" }}>Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="px-4 py-3 border rounded-xl outline-none transition-all"
                  style={{
                    background: "rgba(255, 255, 255, 0.5)",
                    borderColor: "rgba(255, 215, 0, 0.3)",
                    color: "#111111",
                    fontFamily: "var(--font-sans)",
                    fontSize: 13.5
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = C.orange;
                    e.target.style.background = "#FFFFFF";
                    e.target.style.boxShadow = "0 0 10px rgba(255, 165, 0, 0.15)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(255, 215, 0, 0.3)";
                    e.target.style.background = "rgba(255, 255, 255, 0.5)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label style={{ fontFamily: "var(--font-sans)", fontSize: 12.5, fontWeight: 700, color: "#444444" }}>Email or Phone Number</label>
                <input
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="email@example.com or phone number"
                  className="px-4 py-3 border rounded-xl outline-none transition-all"
                  style={{
                    background: "rgba(255, 255, 255, 0.5)",
                    borderColor: "rgba(255, 215, 0, 0.3)",
                    color: "#111111",
                    fontFamily: "var(--font-sans)",
                    fontSize: 13.5
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = C.orange;
                    e.target.style.background = "#FFFFFF";
                    e.target.style.boxShadow = "0 0 10px rgba(255, 165, 0, 0.15)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(255, 215, 0, 0.3)";
                    e.target.style.background = "rgba(255, 255, 255, 0.5)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label style={{ fontFamily: "var(--font-sans)", fontSize: 12.5, fontWeight: 700, color: "#444444" }}>Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your project or inquiry..."
                  rows={4}
                  className="px-4 py-3 border rounded-xl outline-none transition-all resize-none"
                  style={{
                    background: "rgba(255, 255, 255, 0.5)",
                    borderColor: "rgba(255, 215, 0, 0.3)",
                    color: "#111111",
                    fontFamily: "var(--font-sans)",
                    fontSize: 13.5
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = C.orange;
                    e.target.style.background = "#FFFFFF";
                    e.target.style.boxShadow = "0 0 10px rgba(255, 165, 0, 0.15)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(255, 215, 0, 0.3)";
                    e.target.style.background = "rgba(255, 255, 255, 0.5)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full py-3.5 mt-2 text-xs tracking-[0.2em] font-bold uppercase transition-all duration-300 shadow-md cursor-pointer rounded-xl text-white font-black"
                style={{
                  background: "linear-gradient(135deg, #FFD700, #FFA500, #FF6B00)",
                  border: "none",
                  boxShadow: "0 4px 15px rgba(255, 107, 0, 0.25)"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 8px 25px rgba(255, 107, 0, 0.4)";
                  e.currentTarget.style.transform = "translateY(-1.5px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 4px 15px rgba(255, 107, 0, 0.25)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {status === "submitting" ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>SENDING...</span>
                  </span>
                ) : (
                  "SEND MESSAGE"
                )}
              </button>
            </form>

            <a
              href="tel:8489854125"
              className="flex items-center justify-center gap-3 w-full py-4 transition-all duration-300 group rounded-2xl cursor-pointer"
              style={{ border: `2px solid ${C.orange}`, color: C.orangeDim, background: "rgba(255, 170, 0, 0.04)" }}
              onMouseEnter={(e) => { 
                (e.currentTarget as HTMLAnchorElement).style.background = "linear-gradient(135deg, #FFD700, #FFA500, #FF6B00)"; 
                (e.currentTarget as HTMLAnchorElement).style.color = "#FFF"; 
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "transparent";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 24px rgba(255, 107, 0, 0.35)";
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => { 
                (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255, 170, 0, 0.04)"; 
                (e.currentTarget as HTMLAnchorElement).style.color = C.orangeDim; 
                (e.currentTarget as HTMLAnchorElement).style.borderColor = C.orange;
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
              }}
            >
              <Phone size={15} />
              <span style={{ fontFamily: "var(--font-sans)", fontWeight: 800, fontSize: 13, letterSpacing: "0.25em", textTransform: "uppercase" }}>
                Book a Consultation
              </span>
            </a>

            <div style={{ fontFamily: "var(--font-mono)", fontSize: 8.5, color: C.muted, textAlign: "center", letterSpacing: "0.3em", marginTop: 16, textTransform: "uppercase", fontWeight: 600 }}>
              8489854125 · @filmdappa · Tiruchengode
            </div>
          </div>
        </div>

        <GoldRule className="mt-14" />
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div 
            className="w-full max-w-md p-8 rounded-3xl border shadow-2xl text-center relative overflow-hidden"
            style={{
              background: "rgba(20, 20, 20, 0.95)",
              borderColor: "rgba(255, 215, 0, 0.35)",
              boxShadow: "0 25px 50px -12px rgba(255, 107, 0, 0.25)"
            }}
          >
            <div className="absolute inset-0 pointer-events-none opacity-20" style={{ background: "radial-gradient(circle at center, #FFD700 0%, transparent 70%)" }} />
            
            <div className="relative z-10">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full border-2" style={{ borderColor: "#FFD700", background: "rgba(255, 215, 0, 0.1)" }}>
                <svg className="w-8 h-8" style={{ color: "#FFD700" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h3 className="text-xl font-bold mb-3 uppercase tracking-widest text-white" style={{ fontFamily: "var(--font-sans)" }}>
                Request Sent
              </h3>
              
              <p className="text-[14px] leading-relaxed text-gray-300 mb-6 font-medium" style={{ fontFamily: "var(--font-sans)" }}>
                Thank you! Your consultation request has been sent successfully. We'll contact you shortly.
              </p>

              <button
                onClick={() => setShowSuccessModal(false)}
                className="px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest text-white transition-all cursor-pointer animate-pulse"
                style={{
                  background: "linear-gradient(135deg, #FFD700, #FFA500, #FF6B00)",
                  border: "none"
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showErrorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div 
            className="w-full max-w-md p-8 rounded-3xl border shadow-2xl text-center relative overflow-hidden"
            style={{
              background: "rgba(20, 20, 20, 0.95)",
              borderColor: "rgba(239, 68, 68, 0.35)",
              boxShadow: "0 25px 50px -12px rgba(239, 68, 68, 0.25)"
            }}
          >
            <div className="relative z-10">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full border-2 border-red-500 bg-red-500/10">
                <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>

              <h3 className="text-xl font-bold mb-3 uppercase tracking-widest text-white" style={{ fontFamily: "var(--font-sans)" }}>
                Failed to Send
              </h3>
              
              <p className="text-[14px] leading-relaxed text-gray-300 mb-6 font-medium" style={{ fontFamily: "var(--font-sans)" }}>
                Something went wrong. Please try again.
              </p>

              <button
                onClick={() => setShowErrorModal(false)}
                className="px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest text-white transition-all cursor-pointer bg-red-600 hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      <PageNum n="07" label="CONTACT" />
    </section>
  );
}
function Finale() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [priceRevealed, setPriceRevealed] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleGetMoreDetails = () => {
    toast.success("Opening WhatsApp for package details...");
    setTimeout(() => {
      window.open("https://wa.me/918489854125?text=Hi%20Film%20Dappa%20Media,%20I'm%20interested%20in%20your%20First%20Offer%20package.%20I'd%20like%20to%20know%20more%20details.", "_blank");
    }, 800);
  };

  const triggerCelebration = () => {
    setShowPriceModal(true);
    setPriceRevealed(false);

    // Blast gold particles
    const duration = 2 * 1000;
    const end = Date.now() + duration;
    const goldColors = ['#FFD700', '#FFA500', '#FFDF00', '#D4AF37', '#B8860B', '#FFFFFF'];

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: goldColors,
        zIndex: 9999
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: goldColors,
        zIndex: 9999
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    
    // Central blast immediately
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: goldColors,
      zIndex: 9999
    });

    frame();

    setTimeout(() => {
      setPriceRevealed(true);
    }, 300);
  };

  return (
    <section 
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex flex-col items-center justify-between pt-24 pb-20 px-5 md:pt-32 md:pb-24 md:px-10 overflow-hidden bg-white" 
      style={{ background: "#FFFFFF" }}
    >
      <style>{`
        @keyframes floatDust {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.15; }
          50% { transform: translateY(-25px) translateX(12px); opacity: 0.5; }
        }
        @keyframes floatLight {
          0%, 100% { transform: translateY(0px) rotate(-12deg); }
          50% { transform: translateY(-10px) rotate(-11deg); }
        }
        @keyframes floatIPhone {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-7px) rotate(1.5deg); }
        }
        @keyframes floatGimbal {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-11px) rotate(-1deg); }
        }
        @keyframes floatMic {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(1deg); }
        }
        @keyframes floatCard {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes floatChipItem {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-5px) translateX(1.5px); }
        }
        @keyframes goldShine {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes shine {
          0% { transform: translateX(-100%); }
          50%, 100% { transform: translateX(100%); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes goldenGlow {
          0%, 100% { opacity: 0.4; filter: blur(40px); }
          50% { opacity: 0.8; filter: blur(55px); }
        }
        .hover-product {
          cursor: default;
        }
        .glass-card-premium {
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 196, 0, 0.25);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.02);
          border-radius: 20px;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .glass-card-premium:hover {
          box-shadow: 0 25px 45px rgba(255, 196, 0, 0.06);
        }
        .floating-chip {
          animation: floatChipItem 4s ease-in-out infinite;
        }
        .dust-particle {
          position: absolute;
          background: rgba(255, 196, 0, 0.3);
          border-radius: 50%;
          pointer-events: none;
        }
        .light-ray {
          position: absolute;
          width: 800px;
          height: 600px;
          background: radial-gradient(circle, rgba(255, 196, 0, 0.06) 0%, transparent 70%);
          pointer-events: none;
          mix-blend-mode: screen;
        }

        .product-light-wrapper {
          position: absolute;
          left: 3%;
          bottom: 35px;
          height: 270px;
          animation: floatLight 5s ease-in-out infinite;
          transform-origin: bottom center;
        }
        .product-iphone-wrapper {
          position: absolute;
          left: 26%;
          bottom: 12px;
          height: 155px;
          animation: floatIPhone 6s ease-in-out infinite;
          animation-delay: 0.5s;
          transform-origin: bottom center;
        }
        .product-gimbal-wrapper {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          bottom: 18px;
          height: 190px;
          animation: floatGimbal 4s ease-in-out infinite;
          animation-delay: 0.2s;
          transform-origin: bottom center;
        }
        .product-mic-wrapper {
          position: absolute;
          right: 3%;
          bottom: 15px;
          height: 100px;
          animation: floatMic 5.5s ease-in-out infinite;
          animation-delay: 0.8s;
          transform-origin: bottom center;
        }

        @media (max-width: 768px) {
          .product-light-wrapper {
            left: 2%;
            bottom: 25px;
            height: 170px;
          }
          .product-iphone-wrapper {
            left: 25%;
            bottom: 8px;
            height: 110px;
          }
          .product-gimbal-wrapper {
            left: 50%;
            bottom: 12px;
            height: 125px;
          }
          .product-mic-wrapper {
            right: 2%;
            bottom: 10px;
            height: 75px;
          }
        }
      `}</style>

      {/* Background Atmosphere */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        {/* Parallax Light Rays */}
        <div 
          className="light-ray top-[-10%] left-[10%] animate-[goldenGlow_8s_ease-in-out_infinite]"
          style={{ transform: `translate(${mousePos.x * 25}px, ${mousePos.y * 25}px)` }}
        />
        <div 
          className="light-ray bottom-[-10%] right-[10%] animate-[goldenGlow_12s_ease-in-out_infinite]"
          style={{ transform: `translate(${mousePos.x * -15}px, ${mousePos.y * -15}px)` }}
        />

        {/* Ambient Golden Leaks */}
        <div className="absolute top-[20%] left-[-200px] w-[500px] h-[500px] rounded-full bg-amber-400/5 blur-[120px]" />
        <div className="absolute bottom-[20%] right-[-200px] w-[500px] h-[500px] rounded-full bg-amber-300/5 blur-[120px]" />

        {/* Thin Floating Background Icons */}
        <Tv size={54} className="opacity-5 top-[15%] left-[8%] absolute" />
        <Camera size={64} className="opacity-5 bottom-[20%] left-[10%] absolute" />
        <Clapperboard size={58} className="opacity-5 top-[18%] right-[10%] absolute" />
        <Video size={60} className="opacity-5 bottom-[18%] right-[8%] absolute" />

        {/* Floating dust particles */}
        <div className="dust-particle w-2.5 h-2.5 top-[25%] left-[30%] animate-[floatDust_7s_infinite_ease-in-out]" />
        <div className="dust-particle w-1.5 h-1.5 top-[65%] left-[20%] animate-[floatDust_9s_infinite_ease-in-out_delay-1s]" />
        <div className="dust-particle w-2 h-2 top-[40%] right-[25%] animate-[floatDust_8s_infinite_ease-in-out_delay-2s]" />
        <div className="dust-particle w-1 h-1 bottom-[30%] right-[35%] animate-[floatDust_6s_infinite_ease-in-out_delay-3s]" />
      </div>

      <div className="absolute top-0 left-0 right-0 z-10"><FilmStripH count={40} /></div>
      <div className="absolute bottom-0 left-0 right-0 z-10"><FilmStripH count={40} /></div>

      <div className="h-2 w-full" />

      {/* Main Content Area */}
      <div className="relative z-20 w-full max-w-[1400px] mx-auto flex flex-col items-center gap-12 my-auto">
        
        {/* Header Titles */}
        <div className="text-center space-y-4 max-w-3xl animate-[fadeUp_1.2s_cubic-bezier(0.16,1,0.3,1)_forwards]">
          <div className="inline-block px-5 py-1.5 rounded-md" style={{ background: "linear-gradient(135deg, #FF6B00 0%, #FFA500 50%, #FFD700 100%)" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "#111111", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 900 }}>
              LET'S MAKE A PURE CINEMA
            </span>
          </div>
          <h1
            className="leading-none text-center font-black tracking-tight uppercase"
            style={{
              fontSize: "clamp(48px, 7.5vw, 95px)",
              display: "block",
              lineHeight: 1.05,
              background: "linear-gradient(135deg, #9C6A0F 0%, #FFD700 50%, #B8860B 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: 950
            }}
          >
            FIRST OFFER
          </h1>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(14px, 2vw, 17px)", fontWeight: 700, color: C.fore, letterSpacing: "0.02em" }}>
            A Complete 10-Minute Filmmaking Package for New Age Creators
          </p>
        </div>

        {/* 3-Column Content Layout */}
        <div className="w-full grid lg:grid-cols-3 items-center gap-8 lg:gap-4 xl:gap-8">
          
          {/* Left Card: Pre Production */}
          <div 
            className="glass-card-premium py-5 px-6 flex flex-col items-center justify-center text-center max-w-[340px] mx-auto w-full animate-[floatCard_7s_infinite_ease-in-out]"
            style={{ 
              transform: `translate(${mousePos.x * -8}px, ${mousePos.y * -8}px)`,
              height: "150px"
            }}
          >
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: 15, fontWeight: 900, color: C.fore, letterSpacing: "0.08em", marginBottom: 8 }}>
              PRE PRODUCTION
            </h3>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: C.muted, fontWeight: 600, lineHeight: 1.5 }}>
              (iPhone 16, Gimbal,<br />
              LC500R Light,<br />
              Live Audio Mic)
            </p>
          </div>

          {/* Center Column: Interactive Podium & Products */}
          <div className="flex flex-col items-center justify-center min-h-[380px] relative">
            
            {/* Products container */}
            <div className="relative w-full max-w-[440px] h-[300px] z-20 flex justify-center">
              
              {/* Product 1: LC500R RGB Tube Light */}
              <div className="hover-product product-light-wrapper">
                <img 
                  src="/product_light.png" 
                  alt="LC500R Tube Light" 
                  className="h-full w-auto object-contain"
                />
              </div>

              {/* Product 2: iPhone 16 */}
              <div className="hover-product product-iphone-wrapper">
                <img 
                  src="/product_iphone.png" 
                  alt="iPhone 16" 
                  className="h-full w-auto object-contain"
                />
              </div>

              {/* Product 3: Gimbal */}
              <div className="hover-product product-gimbal-wrapper">
                <img 
                  src="/product_gimbal.png" 
                  alt="Smartphone Gimbal" 
                  className="h-full w-auto object-contain"
                />
              </div>

              {/* Product 4: Microphone */}
              <div className="hover-product product-mic-wrapper">
                <img 
                  src="/product_mic.png" 
                  alt="Wireless Microphone" 
                  className="h-full w-auto object-contain"
                />
              </div>
            </div>
          </div>

          {/* Right Card: Post Production */}
          <div 
            className="glass-card-premium py-5 px-6 flex flex-col items-center justify-center text-center max-w-[340px] mx-auto w-full animate-[floatCard_8s_infinite_ease-in-out_delay-1s]"
            style={{ 
              transform: `translate(${mousePos.x * 8}px, ${mousePos.y * 8}px)`,
              height: "150px"
            }}
          >
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: 15, fontWeight: 900, color: C.fore, letterSpacing: "0.08em", marginBottom: 8 }}>
              POST PRODUCTION
            </h3>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: C.muted, fontWeight: 600, lineHeight: 1.5 }}>
              (Short Film Edit, Title Design,<br />
              First Look, Release Poster,<br />
              Promotion Video)
            </p>
          </div>

        </div>

        {/* CTA Bottom Area: Premium Glass Container */}
        <div className="relative z-30 w-full max-w-xl mx-auto px-4 pt-4">
          <div className="p-6 md:p-8 rounded-3xl backdrop-blur-xl border border-white/40 shadow-2xl flex flex-col sm:flex-row items-center justify-center gap-4 w-full animate-[fadeUp_1.4s_cubic-bezier(0.16,1,0.3,1)_forwards]"
               style={{
                 background: "rgba(255, 255, 255, 0.45)",
                 boxShadow: "0 20px 40px rgba(0, 0, 0, 0.04), inset 0 0 0 1px rgba(255, 255, 255, 0.6)"
               }}
          >
            {/* Button 1: TAP TO SEE THE PRICE */}
            <button
              onClick={triggerCelebration}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl text-xs font-extrabold tracking-[0.15em] uppercase transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer shadow-lg hover:shadow-xl"
              style={{
                background: "linear-gradient(135deg, #FFC400 0%, #FFB300 50%, #FF9F00 100%)",
                color: "#111111",
                fontFamily: "var(--font-mono)",
                border: "1px solid rgba(255, 255, 255, 0.4)",
                boxShadow: "0 8px 25px rgba(255, 196, 0, 0.35)"
              }}
            >
              <span>TAP TO SEE THE PRICE</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </button>

            {/* Button 2: GET MORE DETAILS */}
            <button
              onClick={handleGetMoreDetails}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl text-xs font-extrabold tracking-[0.15em] uppercase transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer border hover:bg-black/5"
              style={{
                background: "#111111",
                color: "#FFFFFF",
                fontFamily: "var(--font-mono)",
                borderColor: "#111111",
                boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)"
              }}
            >
              <span>GET MORE DETAILS</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
              </svg>
            </button>
          </div>
        </div>

      </div>

      {/* Footer info */}
      <div className="relative z-20 w-full max-w-5xl mx-auto px-4 mt-8 pt-6 border-t border-dashed border-gray-200/80 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="FILMDAPPA Logo" className="h-6 w-auto opacity-90" />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: C.orangeDim, letterSpacing: "0.2em", fontWeight: 700 }} className="tracking-widest">
            FILMDAPPA MEDIA COMPANY
          </span>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 text-xs font-medium" style={{ fontFamily: "var(--font-sans)", color: C.muted }}>
          <a href="https://instagram.com/filmdappa" target="_blank" rel="noopener noreferrer" className="hover:text-amber-600 transition-colors">
            Instagram
          </a>
          <span className="opacity-30">|</span>
          <span>Tiruchengode, TN</span>
          <span className="opacity-30">|</span>
          <a href="tel:8489854125" className="hover:text-amber-600 transition-colors">
            +91 84898 54125
          </a>
        </div>

        <p style={{ fontFamily: "var(--font-sans)", fontSize: 10, color: C.muted }} className="text-center md:text-right">
          &copy; {new Date().getFullYear()} <strong>FilmDappa</strong>. All rights reserved.
        </p>
      </div>

      {/* Price Reveal Pop-up Modal */}
      {showPriceModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-500 ease-out"
            onClick={() => setShowPriceModal(false)}
          />
          
          {/* Modal Container */}
          <div 
            className={`relative w-full max-w-md p-8 rounded-3xl border border-amber-400/30 text-center shadow-2xl transition-all duration-500 ease-out transform ${
              priceRevealed ? "scale-100 opacity-100" : "scale-90 opacity-0"
            }`}
            style={{
              background: "rgba(17, 17, 17, 0.95)",
              boxShadow: "0 25px 50px -12px rgba(255, 196, 0, 0.25), inset 0 0 0 1px rgba(255, 255, 255, 0.05)"
            }}
          >
            {/* Close button */}
            <button 
              onClick={() => setShowPriceModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors cursor-pointer p-1 rounded-full hover:bg-white/10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>

            {/* Glowing Golden Aura behind content */}
            <div className="absolute -inset-10 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

            <div className="space-y-6">
              <div className="inline-block px-4 py-1 rounded-full border border-amber-400/20 bg-amber-400/5">
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#FFD700", letterSpacing: "0.2em", fontWeight: 700 }}>
                  EXCLUSIVE PACKAGE PRICE
                </span>
              </div>

              <h3 
                className="font-sans font-black tracking-tight"
                style={{ fontSize: 24, color: "#FFFFFF" }}
              >
                FIRST OFFER
              </h3>

              {/* Price with Premium Scale-up Animation */}
              <div className="py-6 flex flex-col items-center justify-center">
                <span className="text-xs text-amber-400 font-mono tracking-widest mb-2 uppercase">
                  for 10 minute
                </span>
                <div 
                  className={`transition-all duration-700 ease-out transform ${
                    priceRevealed ? "scale-110 opacity-100" : "scale-50 opacity-0"
                  }`}
                >
                  <span 
                    className="font-heading font-black tracking-wide block"
                    style={{
                      fontSize: "72px",
                      background: "linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      textShadow: "0 0 30px rgba(255, 196, 0, 0.4)",
                      lineHeight: 1
                    }}
                  >
                    ₹3000
                  </span>
                </div>
                <span className="text-[10px] text-gray-400 font-mono tracking-widest mt-3 uppercase">
                  COMPLETE FILMMAKING PACKAGE
                </span>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    setShowPriceModal(false);
                    handleGetMoreDetails();
                  }}
                  className="w-full py-3.5 rounded-xl text-xs font-bold tracking-widest uppercase transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
                  style={{
                    background: "rgba(255, 255, 255, 0.08)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    color: "#FFFFFF"
                  }}
                >
                  <span>PROCEED TO BOOKING</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <PageNum n="06" label="OFFERS" />
    </section>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────

const PAGES = [Cover, About, Services, Works, Results, Team, Finale, Contact];

function CinemaCameraWatermark({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  const filmPath = "M 145 110 C 60 110 30 200 40 280 C 50 360 150 380 220 330 C 290 280 290 140 340 100 C 370 76 395 86 395 86";
  
  return (
    <svg viewBox="0 0 400 400" fill="none" className={className} stroke="currentColor" style={style}>
      {/* Film strip / roll ribbon body */}
      <path d={filmPath} fill="none" stroke="currentColor" strokeWidth="18" strokeLinecap="round" opacity="0.03" />
      {/* Clear middle of film strip */}
      <path d={filmPath} fill="none" stroke="#FFFFFF" strokeWidth="14" strokeLinecap="round" />
      {/* Film strip borders */}
      <path d={filmPath} fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.18" />
      
      {/* Sprocket holes (offset parallel to path) */}
      <path d={filmPath} transform="translate(-4, -4)" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="1.5 4.5" opacity="0.25" />
      <path d={filmPath} transform="translate(4, 4)" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="1.5 4.5" opacity="0.25" />
      
      {/* Frame dividers */}
      <path d={filmPath} fill="none" stroke="currentColor" strokeWidth="12" strokeDasharray="0.5 28" opacity="0.2" />

      {/* Film Reels on Top (Canisters) */}
      {/* Connecting Bracket */}
      <path d="M 145 148 L 175 160 L 205 150" strokeWidth="1.5" opacity="0.5" />
      
      {/* Left Reel */}
      <circle cx="145" cy="110" r="38" strokeWidth="1.5" />
      <circle cx="145" cy="110" r="8" strokeWidth="1.2" />
      <line x1="145" y1="72" x2="145" y2="148" strokeWidth="1" opacity="0.3" strokeDasharray="3 3" />
      <line x1="107" y1="110" x2="183" y2="110" strokeWidth="1" opacity="0.3" strokeDasharray="3 3" />
      <line x1="118" y1="83" x2="172" y2="137" strokeWidth="1" opacity="0.3" strokeDasharray="3 3" />
      <line x1="118" y1="137" x2="172" y2="83" strokeWidth="1" opacity="0.3" strokeDasharray="3 3" />
      
      {/* Right Reel */}
      <circle cx="205" cy="118" r="32" strokeWidth="1.5" />
      <circle cx="205" cy="118" r="7" strokeWidth="1.2" />
      <line x1="205" y1="86" x2="205" y2="150" strokeWidth="1" opacity="0.3" strokeDasharray="3 3" />
      <line x1="173" y1="118" x2="237" y2="118" strokeWidth="1" opacity="0.3" strokeDasharray="3 3" />
      <line x1="182" y1="95" x2="228" y2="141" strokeWidth="1" opacity="0.3" strokeDasharray="3 3" />
      <line x1="182" y1="141" x2="228" y2="95" strokeWidth="1" opacity="0.3" strokeDasharray="3 3" />
    </svg>
  );
}

export default function App() {
  const [current, setCurrent] = useState(0);
  const [navOpen, setNavOpen] = useState(false);

  const scrollTo = useCallback((i: number) => {
    document.getElementById(`page-${i}`)?.scrollIntoView({ behavior: "smooth" });
    setCurrent(i);
  }, []);

  const prev = useCallback(() => {
    scrollTo(Math.max(0, current - 1));
  }, [current, scrollTo]);

  const next = useCallback(() => {
    scrollTo(Math.min(PAGES.length - 1, current + 1));
  }, [current, scrollTo]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const m = e.target.id.match(/page-(\d+)/);
            if (m) setCurrent(Number(m[1]));
          }
        });
      },
      { threshold: 0.45 }
    );
    PAGES.forEach((_, i) => {
      const el = document.getElementById(`page-${i}`);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") next();
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev]);

  return (
    <div
      style={{ fontFamily: "var(--font-sans)", background: C.bg, color: C.fore }}
      className="overflow-x-hidden"
    >
      <style>{`
        :root {
          --logo-nav-height: 38px;
        }
        @media (min-width: 768px) {
          :root {
            --logo-nav-height: 48px;
          }
        }
        .logo-intro {
          position: fixed;
          z-index: 100;
          transition: top 1.2s cubic-bezier(0.16, 1, 0.3, 1),
                      left 1.2s cubic-bezier(0.16, 1, 0.3, 1),
                      transform 1.2s cubic-bezier(0.16, 1, 0.3, 1),
                      height 1.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .logo-intro.cursor-pointer:active {
          transform: translate(-50%, -50%) scale(0.95) !important;
        }
        @keyframes pulseOpacity {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .pulse-opacity {
          animation: pulseOpacity 2s ease-in-out infinite;
        }
        .about-logo {
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .about-logo:hover {
          transform: scale(1.05);
        }
        .team-member-card {
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
                      box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1),
                      border-color 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          border: 1px solid rgba(255, 215, 0, 0.2);
          background: #FFFFFF;
        }
        .team-member-card:hover {
          transform: translateY(-8px) scale(1.02);
          border-color: #D9A441 !important;
          box-shadow: 0 20px 40px rgba(217, 164, 65, 0.22), 0 5px 15px rgba(0, 0, 0, 0.05);
        }
        .team-member-card .card-img {
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          object-position: center 20% !important;
        }
        .team-member-card:hover .card-img {
          transform: scale(1.05);
        }
      `}</style>

      <Toaster position="top-center" richColors />

      <Nav
        current={current}
        total={PAGES.length}
        onPrev={prev}
        onNext={next}
        onGoto={scrollTo}
        open={navOpen}
        setOpen={setNavOpen}
      />

      <div>
        {PAGES.map((Page, i) => (
          <div id={`page-${i}`} key={i} className="pt-12">
            <Page />
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40"
        style={{
          height: 2,
          background: `${C.border}`,
        }}
      >
        <div
          className="h-full transition-all duration-500"
          style={{
            width: `${((current + 1) / PAGES.length) * 100}%`,
            background: `linear-gradient(90deg, ${C.orange}, ${C.gold})`,
          }}
        />
      </div>
    </div>
  );
}
