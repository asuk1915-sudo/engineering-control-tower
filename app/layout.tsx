import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://engineering-control-tower.uthamkumar.info"),
  title: "Engineering Control Tower | Executive Portfolio Intelligence",
  description: "An explainable executive operating system for engineering portfolio health, constraints, decisions, and interventions. Synthetic public reference implementation.",
  applicationName: "Engineering Control Tower",
  openGraph: {
    title: "Engineering Control Tower",
    description: "See portfolio health. Find the constraint. Make the move.",
    type: "website",
    images: [{ url: "/og.png", width: 1536, height: 1024, alt: "Engineering Control Tower executive portfolio health preview" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Engineering Control Tower",
    description: "Executive portfolio intelligence for engineering organizations.",
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0b1020",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
