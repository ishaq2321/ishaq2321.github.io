import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/app/components/Nav";
import { ThemeToggle } from "@/app/components/ThemeToggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Muhammad Ishaq Khan — Developer Portfolio",
  description:
    "Computer Science student at ELTE. Open-source contributor to VS Code & Flutter. Builder of ProxiCall, PhishGuard, and more.",
  openGraph: {
    title: "Muhammad Ishaq Khan — Developer Portfolio",
    description:
      "Computer Science student at ELTE. Open-source contributor to VS Code & Flutter.",
    url: "https://ishaq2321.github.io",
    siteName: "Muhammad Ishaq Khan",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Muhammad Ishaq Khan — Developer Portfolio",
    description:
      "Computer Science student at ELTE. Open-source contributor to VS Code & Flutter.",
  },
  robots: {
    index: true,
    follow: true,
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
      className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var theme = localStorage.getItem('theme');
                if (theme === 'light') {
                  document.documentElement.classList.remove('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans">
        <Nav />
        <div className="fixed bottom-6 right-6 z-50">
          <ThemeToggle />
        </div>
        {children}
      </body>
    </html>
  );
}
