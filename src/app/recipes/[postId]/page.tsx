import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Camera } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KindBadge } from "@/components/recipe-card";
import { getSupabase } from "@/lib/supabase";
import { parseRecipe, type RecipeRow } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function RecipePage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("post_id", postId)
    .single<RecipeRow>();

  if (error || !data) notFound();
  const recipe = parseRecipe(data);

  const sourceLabel =
    recipe.kind === "original"
      ? recipe.source === "creator_website"
        ? "Taken from the creator's own website"
        : "Taken from the post caption"
      : null;

  return (
    <div className="mx-auto max-w-3xl">
      <Button variant="ghost" size="sm" asChild className="mb-6 -ml-2">
        <Link href="/">
          <ArrowLeft className="size-4" />
          Back to recipes
        </Link>
      </Button>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <KindBadge kind={recipe.kind} />
        {recipe.cuisine && <Badge variant="secondary">{recipe.cuisine}</Badge>}
        {recipe.themes.map((t) => (
          <Badge key={t} variant="outline">
            {t}
          </Badge>
        ))}
      </div>

      <h1 className="mb-2 text-3xl font-bold tracking-tight">{recipe.title}</h1>
      <p className="mb-6 text-muted-foreground">
        by @{recipe.username}
        {recipe.kind === "copycat" && recipe.originalTitle && (
          <>
            {" "}&middot; inspired by &ldquo;{recipe.originalTitle}&rdquo;
          </>
        )}
      </p>

      {recipe.kind === "copycat" && (
        <Card className="mb-6 border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/40">
          <CardContent className="pt-6 text-sm">
            <p className="font-semibold">Copycat reconstruction</p>
            <p className="mt-1 text-muted-foreground">
              This is an original reconstruction inspired by the saved post —
              the creator&rsquo;s exact recipe wasn&rsquo;t available, so this
              version was written to capture the dish. It&rsquo;s kept clearly
              separate from the creator-authored recipes.
            </p>
          </CardContent>
        </Card>
      )}

      {recipe.kind === "original" && sourceLabel && (
        <p className="mb-6 text-sm text-muted-foreground italic">{sourceLabel}.</p>
      )}

      {recipe.description && (
        <p className="mb-6 leading-relaxed">{recipe.description}</p>
      )}

      {recipe.kind === "non_recipe" ? (
        <Card>
          <CardHeader>
            <CardTitle>No recipe available</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{recipe.description}</p>
            <Button asChild>
              <a
                href={recipe.permalink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Camera className="size-4" />
                View original post on Instagram
              </a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-5">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Ingredients</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i}>{ing}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle className="text-lg">Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal space-y-3 pl-5 text-sm leading-relaxed">
                {recipe.instructions.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>
      )}

      {recipe.substitutes.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Similar recipes online</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {recipe.substitutes.map((s, i) => (
                <li key={i}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-primary hover:underline"
                  >
                    {s.name}
                    <ExternalLink className="size-3.5" />
                  </a>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <div className="mt-8">
        <Button variant="outline" asChild>
          <a href={recipe.permalink} target="_blank" rel="noopener noreferrer">
            <Camera className="size-4" />
            Original Instagram post
          </a>
        </Button>
      </div>
    </div>
  );
}
