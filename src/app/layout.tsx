import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://venkat-ankit-gundala-portfolio.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Venkat Ankit Gundala | Full Stack Software Engineer",
    template: "%s | Venkat Ankit Gundala",
  },
  description: "Portfolio of Venkat Ankit Gundala, a full stack software engineer building reliable backend systems, AI products, and accessible interfaces.",
  keywords: [
    "Venkat Ankit Gundala",
    "full stack software engineer",
    "backend engineer",
    "AI systems",
    "Next.js developer",
    "React developer",
    "Java developer",
    "Python developer",
  ],
  authors: [{ name: "Venkat Ankit Gundala", url: siteUrl }],
  creator: "Venkat Ankit Gundala",
  category: "technology",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Venkat Ankit Gundala Portfolio",
    title: "Venkat Ankit Gundala | Full Stack Software Engineer",
    description: "Full stack software engineer building reliable backend systems, AI products, and accessible interfaces.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Venkat Ankit Gundala | Full Stack Software Engineer",
    description: "Full stack software engineer building reliable backend systems, AI products, and accessible interfaces.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Venkat Ankit Gundala",
  url: siteUrl,
  email: "mailto:gundalavenkatankit@gmail.com",
  jobTitle: "Full Stack Software Engineer",
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "University of Texas at Arlington",
  },
  sameAs: [
    "https://www.linkedin.com/in/gundalankit",
    "https://github.com/gundalavenkatankit",
  ],
  knowsAbout: [
    "Full stack software engineering",
    "Backend systems",
    "Artificial intelligence systems",
    "Accessible web applications",
    "Cloud infrastructure",
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        {children}
      </body>
    </html>
  );
}
