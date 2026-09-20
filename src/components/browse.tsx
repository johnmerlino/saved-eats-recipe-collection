"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Dices, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { RecipeCard } from "@/components/recipe-card";
import type { Recipe } from "@/lib/types";

type KindFilter = "all" | "original" | "copycat" | "non_recipe";

const KIND_TABS: { value: KindFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "original", label: "Originals" },
  { value: "copycat", label: "Copycats" },
  { value: "non_recipe", label: "Archive" },
];

export function Browse({ recipes }: { recipes: Recipe[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<KindFilter>("all");
  const [cuisine, setCuisine] = useState("all");
  const [theme, setTheme] = useState("all");

  const cuisines = useMemo(
    () => [...new Set(recipes.map((r) => r.cuisine).filter(Boolean))].sort(),
    [recipes]
  );
  const themes = useMemo(
    () =>
      [...new Set(recipes.flatMap((r) => r.themes).filter(Boolean))].sort(),
    [recipes]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return recipes.filter((r) => {
      if (kind !== "all" && r.kind !== kind) return false;
      if (cuisine !== "all" && r.cuisine !== cuisine) return false;
      if (theme !== "all" && !r.themes.includes(theme)) return false;
      if (q) {
        const haystack = [
          r.title,
          r.originalTitle,
          r.username,
          r.cuisine,
          r.description,
          ...r.themes,
          ...r.ingredients,
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [recipes, query, kind, cuisine, theme]);

  const surpriseMe = () => {
    const pool = filtered.length > 0 ? filtered : recipes;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    if (pick) router.push(`/recipes/${pick.postId}`);
  };

  return (
    <div>
      {/* Search + filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search recipes, ingredients, creators…"
              className="pl-9"
            />
          </div>
          <Button onClick={surpriseMe} variant="secondary" className="shrink-0">
            <Dices className="size-4" />
            Surprise me
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {KIND_TABS.map((t) => (
            <Button
              key={t.value}
              variant={kind === t.value ? "default" : "outline"}
              size="sm"
              onClick={() => setKind(t.value)}
            >
              {t.label}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:max-w-md">
          <Select value={cuisine} onChange={(e) => setCuisine(e.target.value)}>
            <option value="all">All cuisines</option>
            {cuisines.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
          <Select value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option value="all">All themes</option>
            {themes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Results */}
      <p className="mb-4 text-sm text-muted-foreground">
        {filtered.length} {filtered.length === 1 ? "recipe" : "recipes"}
      </p>
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
          No recipes match your filters. Try clearing the search.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => (
            <RecipeCard key={r.postId} recipe={r} />
          ))}
        </div>
      )}
    </div>
  );
}
