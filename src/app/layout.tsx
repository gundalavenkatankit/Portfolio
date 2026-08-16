import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Venkat Ankit Gundala | Full Stack Software Engineer",
  description: "Portfolio of Venkat Ankit Gundala, a full stack software engineer building reliable backend systems, AI products, and accessible interfaces.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
