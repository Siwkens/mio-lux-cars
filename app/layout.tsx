import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MIO LUX CARS",
  description: "Wynajem samochodów sportowych i luksusowych w Warszawie.",
  other: { "codex-preview": "development" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pl"><body>{children}</body></html>;
}
