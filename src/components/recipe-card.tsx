import Link from "next/link";
import { Camera } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import type { Recipe } from "@/lib/types";

export function KindBadge({ kind }: { kind: Recipe["kind"] }) {
  if (kind === "original")
    return <Badge variant="original">Original recipe</Badge>;
  if (kind === "copycat") return <Badge variant="copycat">Copycat</Badge>;
  return <Badge variant="archived">No recipe</Badge>;
}

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <Link href={`/recipes/${recipe.postId}`} className="block h-full">
      <Card className="flex h-full flex-col transition-shadow hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <KindBadge kind={recipe.kind} />
            {recipe.cuisine && (
              <Badge variant="secondary">{recipe.cuisine}</Badge>
            )}
          </div>
          <h3 className="text-lg font-semibold leading-snug">{recipe.title}</h3>
          {recipe.kind === "copycat" && recipe.originalTitle && (
            <p className="text-xs text-muted-foreground">
              Inspired by &ldquo;{recipe.originalTitle}&rdquo;
            </p>
          )}
        </CardHeader>
        <CardContent className="flex-1 pb-3">
          <p className="text-sm text-muted-foreground">@{recipe.username}</p>
          {recipe.themes.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {recipe.themes.slice(0, 4).map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Camera className="size-3.5" />
            View on Instagram
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
