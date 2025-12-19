import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ApplicationProvider } from "@/contexts/ApplicationContext";
import { Navigation } from "@/components/ui/Navigation";

export const metadata: Metadata = {
  title: "Job Application Tracker",
  description: "Track and manage your job applications with an interactive Kanban board",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-gray-50 dark:bg-gray-950 font-sans">
        <ThemeProvider>
          <ApplicationProvider>
            <Navigation />
            <main>{children}</main>
          </ApplicationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
