'use client';

import { useEffect, useState, type MouseEvent } from 'react';
import {
  Home,
  User,
  FolderGit2,
  Boxes,
  GraduationCap,
  Mail,
  Github,
  Linkedin,
  Instagram,
  Trophy,
  ArrowUpRight,
} from 'lucide-react';
import { AnimeNavBar } from '@/components/ui/anime-navbar';
import ScrollExpandMedia from '@/components/blocks/scroll-expansion-hero';
import { TelemetrySpine } from '@/components/telemetry-spine';
import { Reveal } from '@/components/reveal';
import { HeroBackground } from '@/components/hero-background';
import dynamic from 'next/dynamic';

const DottedSurface = dynamic(
  () => import('@/components/ui/dotted-surface').then((m) => ({ default: m.DottedSurface })),
  { ssr: false },
);

// ------- content constants (edit here) -------
const EMAIL = 'sudhanshuwork03@gmail.com';
const PHONE = '+91 7499116138';
const LINKEDIN = 'https://linkedin.com/in/sudhanshu-biswas-26b668268';
const GITHUB = 'https://github.com/SudhanshuBiswas01';
const INSTAGRAM = 'https://www.instagram.com/sudhanshu._.op_/';

const NAV = [
  { name: 'Home', url: '#home', icon: Home },
  { name: 'About', url: '#about', icon: User },
  { name: 'Work', url: '#work', icon: FolderGit2 },
  { name: 'Stack', url: '#stack', icon: Boxes },
  { name: 'Path', url: '#path', icon: GraduationCap },
  { name: 'Contact', url: '#contact', icon: Mail },
];

const TICKER = [
  'Currently building → RiskRadar v2 (Azure MLOps)',
  'Shipping daily on LinkedIn + Instagram',
  'Daily competitive programming + gym',
];

const SKILL_GROUPS = [
  { id: 'agents', label: 'LLMs & Agents', items: ['LangChain', 'LangGraph', 'LangSmith', 'Prompt Engineering', 'Agent Workflows', 'Embeddings'] },
  { id: 'rag', label: 'RAG & Vector', items: ['ChromaDB', 'Vector Search', 'Semantic Chunking', 'Hallucination Control'] },
  { id: 'backend', label: 'Backend', items: ['Python', 'SQL', 'FastAPI', 'REST APIs', 'Streamlit'] },
  { id: 'cloud', label: 'Cloud & MLOps', items: ['GCP', 'Azure ML', 'Docker', 'GitHub Actions CI/CD', 'MLflow'] },
  { id: 'ml', label: 'Machine Learning', items: ['LightGBM', 'XGBoost', 'Scikit-learn', 'Feature Engineering'] },
  { id: 'data', label: 'Data & Tools', items: ['Pandas', 'NumPy', 'Git', 'Cursor'] },
];

const TIMELINE = [
  { when: 'Feb 2026 — Present', title: 'Post Graduate, Agentic AI & Machine Learning', where: 'IIT Gandhinagar' },
  { when: 'Oct 2022 — 2026', title: 'BSc (Hons) Computer Science', where: 'London South Bank University, UK' },
  { when: 'Oct 2022 — 2026', title: 'BSc (Hons) Computer Science', where: 'IU International University of Applied Sciences, Germany' },
  { when: 'Jun 2019 — Aug 2022', title: 'Diploma, Computer Science Engineering', where: 'Maharashtra State Board — 2nd Rank in batch' },
];

const CERTS = [
  { title: 'Harvard CS50 — Intro to Computer Science', sub: 'Certification' },
  { title: '1st Place — HackRush 2026, IIT Gandhinagar', sub: 'Quantitative Finance Track' },
  { title: '2nd Rank in Batch — Diploma', sub: 'Maharashtra State Board' },
  { title: 'English C1 · German A1 · Native: Hindi/Bengali/Marathi', sub: 'IELTS 7.0 · Duolingo 120' },
];

type RepoStat = { name: string; stars: number; forks: number; html_url: string };

function Eyebrow({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.22em] text-ash">
      <span className="text-signal">{n}</span>
      <span className="h-px w-8 bg-white/15" />
      {children}
    </div>
  );
}

function ProjectCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', e.clientX - r.left + 'px');
    e.currentTarget.style.setProperty('--my', e.clientY - r.top + 'px');
  };
  return (
    <div
      data-magnetic
      onMouseMove={onMove}
      className={
        'proj-card group relative overflow-hidden rounded-2xl border border-white/10 bg-surface/60 p-7 backdrop-blur-sm transition-colors duration-300 hover:border-signal/40 ' +
        (className ?? '')
      }
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
}

function TechTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 font-mono text-[11px] text-ash">
      {children}
    </span>
  );
}

export default function Page() {
  const [active, setActive] = useState('Home');
  const [skill, setSkill] = useState('agents');
  const [repos, setRepos] = useState<RepoStat[]>([]);

  // scroll spy
  useEffect(() => {
    const map: Record<string, string> = {
      home: 'Home', about: 'About', work: 'Work', stack: 'Stack', path: 'Path', contact: 'Contact',
    };
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && map[e.target.id]) setActive(map[e.target.id]);
        });
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    Object.keys(map).forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  // live github stats (graceful fallback baked into the UI copy)
  useEffect(() => {
    fetch('/api/github')
      .then((r) => r.json())
      .then((d) => {
        if (d?.ok && Array.isArray(d.repos)) setRepos(d.repos);
      })
      .catch(() => {});
  }, []);

  const heat = Array.from({ length: 210 }, () => Math.random());
  const shades = ['bg-white/[0.04]', 'bg-signal/20', 'bg-signal/40', 'bg-signal/60', 'bg-signal/90'];
  const eduBg = {
    backgroundImage: 'url(/education-bg.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <main className="relative overflow-x-hidden">
      <AnimeNavBar items={NAV} activeId={active} />
      <TelemetrySpine sectionIds={['home', 'about', 'work', 'stack', 'path', 'contact']} />

      {/* HERO — signature scroll-expansion moment */}
      <section id="home" className="relative">
        <HeroBackground />
        <ScrollExpandMedia
          mediaType="video"
          mediaSrc="/hero-neural-network.mp4"
          posterSrc="/hero-poster.jpg"
          bgImageSrc="/hero-bg.png"
          title="Hello, I am Sudhanshu."
          scrollToExpand="Scroll to enter"
        >
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-lg text-ash md:text-xl">
              Welcome to my portfolio. I&apos;m an AI/ML/Agentic Engineer building production LLM systems — and
              documenting the whole build in public.
            </p>
          </div>
        </ScrollExpandMedia>
      </section>

      {/* CURRENTLY BUILDING ticker */}
      <div className="relative z-10 overflow-hidden border-y border-white/5 bg-black/30 py-3">
        <div className="flex w-max animate-marquee gap-10 font-mono text-xs text-ash motion-reduce:animate-none">
          {[...TICKER, ...TICKER, ...TICKER, ...TICKER].map((t, i) => (
            <span key={i} className="flex items-center gap-10">
              {t}
              <span className="text-signal">●</span>
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6">
        {/* ABOUT */}
        <section id="about" className="scroll-mt-20 py-16 md:scroll-mt-28 md:py-28">
          <Reveal>
            <Eyebrow n="01">The operator</Eyebrow>
          </Reveal>
          <div className="grid gap-8 md:gap-12 md:grid-cols-[1.6fr_1fr]">
            <Reveal delay={0.05}>
              <div className="space-y-5 text-base leading-relaxed text-vapor/90 md:text-lg">
                <p>
                  I build and deploy <strong className="text-white">production AI systems — not toy notebooks</strong>. Day to day that means LLM agents, RAG pipelines, and the MLOps glue that keeps them alive in the real world.
                </p>
                <p>
                  Right now I&apos;m completing a Post-Graduate program in <strong className="text-white">Agentic AI &amp; Machine Learning at IIT Gandhinagar</strong>, alongside a dual-degree BSc in Computer Science with IU (Germany) and London South Bank University (UK). And I document the entire grind in the open — <strong className="text-white">high volume of real shipped work beats polish-in-private</strong>, every time.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.12}>
              <dl className="flex gap-6 font-mono text-sm md:flex-col md:gap-6 md:space-y-0">
                <div><dt className="text-2xl font-semibold text-white md:text-3xl">3</dt><dd className="text-ash">degrees in flight</dd></div>
                <div><dt className="text-2xl font-semibold text-white md:text-3xl">1st</dt><dd className="text-ash">HackRush 2026</dd></div>
                <div><dt className="text-2xl font-semibold text-white md:text-3xl">2.26M</dt><dd className="text-ash">rows shipped</dd></div>
              </dl>
            </Reveal>
          </div>
        </section>

        {/* WORK — bento */}
        <section id="work" className="scroll-mt-20 py-12 md:scroll-mt-28 md:py-16">
          <Reveal><Eyebrow n="02">Selected work</Eyebrow></Reveal>
          <div className="grid gap-5 grid-cols-1 md:grid-cols-3">
            <Reveal delay={0.05} className="md:col-span-2">
              <ProjectCard className="h-full">
                <div className="mb-3 font-mono text-[11px] uppercase tracking-widest text-signal">Agentic · RAG</div>
                <h3 className="font-display text-2xl font-semibold text-white">LawGPT — Legal Assistant</h3>
                <p className="mt-3 text-vapor/80">End-to-end RAG pipeline ingesting legal documents and generating plain-language explanations for non-specialists. Multi-step agentic workflow for task decomposition, grounding checks to cut hallucination on high-stakes output, clause-level Q&amp;A via document upload.</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {['Python', 'FastAPI', 'LangGraph', 'ChromaDB', 'Streamlit'].map((t) => <TechTag key={t}>{t}</TechTag>)}
                </div>
                <a href={GITHUB + '/Justice-AI'} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-1 font-mono text-xs text-signal hover:text-ion truncate max-w-full">View on GitHub <ArrowUpRight size={13} /></a>
              </ProjectCard>
            </Reveal>
            <Reveal delay={0.12}>
              <ProjectCard className="h-full">
                <div className="mb-3 font-mono text-[11px] uppercase tracking-widest text-signal">Hybrid ML + LLM</div>
                <h3 className="font-display text-2xl font-semibold text-white">Mech Sage</h3>
                <p className="mt-3 text-vapor/80">Predictive-maintenance copilot. Hybrid ML + LLM agent architecture that predicts Remaining Useful Life, detects anomalies, and drafts agentic work orders — a copilot that reasons, not just predicts.</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {['RUL', 'Agents', 'Anomaly Detection'].map((t) => <TechTag key={t}>{t}</TechTag>)}
                </div>
              </ProjectCard>
            </Reveal>
            <Reveal delay={0.05} className="col-span-1 md:col-span-3">
              <ProjectCard>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="mb-3 font-mono text-[11px] uppercase tracking-widest text-signal">End-to-end ML · MLOps</div>
                    <h3 className="font-display text-2xl font-semibold text-white">RiskRadar — Risk Analytics Pipeline</h3>
                    <p className="mt-3 max-w-2xl text-vapor/80">Full ML pipeline on the LendingClub dataset (2.26M rows). Reduced 145 raw features to 17 high-signal predictors, LightGBM classifier at AUC 0.7686, containerized production deployment with CI/CD.</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {['Python', 'LightGBM', 'Azure ML', 'Docker', 'GitHub Actions'].map((t) => <TechTag key={t}>{t}</TechTag>)}
                    </div>
                    <a href={GITHUB + '/HackRush_Hackhon_IITGN'} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-1 font-mono text-xs text-signal hover:text-ion truncate max-w-full">View on GitHub <ArrowUpRight size={13} /></a>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-4xl font-semibold text-white">0.7686</div>
                    <div className="font-mono text-[11px] uppercase tracking-widest text-ash">AUC</div>
                  </div>
                </div>
              </ProjectCard>
            </Reveal>
          </div>

          {/* HackRush spotlight */}
          <Reveal delay={0.05}>
            <div className="mt-5 overflow-hidden rounded-2xl border border-ion/25 bg-gradient-to-br from-surface-2/80 to-surface/40 p-5 md:p-8">
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-ion"><Trophy size={14} /> 1st Place · Quantitative Finance Track</div>
              <h3 className="mt-3 font-display text-2xl font-semibold text-white md:text-3xl">HackRush 2026 — IIT Gandhinagar&apos;s 9th Annual Hackathon</h3>
              <div className="mt-6 flex flex-wrap gap-6 md:gap-10 font-mono text-sm">
                <div><span className="text-xl font-semibold text-white md:text-2xl">1st</span> <span className="text-ash">of the Quant track</span></div>
                <div><span className="text-xl font-semibold text-white md:text-2xl">2</span> <span className="text-ash">with teammate Ayush Patil</span></div>
                <div><span className="text-xl font-semibold text-white md:text-2xl">2.26M</span> <span className="text-ash">rows processed</span></div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* STACK — filterable */}
        <section id="stack" className="scroll-mt-20 py-16 md:scroll-mt-28 md:py-28">
          <Reveal><Eyebrow n="03">The stack</Eyebrow></Reveal>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-[1fr_1.4fr]">
            <div className="space-y-2">
              {SKILL_GROUPS.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setSkill(g.id)}
                  className={
                    'flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors ' +
                    (skill === g.id
                      ? 'border-signal/50 bg-signal/[0.08] text-white'
                      : 'border-white/10 bg-surface/40 text-ash hover:text-vapor')
                  }
                >
                  <span className="font-medium">{g.label}</span>
                  <span className="font-mono text-xs">{g.items.length}</span>
                </button>
              ))}
            </div>
            <div className="rounded-2xl border border-white/10 bg-surface/40 p-5 md:p-8">
              <div className="flex flex-wrap gap-3">
                {SKILL_GROUPS.find((g) => g.id === skill)?.items.map((it) => (
                  <span key={it} className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-vapor">{it}</span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* PATH — education, collage bg, calmer */}
      <section id="path" className="relative scroll-mt-20 overflow-hidden py-16 md:scroll-mt-28 md:py-28">
        <div className="absolute inset-0 -z-10 opacity-20" style={eduBg} aria-hidden />
        <div className="absolute inset-0 -z-10 bg-void/85" aria-hidden />
        <div className="mx-auto max-w-5xl px-6">
          <Reveal><Eyebrow n="04">The path</Eyebrow></Reveal>
          <div className="space-y-12">
            <div className="space-y-8">
              {TIMELINE.map((t, i) => (
                <Reveal key={t.title} delay={i * 0.08}>
                  <div className="grid gap-2 border-l border-white/10 pl-6 md:grid-cols-[220px_1fr]">
                    <div className="font-mono text-xs uppercase tracking-widest text-signal">{t.when}</div>
                    <div>
                      <h3 className="font-display text-lg font-semibold text-white">{t.title}</h3>
                      <p className="text-sm text-ash">{t.where}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.2}>
              <div className="overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
                <img src="/education-bg.png" alt="Education Journey" loading="lazy" className="w-full h-auto object-cover opacity-90 transition-opacity hover:opacity-100" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6">
        {/* SIGNALS + heatmap */}
        <section className="py-16">
          <Reveal><Eyebrow n="05">Signals &amp; proof</Eyebrow></Reveal>
          <div className="grid gap-4 md:grid-cols-2">
            {CERTS.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.06}>
                <div className="rounded-xl border border-white/10 bg-surface/40 p-5">
                  <div className="font-medium text-white">{c.title}</div>
                  <div className="font-mono text-xs text-ash">{c.sub}</div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <div className="mt-8 rounded-2xl border border-white/10 bg-surface/40 p-4 md:p-6">
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-sm font-medium text-white">Build-in-public activity</span>
                <span className="font-mono text-[10px] text-ash md:text-[11px]">
                  {repos.length
                    ? repos.map((r) => r.name + ' ★' + r.stars).join('  ·  ')
                    : 'live via GitHub API in production'}
                </span>
              </div>
              <div className="grid grid-flow-col grid-rows-7 gap-1 overflow-x-auto">
                {heat.map((w, i) => (
                  <span key={i} className={'h-3 w-3 rounded-[3px] ' + shades[w > 0.82 ? 4 : w > 0.62 ? 3 : w > 0.4 ? 2 : w > 0.2 ? 1 : 0]} />
                ))}
              </div>
            </div>
          </Reveal>
        </section>

        {/* CONTACT */}
        <section id="contact" className="relative scroll-mt-20 py-16 text-center md:scroll-mt-28 md:py-28 overflow-hidden">
          <DottedSurface className="absolute inset-0 z-0 h-full w-full" />
          <Reveal className="relative z-10">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-6xl">
              Let&apos;s ship something
              <br />
              <span className="bg-gradient-to-r from-signal to-ion bg-clip-text text-transparent">that reaches production.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <a href={'mailto:' + EMAIL} className="mt-8 inline-block font-mono text-base text-signal underline decoration-signal/40 underline-offset-8 hover:text-ion md:text-lg">{EMAIL}</a>
          </Reveal>
          <Reveal delay={0.16}>
            <div className="mt-8 flex flex-col items-center gap-4 font-mono text-sm text-ash sm:flex-row sm:flex-wrap sm:justify-center sm:gap-6 md:mt-10 relative z-10">
              <a href={'mailto:' + EMAIL} className="inline-flex items-center gap-2 hover:text-vapor"><Mail size={15} /> Email</a>
              <a href={'tel:' + PHONE.replace(/\s/g, '')} className="inline-flex items-center gap-2 hover:text-vapor">{PHONE}</a>
              <a href={LINKEDIN} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-vapor"><Linkedin size={15} /> LinkedIn</a>
              <a href={GITHUB} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-vapor"><Github size={15} /> GitHub</a>
              <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-vapor"><Instagram size={15} /> Instagram</a>
            </div>
          </Reveal>
        </section>
      </div>

      <footer className="border-t border-white/5 py-8 text-center font-mono text-xs text-ash">
        Designed &amp; built by Sudhanshu Biswas · Mumbai, India · build-in-public
      </footer>
    </main>
  );
}
