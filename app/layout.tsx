import type { Metadata, Viewport } from 'next';
import { Space_Grotesk, Outfit, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import dynamic from 'next/dynamic';
import { CustomCursor } from '@/components/custom-cursor';

const DottedSurface = dynamic(
  () => import('@/components/ui/dotted-surface').then((m) => ({ default: m.DottedSurface })),
  { ssr: false },
);

const display = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});
const body = Outfit({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600'],
  display: 'swap',
});
const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
  display: 'swap',
});

const SITE = 'https://sudhanshubiswas.dev'; // update to your production domain

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: 'Sudhanshu Biswas — AI/ML/Agentic Engineer',
  description:
    'AI/ML/Agentic Engineer who ships to production. LLM agents, RAG pipelines, and MLOps — built and documented in public from Mumbai, India.',
  keywords: [
    'Sudhanshu Biswas',
    'AI Engineer',
    'ML Engineer',
    'Agentic AI',
    'LLM',
    'RAG',
    'MLOps',
    'LangGraph',
  ],
  authors: [{ name: 'Sudhanshu Biswas' }],
  openGraph: {
    type: 'website',
    title: 'Sudhanshu Biswas — AI/ML/Agentic Engineer',
    description:
      'Ships AI agents to production and documents the build in public. LLM agents, RAG, MLOps.',
    url: SITE,
    siteName: 'Sudhanshu Biswas',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Sudhanshu Biswas' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sudhanshu Biswas — AI/ML/Agentic Engineer',
    description: 'Ships AI agents to production. Builds in public.',
    images: ['/og.png'],
  },
};

export const viewport: Viewport = {
  themeColor: '#06070F',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const fontVars = display.variable + ' ' + body.variable + ' ' + mono.variable;
  return (
    <html lang="en" suppressHydrationWarning className={fontVars}>
      <body className="bg-void font-sans text-vapor antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
          <DottedSurface />
          <CustomCursor />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
