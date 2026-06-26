import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SessionProvider } from '@/components/providers/SessionProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'PathSim AI — Play Your Future Before You Choose It',
    template: '%s | PathSim AI',
  },
  description:
    'Career simulation powered by AI. Experience realistic career scenarios and discover what profession truly fits you before committing.',
  keywords: ['career', 'AI', 'simulation', 'students', 'education', 'pathsim'],
  openGraph: {
    title: 'PathSim AI — Play Your Future Before You Choose It',
    description: 'Experience realistic AI-generated career scenarios for high school students.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body 
        className="relative bg-void text-white font-body antialiased min-h-full flex flex-col overflow-x-hidden selection:bg-purple-500/35 selection:text-white"
        suppressHydrationWarning
      >
        <SessionProvider>
          {/* Ambient mesh grid backdrop */}
          <div className="pointer-events-none fixed inset-0 z-0 bg-grid-tech opacity-[0.4] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
          
          {/* Glow gradients */}
          <div className="ambient-glow glow-purple h-[500px] w-[500px] -top-40 -left-40 opacity-[0.15]" />
          <div className="ambient-glow glow-cyan h-[500px] w-[500px] bottom-10 -right-40 opacity-[0.1]" />

          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-purple-500 focus:px-4 focus:py-2 focus:text-white"
          >
            Skip to main content
          </a>
          <Navbar />
          <main id="main-content" className="relative z-10 flex-1 flex flex-col">
            {children}
          </main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
