import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "HelpHub BD";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: `${APP_NAME} — Find trusted local services in Sherpur`,
    template: `%s | ${APP_NAME}`,
  },
  description:
    "Find verified electricians, plumbers, technicians, mechanics, tutors and many more trusted local service providers in Sherpur, Bogura, Dhaka and beyond. Honest reviews and easy service requests.",
  keywords: [
    "Sherpur service",
    "local services Bangladesh",
    "electrician Sherpur",
    "plumber Sherpur",
    "AC technician Sherpur",
    "tutor Sherpur",
    "HelpHub BD",
  ],
  openGraph: {
    title: `${APP_NAME} — Find trusted local services in Sherpur`,
    description:
      "Electrician, plumber, technician, mechanic, tutor and many more trusted service providers, all in one place.",
    url: APP_URL,
    siteName: APP_NAME,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} — Find trusted local services in Sherpur`,
    description:
      "Electrician, plumber, technician, mechanic, tutor and many more trusted service providers, all in one place.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}