import type { Metadata } from "next";
import { Fraunces, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/app/components/Nav";
import { ThemeToggle } from "@/app/components/ThemeToggle";
import { ScrollProgress } from "@/app/components/ScrollProgress";
import { MotionProvider } from "@/app/components/MotionProvider";
import { config } from "@/lib/config";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "SOFT", "WONK"],
});

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://ishaq2321.github.io";
const DESCRIPTION =
  "Muhammad Ishaq Khan (ishaq2321) — software engineer and Computer Science graduate of ELTE (Eötvös Loránd University), Budapest. Builder of ProxiCall and backbencher.cc, open-source contributor to VS Code and Flutter.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Muhammad Ishaq Khan (ishaq2321) — Software Engineer, ELTE",
    template: "%s — Muhammad Ishaq Khan",
  },
  description: DESCRIPTION,
  applicationName: "Muhammad Ishaq Khan — Portfolio",
  authors: [{ name: "Muhammad Ishaq Khan", url: SITE_URL }],
  creator: "Muhammad Ishaq Khan",
  publisher: "Muhammad Ishaq Khan",
  keywords: [
    "ishaq2321",
    "Muhammad Ishaq Khan",
    "Muhammad Ishaq",
    "Ishaq Muhammad",
    "Ishaq Muhammad ELTE",
    "Muhammad Ishaq ELTE",
    "Muhammad Ishaq Khan ELTE",
    "Muhammad Ishaq Khan portfolio",
    "ishaq2321 portfolio",
    "ishaq2321 github",
    "ELTE Computer Science",
    "Eötvös Loránd University",
    "software engineer Budapest",
    "ProxiCall",
    "backbencher.cc",
    "VS Code contributor",
    "Flutter contributor",
    "Flutter developer",
    "phishing detection OSINT",
  ],
  alternates: {
    canonical: SITE_URL,
  },
  category: "technology",
  openGraph: {
    title: "Muhammad Ishaq Khan (ishaq2321) — Software Engineer, ELTE",
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "Muhammad Ishaq Khan",
    locale: "en_US",
    type: "profile",
    firstName: "Muhammad Ishaq",
    lastName: "Khan",
    username: "ishaq2321",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Muhammad Ishaq Khan — Software Engineer, ELTE",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Muhammad Ishaq Khan (ishaq2321) — Software Engineer, ELTE",
    description: DESCRIPTION,
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
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
      className={`${fraunces.variable} ${hanken.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var theme = localStorage.getItem('theme');
                if (theme === 'light') {
                  document.documentElement.classList.add('light');
                } else {
                  document.documentElement.classList.remove('light');
                }
              })();
            `,
          }}
        />
        {config.goatcounter && (
          <script
            data-goatcounter={`https://${config.goatcounter}.goatcounter.com/count`}
            async
            src="//gc.zgo.at/count.js"
          />
        )}
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Muhammad Ishaq Khan",
              alternateName: ["ishaq2321", "Muhammad Ishaq", "Ishaq Muhammad"],
              url: SITE_URL,
              image: `${SITE_URL}/og.png`,
              jobTitle: "Software Engineer",
              description: DESCRIPTION,
              address: {
                "@type": "PostalAddress",
                addressLocality: "Budapest",
                addressCountry: "Hungary",
              },
              alumniOf: {
                "@type": "CollegeOrUniversity",
                name: "Eötvös Loránd University (ELTE)",
                sameAs: "https://www.elte.hu/en/",
              },
              knowsAbout: [
                "Software Engineering",
                "Flutter",
                "TypeScript",
                "Next.js",
                "Open Source",
                "OSINT",
                "Cybersecurity",
                "AST Code Intelligence",
              ],
              sameAs: [
                config.social?.github,
                config.social?.linkedin,
              ].filter(Boolean),
            }),
          }}
        />
        <MotionProvider>
          <a href="#main-content" className="skip-link">
            Skip to content
          </a>
          <ScrollProgress />
          <Nav />
          <div className="fixed bottom-6 right-6 z-50">
            <ThemeToggle />
          </div>
          <main id="main-content">{children}</main>
        </MotionProvider>
      </body>
    </html>
  );
}
