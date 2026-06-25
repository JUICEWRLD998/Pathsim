import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "PathSim AI — Play Your Future Before You Choose It",
  description:
    "Career simulation game powered by AI. Discover careers by experiencing them.",
  keywords: ["career", "AI", "simulation", "students", "education"],
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
    >
      {/* Navbar is added in Phase 3 once the layout components exist */}
      <body className="bg-void text-white font-body antialiased min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
