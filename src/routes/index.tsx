import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import heroImg from "@/assets/heilbronn-hero.jpg";
import slide2Img from "@/assets/ig-slide-2.jpg";
import slide3Img from "@/assets/ig-slide-3.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Stimme Radar — Editorial Intelligence for Heilbronner Stimme" },
      {
        name: "description",
        content:
          "Discover what 20–35 year-olds in the Heilbronn region care about right now. Analyze articles, generate Instagram carousels, publish with confidence.",
      },
      { property: "og:title", content: "Stimme Radar — Editorial Intelligence" },
      {
        property: "og:description",
        content:
          "A newsroom tool for Heilbronner Stimme: trend radar, article analyzer, and Instagram carousel generator for young audiences.",
      },
    ],
  }),
  component: Index,
});

// ---------- Trend data ----------
const trendingTopics = [
  { name: "Wohnraummangel in Heilbronn", delta: "+142%", vol: 4287, spark: [2, 3, 5, 4, 6, 7, 9], hot: true },
  { name: "Nightlife & Club-Szene", delta: "+88%", vol: 2914, spark: [4, 2, 3, 5, 4, 6, 7] },
  { name: "Micro-Housing & WG-Modelle", delta: "+64%", vol: 1822, spark: [2, 3, 2, 3, 5, 4, 6] },
  { name: "Startup Campus HN", delta: "+47%", vol: 1304, spark: [1, 2, 3, 4, 3, 4, 5] },
  { name: "Mental Health & Therapie", delta: "+38%", vol: 988, spark: [3, 4, 3, 4, 5, 4, 5] },
];

const heatmap = [
  { label: "Housing", value: 96 },
  { label: "Mobility", value: 82 },
  { label: "Events", value: 41 },
  { label: "Jobs", value: 58 },
  { label: "Climate", value: 88 },
  { label: "Music", value: 64 },
  { label: "Education", value: 71 },
  { label: "Food", value: 35 },
  { label: "AI Local", value: 52 },
  { label: "Politics", value: 28 },
  { label: "Sport", value: 44 },
  { label: "Travel", value: 22 },
];

const weekBars = [42, 56, 38, 72, 64, 88, 76];

function Index() {
  return (
    <div className="min-h-screen">
      <Nav />
      <main className="max-w-6xl mx-auto px-6 md:px-10 py-16 space-y-32">
        <RadarSection />
        <AnalyzerSection />
        <CreatorSection />
      </main>
      <Footer />
    </div>
  );
}

// ---------- Nav ----------
function Nav() {
  return (
    <nav className="sticky top-0 z-50 bg-canvas/80 backdrop-blur-xl border-b border-ink/5">
      <div className="max-w-6xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-8 bg-brand rounded-md flex items-center justify-center text-brand-foreground font-black text-lg">
            S
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-semibold tracking-tight text-[15px]">Stimme Radar</span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Heilbronner Stimme · Editorial
            </span>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#radar" className="hover:text-ink transition-colors">Radar</a>
          <a href="#analyzer" className="hover:text-ink transition-colors">Analyzer</a>
          <a href="#creator" className="hover:text-ink transition-colors">Creator</a>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <span className="size-2 rounded-full bg-success" style={{ animation: "pulse-dot 2s ease-in-out infinite" }} />
          Live · 14:42 MEZ
        </div>
      </div>
    </nav>
  );
}

// ---------- Step 1 ----------
function RadarSection() {
  return (
    <section id="radar" className="space-y-10 scroll-mt-24">
      <SectionHeader step="01" eyebrow="Discovery" title="Was die 20–35 Jährigen gerade bewegt." />

      <div className="grid grid-cols-12 gap-6">
        {/* Trending list */}
        <div className="col-span-12 lg:col-span-4 bg-card ring-1 ring-ink/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              Trending Topics · 24h
            </h3>
            <span className="text-[10px] font-semibold text-brand">5 hot</span>
          </div>
          <ul className="space-y-1">
            {trendingTopics.map((t, i) => (
              <li
                key={t.name}
                className="group flex items-center justify-between py-3 border-b last:border-b-0 border-ink/5"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-[10px] font-mono text-muted-foreground w-4 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{t.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {t.delta} · vol. {Math.floor(800 + Math.random() * 4000)}
                    </p>
                  </div>
                </div>
                <Sparkline values={t.spark} hot={t.hot} />
              </li>
            ))}
          </ul>
        </div>

        {/* Weekly volume chart */}
        <div className="col-span-12 lg:col-span-8 bg-card ring-1 ring-ink/5 rounded-2xl p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                Wochen-Momentum · Erwähnungen Zielgruppe
              </h3>
              <p className="text-2xl font-semibold mt-2 tracking-tight">
                12 482 <span className="text-success text-sm font-medium ml-2">↗ +24.6%</span>
              </p>
            </div>
            <div className="flex gap-2 text-[10px]">
              <button className="px-3 py-1.5 rounded-md bg-ink text-canvas font-semibold">7T</button>
              <button className="px-3 py-1.5 rounded-md text-muted-foreground">30T</button>
              <button className="px-3 py-1.5 rounded-md text-muted-foreground">90T</button>
            </div>
          </div>

          <div className="relative h-56">
            <div className="absolute inset-0 flex flex-col justify-between text-[10px] text-muted-foreground/60">
              <div className="border-b border-dashed border-ink/5">100</div>
              <div className="border-b border-dashed border-ink/5">75</div>
              <div className="border-b border-dashed border-ink/5">50</div>
              <div className="border-b border-dashed border-ink/5">25</div>
              <div>0</div>
            </div>
            <div className="absolute inset-0 flex items-end gap-3 pt-2 pb-6">
              {weekBars.map((v, i) => (
                <div key={i} className="flex-1 h-full flex flex-col justify-end items-center gap-2 group relative">
                  <div
                    className="w-full bg-gradient-to-t from-brand to-brand/60 rounded-t-md animate-rise-bar relative"
                    style={{ height: `${v}%`, animationDelay: `${i * 80}ms` }}
                  >
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] bg-ink text-canvas px-1.5 py-0.5 rounded">
                      {v}k
                    </div>
                  </div>
                  <span className="absolute bottom-0 text-[10px] font-medium text-muted-foreground">
                    {["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Demographics donut */}
        <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-card ring-1 ring-ink/5 rounded-2xl p-6">
          <h3 className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-4">
            Audience Split
          </h3>
          <div className="flex items-center gap-6">
            <Donut />
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <span className="size-2.5 rounded-sm bg-brand" />
                <span className="font-semibold">Gen Z (20–27)</span>
                <span className="text-muted-foreground ml-auto">58%</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="size-2.5 rounded-sm bg-ink" />
                <span className="font-semibold">Millennial (28–35)</span>
                <span className="text-muted-foreground ml-auto">34%</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="size-2.5 rounded-sm bg-ink/20" />
                <span className="font-semibold">Other</span>
                <span className="text-muted-foreground ml-auto">8%</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Heatmap */}
        <div className="col-span-12 md:col-span-6 lg:col-span-5 bg-card ring-1 ring-ink/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              Keyword Heatmap · Gen-Z Interest
            </h3>
            <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1"><span className="size-2 rounded-sm bg-brand/15" />low</span>
              <span className="flex items-center gap-1"><span className="size-2 rounded-sm bg-brand" />high</span>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {heatmap.map((h) => (
              <div
                key={h.label}
                className="aspect-square rounded-md flex flex-col items-start justify-end p-2 transition-transform hover:scale-105"
                style={{
                  backgroundColor: `oklch(0.58 0.22 27 / ${0.08 + (h.value / 100) * 0.92})`,
                }}
              >
                <span className={`text-[10px] font-bold uppercase ${h.value > 55 ? "text-canvas" : "text-ink"}`}>
                  {h.label}
                </span>
                <span className={`text-[9px] font-mono ${h.value > 55 ? "text-canvas/70" : "text-ink/50"}`}>
                  {h.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Source breakdown */}
        <div className="col-span-12 lg:col-span-3 bg-ink text-canvas rounded-2xl p-6 flex flex-col justify-between">
          <h3 className="text-[10px] font-semibold uppercase tracking-[0.15em] text-canvas/50">
            Top Source
          </h3>
          <div>
            <p className="text-3xl font-semibold tracking-tight mt-2">72%</p>
            <p className="text-sm text-canvas/70 mt-1">aus lokalen Social Communities</p>
          </div>
          <div className="space-y-2 text-[11px]">
            <SourceBar label="Reddit r/heilbronn" pct={72} />
            <SourceBar label="TikTok #hn" pct={54} />
            <SourceBar label="Instagram" pct={41} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Sparkline({ values, hot }: { values: number[]; hot?: boolean }) {
  const max = Math.max(...values);
  return (
    <div className="flex items-end gap-0.5 h-6">
      {values.map((v, i) => (
        <div
          key={i}
          className={`w-1 rounded-sm ${hot ? "bg-brand" : "bg-ink/40"}`}
          style={{ height: `${(v / max) * 100}%`, opacity: 0.3 + (i / values.length) * 0.7 }}
        />
      ))}
    </div>
  );
}

function Donut() {
  // 58 / 34 / 8 — circumference-based dasharray
  const c = 2 * Math.PI * 36;
  const seg1 = (58 / 100) * c;
  const seg2 = (34 / 100) * c;
  const seg3 = (8 / 100) * c;
  return (
    <div className="relative size-28 shrink-0">
      <svg viewBox="0 0 100 100" className="size-full -rotate-90">
        <circle cx="50" cy="50" r="36" fill="none" stroke="oklch(0.92 0.004 240)" strokeWidth="14" />
        <circle
          cx="50" cy="50" r="36" fill="none"
          stroke="oklch(0.58 0.22 27)" strokeWidth="14"
          strokeDasharray={`${seg1} ${c - seg1}`} strokeDashoffset={0}
        />
        <circle
          cx="50" cy="50" r="36" fill="none"
          stroke="oklch(0.18 0.01 240)" strokeWidth="14"
          strokeDasharray={`${seg2} ${c - seg2}`} strokeDashoffset={-seg1}
        />
        <circle
          cx="50" cy="50" r="36" fill="none"
          stroke="oklch(0.18 0.01 240 / 0.2)" strokeWidth="14"
          strokeDasharray={`${seg3} ${c - seg3}`} strokeDashoffset={-(seg1 + seg2)}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-semibold tracking-tight">92%</span>
        <span className="text-[9px] uppercase tracking-wider text-muted-foreground">Youth</span>
      </div>
    </div>
  );
}

function SourceBar({ label, pct }: { label: string; pct: number }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-canvas/70">
        <span>{label}</span>
        <span className="font-mono">{pct}%</span>
      </div>
      <div className="h-1 bg-canvas/10 rounded-full overflow-hidden">
        <div className="h-full bg-brand animate-draw-bar" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// ---------- Step 2 ----------
const DEFAULT_ARTICLE = `Heilbronn plant eine neue Initiative zur Umgestaltung der Innenstadt. Die Fußgängerzone soll durch mehr Grünflächen und moderne Sitzgelegenheiten attraktiver werden. Der Gemeinderat diskutiert derzeit über die Finanzierung des Projekts, das bis 2026 abgeschlossen sein soll. Vor allem jüngere Bürger fordern mehr Platz für Begegnungen und kulturelle Angebote rund um den Kiliansplatz.

Eine Umfrage unter 500 Studierenden der TU Heilbronn ergab, dass 78% sich mehr nachhaltige Verkehrslösungen wünschen — vom Ausbau der Stadtbahn bis zu E-Bike-Stationen.`;

function AnalyzerSection() {
  const [article, setArticle] = useState(DEFAULT_ARTICLE);
  const [analyzed, setAnalyzed] = useState(true);

  return (
    <section id="analyzer" className="space-y-10 scroll-mt-24">
      <SectionHeader step="02" eyebrow="Validation" title="Wie gut trifft euer Artikel die Zielgruppe?" />

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              Artikel-Entwurf
            </label>
            <span className="text-[10px] font-mono text-muted-foreground">
              {article.split(/\s+/).filter(Boolean).length} Wörter
            </span>
          </div>
          <div className="relative">
            <textarea
              value={article}
              onChange={(e) => {
                setArticle(e.target.value);
                setAnalyzed(false);
              }}
              className="w-full h-[420px] p-6 bg-card ring-1 ring-ink/5 rounded-2xl text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand/30 transition-shadow resize-none font-medium"
              placeholder="Artikeltext einfügen…"
            />
            <div className="absolute bottom-4 right-4 flex gap-2">
              <button
                onClick={() => setAnalyzed(true)}
                className="bg-ink text-canvas text-sm font-semibold py-2.5 px-4 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <span className="size-1.5 rounded-full bg-brand" />
                Deep-Analyse starten
              </button>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-5">
          <div className="bg-ink text-canvas rounded-2xl p-7 space-y-7 sticky top-24">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-canvas/40">
                Resonance Score
              </span>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${analyzed ? "bg-brand/20 text-brand" : "bg-canvas/10 text-canvas/50"}`}>
                {analyzed ? "Optimiert" : "Pending"}
              </span>
            </div>

            <div className="flex flex-col items-center">
              <ScoreRing value={analyzed ? 82 : 0} />
              <p className="mt-4 text-xs text-canvas/60">Gesamt-Relevanz für 20–35</p>
            </div>

            <div className="space-y-4">
              <ScoreBar label="Youth Appeal" value={92} />
              <ScoreBar label="Topic Match" value={88} />
              <ScoreBar label="Tonalität" value={71} muted />
              <ScoreBar label="Freshness" value={64} muted />
            </div>

            <div className="p-4 rounded-xl bg-canvas/5 border border-canvas/10 space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-brand">KI-Tipp</p>
              <p className="text-xs leading-relaxed text-canvas/80">
                Erwähne konkrete Orte wie „Kiliansplatz" oder „TU Heilbronn" früher im Text — erhöht lokale
                Resonanz um <span className="text-canvas font-semibold">+18%</span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ScoreRing({ value }: { value: number }) {
  const c = 2 * Math.PI * 42;
  const offset = c - (value / 100) * c;
  return (
    <div className="relative size-36">
      <svg viewBox="0 0 100 100" className="size-full -rotate-90">
        <circle cx="50" cy="50" r="42" fill="none" stroke="oklch(1 0 0 / 0.08)" strokeWidth="6" />
        <circle
          cx="50" cy="50" r="42" fill="none"
          stroke="oklch(0.58 0.22 27)" strokeWidth="6"
          strokeDasharray={c} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.19, 1, 0.22, 1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-semibold tracking-tighter animate-count-up">{value}</span>
        <span className="text-[10px] uppercase tracking-widest text-canvas/40">/ 100</span>
      </div>
    </div>
  );
}

function ScoreBar({ label, value, muted }: { label: string; value: number; muted?: boolean }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-[10px] font-semibold uppercase tracking-wider">
        <span className="text-canvas/70">{label}</span>
        <span className={muted ? "text-canvas/80" : "text-brand"}>{value}%</span>
      </div>
      <div className="h-1 bg-canvas/10 rounded-full overflow-hidden">
        <div
          className={`h-full animate-draw-bar ${muted ? "bg-canvas/40" : "bg-brand"}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

// ---------- Step 3 ----------
const slides = [
  {
    img: heroImg,
    eyebrow: "Stimme Exklusiv",
    headline: "STADT\nUPGRADE\n2026",
    sub: "Wie Heilbronns Mitte zum neuen Hub für uns wird.",
    tint: "from-black/10 via-black/30 to-black/80",
  },
  {
    img: slide2Img,
    eyebrow: "Daten · Survey",
    headline: "78%\nWOLLEN\nMEHR",
    sub: "Studierende der TU Heilbronn fordern nachhaltige Mobilität.",
    tint: "from-black/20 via-black/40 to-black/90",
  },
  {
    img: slide3Img,
    eyebrow: "Reportage",
    headline: "WG-\nKRISE.\nLIVE.",
    sub: "Junge Heilbronner:innen suchen seit Monaten Wohnraum.",
    tint: "from-black/10 via-black/30 to-black/80",
  },
];

function CreatorSection() {
  const [active, setActive] = useState(0);

  return (
    <section id="creator" className="space-y-10 scroll-mt-24">
      <SectionHeader step="03" eyebrow="Activation" title="Druckfertig für Instagram. Mit einem Klick." />

      <div className="grid grid-cols-12 gap-10 lg:gap-16 items-start">
        {/* Phone */}
        <div className="col-span-12 lg:col-span-5 flex justify-center">
          <PhoneMock active={active} setActive={setActive} />
        </div>

        {/* Controls */}
        <div className="col-span-12 lg:col-span-7 space-y-8">
          {/* Caption editor */}
          <div className="bg-card ring-1 ring-ink/5 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                Caption · DE
              </h3>
              <span className="text-[10px] font-mono text-muted-foreground">186 / 2200</span>
            </div>
            <p className="text-sm leading-relaxed">
              Neue Pläne für unser Zentrum 🌳 Mehr Grün, weniger Beton — und ihr habt ein Wort mitzureden.
              Swipe für die Details, die wirklich zählen.
            </p>
            <div className="flex flex-wrap gap-1.5 mt-4">
              {["#Heilbronn", "#HNX", "#Stadtentwicklung", "#GenZ", "#StimmeRadar"].map((h) => (
                <span key={h} className="text-[11px] px-2 py-1 rounded-md bg-brand/10 text-brand font-semibold">
                  {h}
                </span>
              ))}
            </div>
          </div>

          {/* Slide picker */}
          <div className="bg-card ring-1 ring-ink/5 rounded-2xl p-6">
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-4">
              Slides · {slides.length}
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {slides.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`aspect-square rounded-lg overflow-hidden relative ring-2 transition-all ${
                    active === i ? "ring-brand scale-[1.02]" : "ring-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={s.img} alt={`Slide ${i + 1}`} className="size-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <span className="absolute bottom-1.5 left-2 text-[10px] font-bold text-white">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Approval row */}
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-brand/5 border border-brand/10 flex items-center gap-3">
              <div className="size-9 rounded-full bg-brand/15 flex items-center justify-center text-brand">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="size-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">Bereit zur Veröffentlichung</p>
                <p className="text-[11px] text-muted-foreground">
                  Markenrichtlinien geprüft · Alt-Texte vorhanden · IG-Format korrekt
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="flex-1 bg-ink text-canvas py-3.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity">
                Entwurf speichern
              </button>
              <button className="flex-[2] bg-brand text-brand-foreground py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand/25 hover:scale-[1.01] transition-transform">
                Freigeben & auf Instagram posten
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="size-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PhoneMock({ active, setActive }: { active: number; setActive: (i: number) => void }) {
  const slide = slides[active];
  return (
    <div className="w-[340px] shrink-0">
      <div className="relative aspect-[9/19.5] bg-[#0a0a0a] rounded-[48px] p-[10px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.4)]">
        {/* Outer rim shine */}
        <div className="absolute inset-0 rounded-[48px] ring-1 ring-white/10 pointer-events-none" />
        {/* Screen */}
        <div className="relative h-full w-full bg-white rounded-[40px] overflow-hidden flex flex-col">
          {/* Dynamic island */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-30" />
          {/* Status bar */}
          <div className="h-12 flex justify-between items-center px-7 pt-2 text-[11px] font-semibold text-black z-20 relative">
            <span>9:41</span>
            <div className="flex items-center gap-1.5">
              <SignalIcon />
              <WifiIcon />
              <BatteryIcon />
            </div>
          </div>

          {/* IG header */}
          <header className="h-12 flex items-center px-3.5 border-b border-black/5">
            <svg viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.2" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <div className="flex-1 flex flex-col items-start ml-2 leading-tight">
              <span className="text-[10px] text-black/50 font-medium">Beitrag</span>
              <span className="text-[14px] font-semibold text-black">Heilbronner Stimme</span>
            </div>
          </header>

          {/* Post header */}
          <div className="flex items-center gap-2.5 px-3.5 py-2.5">
            <div className="size-9 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600">
              <div className="size-full rounded-full bg-white p-[2px]">
                <div className="size-full rounded-full bg-brand flex items-center justify-center text-white text-[11px] font-black">
                  S
                </div>
              </div>
            </div>
            <div className="flex-1 leading-tight">
              <div className="flex items-center gap-1">
                <span className="text-[13px] font-semibold text-black">heilbronner_stimme</span>
                <svg viewBox="0 0 24 24" className="size-3.5" fill="#3897f0">
                  <path d="M12 2l2.4 2.4 3.4-.4 1 3.2 3.2 1-.4 3.4L24 14l-2.4 2.4.4 3.4-3.2 1-1 3.2-3.4-.4L12 26l-2.4-2.4-3.4.4-1-3.2-3.2-1 .4-3.4L0 14l2.4-2.4-.4-3.4 3.2-1 1-3.2 3.4.4L12 2zm-1.5 14.5l7-7-1.4-1.4-5.6 5.6-2.6-2.6L6.5 12.5l4 4z" />
                </svg>
              </div>
              <span className="text-[11px] text-black/60">Heilbronn, Deutschland</span>
            </div>
            <span className="text-lg leading-none text-black font-bold tracking-tighter">···</span>
          </div>

          {/* Carousel image */}
          <div className="relative aspect-square w-full bg-black overflow-hidden">
            <img
              src={slide.img}
              alt={slide.eyebrow}
              className="absolute inset-0 size-full object-cover"
              loading="lazy"
            />
            <div className={`absolute inset-0 bg-gradient-to-b ${slide.tint}`} />

            {/* Slide content */}
            <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] bg-brand px-2 py-1 rounded-sm">
                  {slide.eyebrow}
                </span>
                <span className="text-[10px] font-mono text-white/80">
                  {String(active + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
                </span>
              </div>
              <div>
                <h4 className="text-[44px] font-black leading-[0.88] tracking-[-0.04em] uppercase whitespace-pre-line">
                  {slide.headline}
                </h4>
                <div className="flex items-start gap-3 mt-5">
                  <div className="w-1 self-stretch bg-brand mt-1" />
                  <p className="text-[12px] font-medium leading-snug max-w-[24ch] text-white/95">
                    {slide.sub}
                  </p>
                </div>
              </div>
            </div>

            {/* Slide dots overlay (carousel indicator at top) */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 flex gap-1">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`h-1 rounded-full transition-all ${
                    active === i ? "w-6 bg-white" : "w-1 bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Action row */}
          <div className="px-3.5 pt-3 pb-2 flex items-center justify-between">
            <div className="flex gap-3.5 text-black">
              <HeartIcon />
              <CommentIcon />
              <ShareIcon />
            </div>
            <div className="flex gap-1 items-center">
              {slides.map((_, i) => (
                <div
                  key={i}
                  className={`rounded-full transition-all ${
                    active === i ? "size-1.5 bg-brand" : "size-1 bg-black/20"
                  }`}
                />
              ))}
            </div>
            <BookmarkIcon />
          </div>

          {/* Likes + caption */}
          <div className="px-3.5 space-y-1 pb-3">
            <p className="text-[12px] font-semibold text-black">2 481 „Gefällt mir"-Angaben</p>
            <p className="text-[12px] leading-snug text-black">
              <span className="font-semibold">heilbronner_stimme</span> Neue Pläne für unser Zentrum 🌳 Mehr Grün,
              weniger Beton — und ihr habt ein… <span className="text-black/50">mehr</span>
            </p>
            <p className="text-[11px] text-black/40">Alle 142 Kommentare ansehen</p>
            <p className="text-[10px] text-black/40 uppercase tracking-wider pt-1">Vor 2 Stunden</p>
          </div>

          {/* Bottom tab bar */}
          <div className="mt-auto border-t border-black/5 h-12 grid grid-cols-5 items-center px-2">
            <TabIcon kind="home" />
            <TabIcon kind="search" />
            <TabIcon kind="plus" />
            <TabIcon kind="reels" />
            <div className="flex justify-center">
              <div className="size-6 rounded-full bg-brand" />
            </div>
          </div>
          {/* Home indicator */}
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-28 h-1 bg-black rounded-full" />
        </div>
      </div>
    </div>
  );
}

// ---------- IG / phone icons ----------
function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-7">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  );
}
function CommentIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-7">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
    </svg>
  );
}
function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-7">
      <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  );
}
function BookmarkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1.8" className="size-7">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
    </svg>
  );
}
function SignalIcon() {
  return (
    <svg viewBox="0 0 18 12" className="h-2.5 w-auto" fill="black">
      <rect x="0" y="8" width="3" height="4" rx="0.5" />
      <rect x="5" y="5" width="3" height="7" rx="0.5" />
      <rect x="10" y="2" width="3" height="10" rx="0.5" />
      <rect x="15" y="0" width="3" height="12" rx="0.5" />
    </svg>
  );
}
function WifiIcon() {
  return (
    <svg viewBox="0 0 16 12" className="h-2.5 w-auto" fill="black">
      <path d="M8 11.5a1 1 0 100-2 1 1 0 000 2zM4.2 7.7a5.4 5.4 0 017.6 0l1.4-1.4a7.4 7.4 0 00-10.4 0l1.4 1.4zM1.4 4.9a9.4 9.4 0 0113.2 0L16 3.5a11.4 11.4 0 00-16 0l1.4 1.4z" />
    </svg>
  );
}
function BatteryIcon() {
  return (
    <div className="flex items-center">
      <div className="w-6 h-3 rounded-[3px] border border-black/80 p-[1.5px]">
        <div className="h-full w-full bg-black rounded-[1.5px]" />
      </div>
      <div className="w-[1.5px] h-1.5 bg-black/80 rounded-r-sm" />
    </div>
  );
}
function TabIcon({ kind }: { kind: "home" | "search" | "plus" | "reels" }) {
  const paths: Record<string, string> = {
    home: "M3 11l9-8 9 8v9a2 2 0 01-2 2h-4v-6h-6v6H5a2 2 0 01-2-2v-9z",
    search: "M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z",
    plus: "M12 5v14M5 12h14",
    reels: "M3 5h18v14H3z M3 5l18 14 M21 5L3 19",
  };
  return (
    <div className="flex justify-center">
      <svg viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1.8" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d={paths[kind]} />
      </svg>
    </div>
  );
}

// ---------- Shared ----------
function SectionHeader({ step, eyebrow, title }: { step: string; eyebrow: string; title: string }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs text-brand font-bold">{step}</span>
        <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-muted-foreground">
          / {eyebrow}
        </span>
        <div className="h-px flex-1 bg-ink/10" />
      </div>
      <h2 className="text-3xl md:text-[40px] font-semibold tracking-tight leading-[1.05] text-balance max-w-[24ch]">
        {title}
      </h2>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-ink/5 mt-24">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="size-7 bg-brand rounded-md flex items-center justify-center text-brand-foreground font-black text-sm">
            S
          </div>
          <p className="text-xs text-muted-foreground">
            © 2026 Heilbronner Stimme GmbH · Stimme Radar v2.4 · Editorial Prototype
          </p>
        </div>
        <div className="flex gap-6 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          <a href="#radar">Radar</a>
          <a href="#analyzer">Analyzer</a>
          <a href="#creator">Creator</a>
        </div>
      </div>
    </footer>
  );
}
