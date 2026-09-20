import type { Metadata } from "next";
import { UtensilsCrossed } from "lucide-react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Saved Eats — Recipe Collection",
  description:
    "Every recipe from the Instagram Eats saved collection: original creator recipes and clearly labeled copycat reconstructions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <header className="border-b">
          <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-4">
            <UtensilsCrossed className="size-5 text-primary" />
            <span className="text-lg font-bold tracking-tight">Saved Eats</span>
            <span className="text-sm text-muted-foreground">
              recipe collection
            </span>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        <footer className="border-t">
          <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-muted-foreground">
            Copycats are clearly labeled reconstructions inspired by saved
            posts, kept separate from creator-authored recipes.
          </div>
        </footer>
      </body>
    </html>
  );
}
