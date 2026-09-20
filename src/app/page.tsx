import { Browse } from "@/components/browse";
import { getSupabase } from "@/lib/supabase";
import { parseRecipe, type RecipeRow } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .order("title", { ascending: true });

  if (error) {
    return (
      <div className="rounded-xl border border-dashed p-12 text-center">
        <p className="font-semibold">Couldn&rsquo;t load recipes</p>
        <p className="mt-2 text-sm text-muted-foreground">
          The database isn&rsquo;t reachable right now. Please try again in a
          moment.
        </p>
      </div>
    );
  }

  const recipes = (data as RecipeRow[]).map(parseRecipe);
  const originals = recipes.filter((r) => r.kind === "original").length;
  const copycats = recipes.filter((r) => r.kind === "copycat").length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Saved Eats
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Every recipe from your Instagram Eats collection, in one searchable
          place — {originals} original creator recipes and {copycats} clearly
          labeled copycat reconstructions.
        </p>
      </div>
      <Browse recipes={recipes} />
    </div>
  );
}
