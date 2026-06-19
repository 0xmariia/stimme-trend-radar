import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type MouseEvent } from "react";
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
// Static "cache" — realistic topics for 20–35 in the Heilbronn region.
// `readers` = unique readers reached per weekday (this week); `prev` = same, last week.
const DAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

const TOPICS = [
  {
    name: "Wohnraummangel & Studi-WGs",
    category: "Wohnen",
    heat: "Housing", // maps to the keyword-heatmap tile
    hot: true,
    note: "WG-Zimmer ~505 €, BAföG nur 380 € — Heilbronns Studierende unter Druck.",
    readers: [3200, 4100, 3800, 6200, 7400, 9100, 8600],
    prev: [1800, 2100, 2400, 2600, 3100, 3600, 3400],
    audience: { genZ: 64, millennial: 30, other: 6 },
    sources: [
      { label: "Reddit r/heilbronn", pct: 72 },
      { label: "TikTok #hn", pct: 54 },
      { label: "Instagram", pct: 41 },
    ],
  },
  {
    name: "KI-Festival 2026 @ IPAI",
    category: "Event",
    heat: "Events",
    hot: true,
    note: "25.–26. Juli · „READY?!\" — 15.000+ Besucher:innen, Zukunftspark Wohlgelegen.",
    readers: [2100, 2600, 3400, 4200, 5600, 8800, 7300],
    prev: [900, 1100, 1500, 1800, 2200, 3100, 2800],
    audience: { genZ: 48, millennial: 40, other: 12 },
    sources: [
      { label: "Instagram", pct: 68 },
      { label: "TikTok #hn", pct: 61 },
      { label: "LinkedIn", pct: 47 },
    ],
  },
  {
    name: "Nightlife & Club-Szene",
    category: "Kultur",
    heat: "Music",
    note: "Wo geht am Wochenende was? Clubs, Open-Airs & Pop-up-Partys.",
    readers: [1200, 1100, 1400, 2600, 5200, 7800, 3100],
    prev: [800, 700, 900, 1500, 3000, 4200, 1900],
    audience: { genZ: 70, millennial: 24, other: 6 },
    sources: [
      { label: "Instagram", pct: 79 },
      { label: "TikTok #hn", pct: 66 },
      { label: "Reddit r/heilbronn", pct: 22 },
    ],
  },
  {
    name: "Stadtbahn & Nahverkehr",
    category: "Mobilität",
    heat: "Mobility",
    note: "78 % der Studierenden wollen besseren ÖPNV — Stadtbahn-Ausbau & E-Bikes.",
    readers: [3100, 3300, 2900, 3000, 3400, 2100, 1800],
    prev: [2200, 2300, 2100, 2200, 2400, 1500, 1300],
    audience: { genZ: 42, millennial: 41, other: 17 },
    sources: [
      { label: "Reddit r/heilbronn", pct: 58 },
      { label: "Facebook-Gruppen", pct: 49 },
      { label: "Instagram", pct: 33 },
    ],
  },
  {
    name: "Mental Health & Therapieplätze",
    category: "Gesundheit",
    heat: "Health",
    note: "Lange Wartezeiten auf Therapieplätze — großes Thema bei den 20–27-Jährigen.",
    readers: [1600, 1700, 1800, 1750, 1900, 1500, 2100],
    prev: [1100, 1150, 1200, 1150, 1250, 1000, 1400],
    audience: { genZ: 66, millennial: 28, other: 6 },
    sources: [
      { label: "TikTok #hn", pct: 64 },
      { label: "Reddit r/heilbronn", pct: 51 },
      { label: "Instagram", pct: 38 },
    ],
  },
  {
    name: "KI-Jobs & Startup Campus",
    category: "Karriere",
    heat: "Jobs",
    note: "Bildungscampus & IPAI ziehen junge Talente — Jobs, Gründungen, Praktika.",
    readers: [1400, 1500, 1300, 1600, 1450, 800, 700],
    prev: [1000, 1050, 950, 1100, 1000, 600, 550],
    audience: { genZ: 38, millennial: 50, other: 12 },
    sources: [
      { label: "LinkedIn", pct: 70 },
      { label: "Reddit r/heilbronn", pct: 48 },
      { label: "Instagram", pct: 31 },
    ],
  },
];

// Single source of truth for growth: week-over-week reader change, derived
// straight from each topic's `readers` vs `prev` arrays (no separate numbers).
const sum = (a: number[]) => a.reduce((x, y) => x + y, 0);
const wowPct = (t: { readers: number[]; prev: number[] }) =>
  Math.round(((sum(t.readers) - sum(t.prev)) / sum(t.prev)) * 100);

// Ordered + valued to match the trending topics: the themes that are trending
// (Housing, Events/KI, Music/Nightlife, Mobility, Health, Jobs) read "hot".
const heatmap = [
  { label: "Housing", value: 96 },
  { label: "AI Local", value: 91 },
  { label: "Events", value: 88 },
  { label: "Music", value: 79 },
  { label: "Mobility", value: 74 },
  { label: "Health", value: 68 },
  { label: "Jobs", value: 61 },
  { label: "Education", value: 57 },
  { label: "Climate", value: 52 },
  { label: "Food", value: 34 },
  { label: "Sport", value: 30 },
  { label: "Politics", value: 28 },
];

const STEPS = [
  { id: "radar", label: "Radar", eyebrow: "Discovery", Section: RadarSection },
  { id: "analyzer", label: "Analyzer", eyebrow: "Validation", Section: AnalyzerSection },
  { id: "creator", label: "Creator", eyebrow: "Activation", Section: CreatorSection },
];

function Index() {
  const [step, setStep] = useState(0);
  const ActiveSection = STEPS[step].Section;

  const go = (i: number) => setStep(Math.max(0, Math.min(STEPS.length - 1, i)));

  // Arrow-key / presentation-clicker navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "TEXTAREA" || tag === "INPUT") return; // don't hijack typing
      if (e.key === "ArrowRight" || e.key === "PageDown") go(step + 1);
      if (e.key === "ArrowLeft" || e.key === "PageUp") go(step - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step]);

  return (
    <div className="min-h-screen flex flex-col">
      <Nav step={step} onStep={go} />
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 md:px-10 py-16">
        <ActiveSection key={STEPS[step].id} />
      </main>
      <StepControls step={step} onStep={go} />
      <Footer step={step} onStep={go} />
    </div>
  );
}

// ---------- Step navigation controls ----------
function StepControls({ step, onStep }: { step: number; onStep: (i: number) => void }) {
  const isFirst = step === 0;
  const isLast = step === STEPS.length - 1;
  return (
    <div className="sticky bottom-0 z-40 bg-canvas/80 backdrop-blur-xl border-t border-ink/5">
      <div className="max-w-6xl mx-auto px-6 md:px-10 h-20 flex items-center justify-between gap-4">
        <button
          onClick={() => onStep(step - 1)}
          disabled={isFirst}
          className="flex items-center gap-2 text-sm font-semibold py-2.5 px-4 rounded-lg ring-1 ring-ink/10 hover:bg-ink/5 transition-colors disabled:opacity-30 disabled:pointer-events-none"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="size-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Zurück
        </button>

        {/* Progress dots */}
        <div className="flex items-center gap-3">
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => onStep(i)}
              className="group flex items-center gap-2"
              aria-label={`Schritt ${i + 1}: ${s.label}`}
            >
              <span
                className={`text-[10px] font-mono font-bold transition-colors ${
                  i === step ? "text-brand" : "text-muted-foreground/50 group-hover:text-muted-foreground"
                }`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                className={`h-1 rounded-full transition-all ${
                  i === step ? "w-10 bg-brand" : "w-4 bg-ink/15 group-hover:bg-ink/30"
                }`}
              />
            </button>
          ))}
        </div>

        {isLast ? (
          <button
            onClick={() => onStep(0)}
            className="flex items-center gap-2 text-sm font-semibold py-2.5 px-4 rounded-lg ring-1 ring-ink/10 hover:bg-ink/5 transition-colors"
          >
            Von vorn
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="size-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v6h6M20 20v-6h-6M20 9A8 8 0 006 5.3M4 15a8 8 0 0014 3.7" />
            </svg>
          </button>
        ) : (
          <button
            onClick={() => onStep(step + 1)}
            className="flex items-center gap-2 bg-ink text-canvas text-sm font-semibold py-2.5 px-4 rounded-lg hover:opacity-90 transition-opacity"
          >
            Weiter
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="size-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

// ---------- Nav ----------
function Nav({ step, onStep }: { step: number; onStep: (i: number) => void }) {
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
        <div className="hidden md:flex items-center gap-8 text-sm">
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => onStep(i)}
              className={`transition-colors ${i === step ? "text-ink font-semibold" : "text-muted-foreground hover:text-ink"}`}
            >
              {s.label}
            </button>
          ))}
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
  const [selected, setSelected] = useState(0);
  const topic = TOPICS[selected];

  return (
    <section id="radar" className="space-y-10 scroll-mt-24">
      <SectionHeader step="01" eyebrow="Discovery" title="Was die 20–35 Jährigen gerade bewegt." />

      <div className="grid grid-cols-12 gap-6">
        {/* Trending list — click a topic to explore it */}
        <div className="col-span-12 lg:col-span-4 bg-card ring-1 ring-ink/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              Trending Topics · 7 Tage
            </h3>
            <span className="text-[10px] font-semibold text-brand">{TOPICS.filter((t) => t.hot).length} hot</span>
          </div>
          <p className="text-[11px] text-muted-foreground mb-2">
            Thema wählen → Reichweite rechts ansehen
          </p>
          <ul className="space-y-1">
            {TOPICS.map((t, i) => {
              const active = i === selected;
              return (
                <li key={t.name}>
                  <button
                    onClick={() => setSelected(i)}
                    className={`group w-full flex items-center justify-between gap-3 rounded-xl px-3 py-3 text-left transition-colors ${
                      active ? "bg-brand/5 ring-1 ring-brand/20" : "hover:bg-ink/[0.03]"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`text-[10px] font-mono w-4 shrink-0 ${active ? "text-brand font-bold" : "text-muted-foreground"}`}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium truncate">{t.name}</p>
                          {t.hot && (
                            <span className="text-[9px] font-bold uppercase tracking-wider text-brand shrink-0">
                              hot
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          <span className="text-success font-semibold">+{wowPct(t)}%</span> ·{" "}
                          {sum(t.readers).toLocaleString("de-DE")} Leser/Wo.
                        </p>
                      </div>
                    </div>
                    <Sparkline values={t.readers} hot={active || t.hot} />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Interactive trend chart for the selected topic */}
        <div className="col-span-12 lg:col-span-8 bg-card ring-1 ring-ink/5 rounded-2xl p-6">
          <TopicTrendChart topic={topic} />
        </div>

        {/* Who reads this topic — reacts to selection */}
        <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-card ring-1 ring-ink/5 rounded-2xl p-6">
          <h3 className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-1">
            Wer liest das?
          </h3>
          <p className="text-[11px] text-muted-foreground mb-4 truncate">{topic.name}</p>
          <div className="flex items-center gap-6">
            <Donut audience={topic.audience} />
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <span className="size-2.5 rounded-sm bg-brand" />
                <span className="font-semibold">Gen Z (20–27)</span>
                <span className="text-muted-foreground ml-auto">{topic.audience.genZ}%</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="size-2.5 rounded-sm bg-ink" />
                <span className="font-semibold">Millennial (28–35)</span>
                <span className="text-muted-foreground ml-auto">{topic.audience.millennial}%</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="size-2.5 rounded-sm bg-ink/20" />
                <span className="font-semibold">Andere</span>
                <span className="text-muted-foreground ml-auto">{topic.audience.other}%</span>
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
            {heatmap.map((h) => {
              const isActive = h.label === topic.heat;
              return (
                <div
                  key={h.label}
                  className={`aspect-square rounded-md flex flex-col items-start justify-end p-2 transition-transform hover:scale-105 ${
                    isActive ? "ring-2 ring-ink scale-105" : ""
                  }`}
                  style={{
                    backgroundColor: `oklch(0.58 0.22 255 / ${0.08 + (h.value / 100) * 0.92})`,
                  }}
                >
                  <span className={`text-[10px] font-bold uppercase ${h.value > 55 ? "text-canvas" : "text-ink"}`}>
                    {h.label}
                  </span>
                  <span className={`text-[9px] font-mono ${h.value > 55 ? "text-canvas/70" : "text-ink/50"}`}>
                    {h.value}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Where the interest comes from — reacts to selection */}
        <div className="col-span-12 lg:col-span-3 bg-ink text-canvas rounded-2xl p-6 flex flex-col justify-between gap-4">
          <h3 className="text-[10px] font-semibold uppercase tracking-[0.15em] text-canvas/50">
            Top-Quelle
          </h3>
          <div>
            <p className="text-3xl font-semibold tracking-tight mt-2">{topic.sources[0].pct}%</p>
            <p className="text-sm text-canvas/70 mt-1">
              über <span className="text-canvas font-semibold">{topic.sources[0].label}</span>
            </p>
          </div>
          <div className="space-y-2 text-[11px]">
            {topic.sources.map((s) => (
              <SourceBar key={s.label} label={s.label} pct={s.pct} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- Interactive weekly reader-reach chart ----------
function TopicTrendChart({ topic }: { topic: (typeof TOPICS)[number] }) {
  const n = topic.readers.length;
  const peakIdx = topic.readers.indexOf(Math.max(...topic.readers));
  const [hover, setHover] = useState<number | null>(null);
  const active = hover ?? peakIdx;

  const totalThis = sum(topic.readers);
  const totalPrev = sum(topic.prev);
  const wow = wowPct(topic); // same source of truth as the trending list
  const max = Math.max(...topic.readers, ...topic.prev) * 1.18;

  const x = (i: number) => (i / (n - 1)) * 100;
  const y = (v: number) => 100 - (v / max) * 100;
  const linePath = (vals: number[]) => vals.map((v, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(v)}`).join(" ");
  const areaPath = (vals: number[]) => `${linePath(vals)} L100,100 L0,100 Z`;

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const rel = (e.clientX - rect.left) / rect.width;
    setHover(Math.max(0, Math.min(n - 1, Math.round(rel * (n - 1)))));
  };

  const fmt = (v: number) => v.toLocaleString("de-DE");

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div className="min-w-0">
          <h3 className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
            Leser-Reichweite · {topic.category}
          </h3>
          <p className="text-lg font-semibold mt-1 tracking-tight truncate">{topic.name}</p>
          <p className="text-2xl font-semibold mt-1 tracking-tight">
            {fmt(totalThis)}
            <span className="text-muted-foreground text-sm font-medium ml-1">Leser / Woche</span>
            <span className={`text-sm font-medium ml-2 ${wow >= 0 ? "text-success" : "text-brand"}`}>
              {wow >= 0 ? "↗" : "↘"} {wow >= 0 ? "+" : ""}{wow}%
            </span>
          </p>
        </div>
        <div className="flex gap-2 text-[10px] shrink-0">
          <button className="px-3 py-1.5 rounded-md bg-ink text-canvas font-semibold">7T</button>
          <button className="px-3 py-1.5 rounded-md text-muted-foreground hover:bg-ink/5 transition-colors">30T</button>
          <button className="px-3 py-1.5 rounded-md text-muted-foreground hover:bg-ink/5 transition-colors">90T</button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 mb-3 text-[10px] font-medium text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="w-3 h-[3px] rounded-full bg-brand" />Diese Woche</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-[2px] rounded-full bg-ink/25" />Vorwoche</span>
      </div>

      {/* Chart area */}
      <div
        className="relative h-52 cursor-crosshair"
        onMouseMove={handleMove}
        onMouseLeave={() => setHover(null)}
      >
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
        >
          <defs>
            <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.58 0.22 255)" stopOpacity="0.28" />
              <stop offset="100%" stopColor="oklch(0.58 0.22 255)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Gridlines */}
          {[0, 25, 50, 75, 100].map((g) => (
            <line
              key={g}
              x1="0"
              x2="100"
              y1={g}
              y2={g}
              stroke="oklch(0.18 0.01 240 / 0.06)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
              strokeDasharray="2 3"
            />
          ))}
          {/* Last week (faint dashed line) */}
          <path
            d={linePath(topic.prev)}
            fill="none"
            stroke="oklch(0.18 0.01 240 / 0.25)"
            strokeWidth="1.5"
            strokeDasharray="3 3"
            vectorEffect="non-scaling-stroke"
          />
          {/* This week (area + line) */}
          <path d={areaPath(topic.readers)} fill="url(#trendFill)" />
          <path
            d={linePath(topic.readers)}
            fill="none"
            stroke="oklch(0.58 0.22 255)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* Hover guide + dot + tooltip (HTML overlay, avoids SVG scale distortion) */}
        <div
          className="absolute top-0 bottom-0 w-px bg-brand/30 pointer-events-none"
          style={{ left: `${x(active)}%` }}
        />
        <div
          className="absolute size-3 rounded-full bg-brand ring-2 ring-card shadow pointer-events-none -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${x(active)}%`, top: `${y(topic.readers[active])}%` }}
        />
        <div
          className="absolute z-10 -translate-x-1/2 -translate-y-full pointer-events-none transition-[left] duration-75"
          style={{ left: `${Math.min(85, Math.max(15, x(active)))}%`, top: `${y(topic.readers[active])}%`, marginTop: -12 }}
        >
          <div className="bg-ink text-canvas rounded-lg px-3 py-2 shadow-lg whitespace-nowrap">
            <p className="text-[10px] uppercase tracking-wider text-canvas/50">{DAYS[active]}</p>
            <p className="text-sm font-semibold">{fmt(topic.readers[active])} Leser</p>
            <p className="text-[10px] text-canvas/60">Vorwoche {fmt(topic.prev[active])}</p>
          </div>
        </div>
      </div>

      {/* X-axis */}
      <div className="flex justify-between mt-2 text-[10px] font-medium text-muted-foreground">
        {DAYS.map((d, i) => (
          <span key={d} className={i === active ? "text-ink font-semibold" : ""}>
            {d}
          </span>
        ))}
      </div>

      {/* Footer stats + context note */}
      <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-ink/5">
        <Stat label="Peak-Tag" value={`${DAYS[peakIdx]} · ${fmt(topic.readers[peakIdx])}`} />
        <Stat label="Ø / Tag" value={fmt(Math.round(totalThis / n))} />
        <Stat label="vs. Vorwoche" value={`${wow >= 0 ? "+" : ""}${wow}%`} accent={wow >= 0} />
      </div>
      <div className="mt-4 flex items-start gap-2 text-[11px] text-muted-foreground leading-relaxed">
        <span className="text-brand mt-px">›</span>
        <span>{topic.note}</span>
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={`text-sm font-semibold mt-0.5 tracking-tight ${accent ? "text-success" : "text-ink"}`}>{value}</p>
    </div>
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

function Donut({ audience }: { audience: { genZ: number; millennial: number; other: number } }) {
  // circumference-based dasharray — segments driven by the selected topic
  const c = 2 * Math.PI * 36;
  const seg1 = (audience.genZ / 100) * c;
  const seg2 = (audience.millennial / 100) * c;
  const seg3 = (audience.other / 100) * c;
  const youth = audience.genZ + audience.millennial;
  return (
    <div className="relative size-28 shrink-0">
      <svg viewBox="0 0 100 100" className="size-full -rotate-90">
        <circle cx="50" cy="50" r="36" fill="none" stroke="oklch(0.92 0.004 240)" strokeWidth="14" />
        <circle
          cx="50" cy="50" r="36" fill="none"
          stroke="oklch(0.58 0.22 255)" strokeWidth="14"
          strokeDasharray={`${seg1} ${c - seg1}`} strokeDashoffset={0}
          style={{ transition: "stroke-dasharray 0.6s cubic-bezier(0.19, 1, 0.22, 1)" }}
        />
        <circle
          cx="50" cy="50" r="36" fill="none"
          stroke="oklch(0.18 0.01 240)" strokeWidth="14"
          strokeDasharray={`${seg2} ${c - seg2}`} strokeDashoffset={-seg1}
          style={{ transition: "stroke-dasharray 0.6s cubic-bezier(0.19, 1, 0.22, 1), stroke-dashoffset 0.6s cubic-bezier(0.19, 1, 0.22, 1)" }}
        />
        <circle
          cx="50" cy="50" r="36" fill="none"
          stroke="oklch(0.18 0.01 240 / 0.2)" strokeWidth="14"
          strokeDasharray={`${seg3} ${c - seg3}`} strokeDashoffset={-(seg1 + seg2)}
          style={{ transition: "stroke-dasharray 0.6s cubic-bezier(0.19, 1, 0.22, 1), stroke-dashoffset 0.6s cubic-bezier(0.19, 1, 0.22, 1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-semibold tracking-tight">{youth}%</span>
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
// Cached real-world example: the Heilbronner Lichterfest (18.–20. Juni 2026).
// Paraphrased from public event info, not copied article text.
const DEFAULT_ARTICLE = `Heilbronn leuchtet wieder: Das Lichterfest am Neckar ist zurück

Drei Abende lang verwandelt sich die Heilbronner Neckarmeile ab heute in eine Festivalmeile. Von Donnerstag, 18., bis Samstag, 20. Juni, feiert die Stadt das Lichterfest am Neckar – jeweils von 18 bis 24 Uhr und bei freiem Eintritt.

Rund um den Hagenbucher See bespielen vier Bühnen das Ufer: 14 Bands und mehrere DJs sorgen von Pop über Indie bis Electro für Stimmung. Höhepunkt an allen drei Abenden ist die große Laser-, Feuer- und Pyroshow, die pünktlich um 22.30 Uhr den Himmel über dem Wasser in Szene setzt.

Zwischen den Bühnen lädt ein Streetfood-Markt zum Schlemmen ein, von Flammkuchen bis Bao Buns. Wer es sportlicher mag, kann den Artist:innen bei der Slackline-Show in rund acht Metern Höhe zusehen oder die eFoil-Vorführungen auf dem Neckar verfolgen. Erstmals werden zudem geführte Kanutouren angeboten.

„Das Lichterfest ist für viele junge Heilbronner:innen der inoffizielle Start in den Sommer", sagt eine Sprecherin der Stadt. Die Veranstalter rechnen erneut mit mehreren Zehntausend Besucher:innen. Wegen der Bauarbeiten an der Neckarmeile wird empfohlen, mit Bus und Bahn anzureisen.`;

// Cached analysis for the example above — the characteristics that matter for 20–35.
const ANALYSIS = {
  title: "Lichterfest am Neckar",
  score: 86,
  predicted: 8200, // AI-predicted reader reach for this draft
  bars: [
    { label: "Youth Appeal", value: 90 },
    { label: "Topic Match", value: 85 },
    { label: "Tonalität", value: 68, muted: true },
    { label: "Freshness", value: 96 },
  ],
  tip: 'Ziehe die Laser- & Feuershow (22.30 Uhr) und die eFoil-/Slackline-Action weiter nach oben — diese Erlebnis-Hooks treiben Shares bei 20–35. Ein klarer Anfahrts-/ÖPNV-Hinweis erhöht die Resonanz um <span class="text-canvas font-semibold">+14%</span>.',
};

function AnalyzerSection() {
  // Starts empty — paste the cached DEFAULT_ARTICLE text in live, then analyse.
  const [article, setArticle] = useState("");
  const [analyzed, setAnalyzed] = useState(false);
  const analysis = ANALYSIS;

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
              {!article.trim() && (
                <button
                  onClick={() => {
                    setArticle(DEFAULT_ARTICLE);
                    setAnalyzed(false);
                  }}
                  className="text-muted-foreground text-sm font-semibold py-2.5 px-4 rounded-lg ring-1 ring-ink/10 hover:bg-ink/5 transition-colors"
                >
                  Beispieltext einfügen
                </button>
              )}
              <button
                onClick={() => setAnalyzed(true)}
                disabled={!article.trim()}
                className="bg-ink text-canvas text-sm font-semibold py-2.5 px-4 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-30 disabled:pointer-events-none"
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
              <ScoreRing value={analysis.score} pending={!analyzed} />
              <p className="mt-4 text-xs text-canvas/60">Gesamt-Relevanz für 20–35</p>
            </div>

            <div className="space-y-4">
              {analysis.bars.map((b) => (
                <ScoreBar
                  key={b.label}
                  label={b.label}
                  value={analyzed ? b.value : 0}
                  muted={!analyzed || b.value < 70}
                  pending={!analyzed}
                />
              ))}
            </div>

            {analyzed ? (
              <div className="p-4 rounded-xl bg-canvas/5 border border-canvas/10 space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-brand">KI-Tipp</p>
                <p
                  className="text-xs leading-relaxed text-canvas/80"
                  dangerouslySetInnerHTML={{ __html: analysis.tip }}
                />
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-canvas/5 border border-canvas/10 border-dashed">
                <p className="text-xs leading-relaxed text-canvas/50">
                  Klicke <span className="text-canvas/80 font-semibold">„Deep-Analyse starten"</span>, um Resonance
                  Score, Kennzahlen und KI-Tipp zu sehen.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <PublishedThisWeek
        draft={analyzed ? { title: analysis.title, score: analysis.score, predicted: analysis.predicted } : null}
      />
    </section>
  );
}

// Read-only performance tracker: topics already published, predicted reader
// reach vs. how many readers they actually attracted — proof the model predicts well.
const PUBLISHED = [
  { title: "Wohnungsnot: Der WG-Zimmer-Report", score: 88, predicted: 8700, actual: 9400 },
  { title: "KI-Festival 2026: Das Programm steht", score: 82, predicted: 7200, actual: 6800 },
  { title: "Uni-Parkregelung neu geordnet", score: 74, predicted: 1350, actual: 1240 },
  { title: "Gemeinderat: Haushalt 2026", score: 38, predicted: 360, actual: 410 },
  { title: "Neuer Stadtbahn-Fahrplan", score: 45, predicted: 320, actual: 280 },
];

function PublishedThisWeek({
  draft,
}: {
  draft: { title: string; score: number; predicted: number } | null;
}) {
  const max = Math.max(
    ...PUBLISHED.map((p) => Math.max(p.predicted, p.actual)),
    draft?.predicted ?? 0,
  );
  const fmt = (v: number) => v.toLocaleString("de-DE");
  return (
    <div className="bg-card ring-1 ring-ink/5 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
          Veröffentlicht diese Woche
        </h3>
        <span className="text-[10px] font-semibold text-success">Prognose-Genauigkeit · 91%</span>
      </div>
      <p className="text-[11px] text-muted-foreground mb-5 flex items-center gap-3">
        Resonanz-Score · vorhergesagte → tatsächliche Leser
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-[3px] rounded-full bg-brand" />tatsächlich
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-px h-2.5 bg-ink/40" />Prognose
        </span>
      </p>

      {/* Forecast row — the just-analysed draft, not yet published */}
      {draft && (
        <div className="flex items-center gap-4 p-3 mb-2 rounded-xl bg-brand/[0.07] ring-1 ring-brand/25 animate-rise-bar">
          <span className="shrink-0 w-9 text-center text-sm font-semibold tabular-nums rounded-md py-1 bg-brand text-brand-foreground">
            {draft.score}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold truncate">{draft.title}</p>
              <span className="shrink-0 text-[9px] font-bold uppercase tracking-wider text-brand bg-brand/15 px-1.5 py-0.5 rounded">
                Entwurf · Prognose
              </span>
            </div>
            <div className="relative mt-1.5 h-1.5 bg-brand/10 rounded-full">
              <div
                className="absolute inset-y-0 left-0 bg-brand rounded-full animate-draw-bar"
                style={{ width: `${(draft.predicted / max) * 100}%` }}
              />
            </div>
          </div>
          <span className="shrink-0 text-right tabular-nums">
            <span className="text-sm font-semibold text-brand">~{fmt(draft.predicted)}</span>
            <span className="text-[11px] text-muted-foreground"> Leser erwartet</span>
          </span>
        </div>
      )}

      <ul className="space-y-1">
        {PUBLISHED.map((p) => {
          const high = p.score >= 70;
          const beat = p.actual >= p.predicted;
          return (
            <li key={p.title} className="flex items-center gap-4 py-3 border-b last:border-b-0 border-ink/5">
              <span
                className={`shrink-0 w-9 text-center text-sm font-semibold tabular-nums rounded-md py-1 ${
                  high ? "bg-brand/10 text-brand" : "bg-ink/[0.04] text-muted-foreground"
                }`}
              >
                {p.score}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{p.title}</p>
                <div className="relative mt-1.5 h-1.5 bg-ink/[0.06] rounded-full">
                  <div
                    className="absolute inset-y-0 left-0 bg-brand/70 rounded-full animate-draw-bar"
                    style={{ width: `${(p.actual / max) * 100}%` }}
                  />
                  {/* predicted marker */}
                  <div
                    className="absolute -top-0.5 -bottom-0.5 w-px bg-ink/50"
                    style={{ left: `${(p.predicted / max) * 100}%` }}
                  />
                </div>
              </div>
              <span className="shrink-0 text-right tabular-nums">
                <span className="text-[11px] text-muted-foreground">{fmt(p.predicted)} → </span>
                <span className="text-sm font-semibold">{fmt(p.actual)}</span>
                <span className={`ml-1.5 text-[11px] font-semibold ${beat ? "text-success" : "text-muted-foreground"}`}>
                  {beat ? "↗" : "↘"}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ScoreRing({ value, pending }: { value: number; pending?: boolean }) {
  const c = 2 * Math.PI * 42;
  const shown = pending ? 0 : value;
  const offset = c - (shown / 100) * c;
  return (
    <div className="relative size-36">
      <svg viewBox="0 0 100 100" className="size-full -rotate-90">
        <circle cx="50" cy="50" r="42" fill="none" stroke="oklch(1 0 0 / 0.08)" strokeWidth="6" />
        <circle
          cx="50" cy="50" r="42" fill="none"
          stroke="oklch(0.58 0.22 255)" strokeWidth="6"
          strokeDasharray={c} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.19, 1, 0.22, 1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-semibold tracking-tighter animate-count-up">
          {pending ? "–" : value}
        </span>
        <span className="text-[10px] uppercase tracking-widest text-canvas/40">/ 100</span>
      </div>
    </div>
  );
}

function ScoreBar({ label, value, muted, pending }: { label: string; value: number; muted?: boolean; pending?: boolean }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-[10px] font-semibold uppercase tracking-wider">
        <span className="text-canvas/70">{label}</span>
        <span className={muted ? "text-canvas/80" : "text-brand"}>{pending ? "–" : `${value}%`}</span>
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

          {/* IG top bar */}
          <header className="relative h-14 flex items-center justify-center border-b border-black/5">
            <svg viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.2" className="size-6 absolute left-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <div className="flex flex-col items-center leading-tight">
              <span className="text-[15px] font-bold text-black">Posts</span>
              <span className="text-[11px] text-black/60">stimmeonline</span>
            </div>
            <button className="absolute right-3.5 text-[12px] font-semibold text-white bg-[#0095f6] px-3.5 py-1.5 rounded-lg">
              Follow
            </button>
          </header>

          {/* Post header */}
          <div className="flex items-center gap-2.5 px-3.5 py-2.5">
            <div className="size-9 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600">
              <div className="size-full rounded-full bg-white p-[2px]">
                <div className="size-full rounded-full bg-brand flex items-center justify-center text-white text-[6px] font-serif font-bold tracking-tight leading-none">
                  STIMME
                </div>
              </div>
            </div>
            <span className="flex-1 text-[13px] font-semibold text-black">stimmeonline</span>
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

          </div>

          {/* Carousel dots */}
          <div className="flex justify-center gap-1.5 py-2.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`size-1.5 rounded-full transition-all ${
                  active === i ? "bg-[#0095f6]" : "bg-black/20"
                }`}
              />
            ))}
          </div>

          {/* Action row */}
          <div className="px-3 pb-1.5 flex items-center text-black">
            <button className="flex items-center gap-1.5">
              <HeartIcon />
              <span className="text-[13px] font-semibold">191</span>
            </button>
            <button className="flex items-center gap-1.5 ml-4">
              <CommentIcon />
              <span className="text-[13px] font-semibold">8</span>
            </button>
            <button className="flex items-center gap-1.5 ml-4">
              <RepostIcon />
              <span className="text-[13px] font-semibold">1</span>
            </button>
            <button className="ml-4">
              <ShareIcon />
            </button>
            <button className="ml-auto">
              <BookmarkIcon />
            </button>
          </div>

          {/* Caption */}
          <div className="px-3.5 space-y-1 pb-3">
            <p className="text-[12px] leading-snug text-black">
              <span className="font-semibold">stimmeonline</span> Neue Pläne für unser Zentrum 🌳 Mehr Grün,
              weniger Beton — und ihr habt ein… <span className="text-black/50">mehr</span>
            </p>
            <p className="text-[12px] leading-snug text-[#0095f6]">
              #Heilbronn #Stadtentwicklung #GenZ #StimmeRadar
            </p>
            <p className="text-[11px] text-black/40">Alle 8 Kommentare ansehen</p>
            <p className="text-[11px] text-black/40 pt-0.5">Vor 2 Stunden</p>
          </div>

          {/* Bottom tab bar */}
          <div className="mt-auto border-t border-black/5 h-12 grid grid-cols-5 items-center px-2">
            <TabIcon kind="home" />
            <TabIcon kind="search" />
            <TabIcon kind="plus" />
            <TabIcon kind="reels" />
            <div className="flex justify-center">
              <div className="size-6 rounded-full bg-brand ring-1 ring-black flex items-center justify-center">
                <span className="text-white text-[4px] font-serif font-bold tracking-tight leading-none">
                  STIMME
                </span>
              </div>
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
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  );
}
function RepostIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 1l4 4-4 4M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 01-4 4H3" />
    </svg>
  );
}
function CommentIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
    </svg>
  );
}
function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  );
}
function BookmarkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1.8" className="size-6">
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

function Footer({ step, onStep }: { step: number; onStep: (i: number) => void }) {
  return (
    <footer className="border-t border-ink/5">
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
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => onStep(i)}
              className={`transition-colors hover:text-ink ${i === step ? "text-ink" : ""}`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
}
