export type RecipeKind = "original" | "copycat" | "non_recipe";

export interface Substitute {
  name: string;
  url: string;
}

/** Row shape as it comes back from Supabase (JSON columns are stored as text). */
export interface RecipeRow {
  id: number;
  kind: RecipeKind;
  post_id: string;
  permalink: string;
  username: string;
  original_title: string;
  title: string;
  description: string;
  ingredients_json: string;
  instructions_json: string;
  cuisine: string;
  themes_json: string;
  substitutes_json: string;
  source: string;
}

export interface Recipe {
  id: number;
  kind: RecipeKind;
  postId: string;
  permalink: string;
  username: string;
  originalTitle: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cuisine: string;
  themes: string[];
  substitutes: Substitute[];
  source: string;
}

function parseJsonArray(raw: string): string[] {
  if (!raw) return [];
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function parseSubstitutes(raw: string): Substitute[] {
  if (!raw) return [];
  try {
    const v = JSON.parse(raw);
    if (!Array.isArray(v)) return [];
    return v
      .filter((x) => x && typeof x.name === "string" && typeof x.url === "string")
      .map((x) => ({ name: x.name as string, url: x.url as string }));
  } catch {
    return [];
  }
}

export function parseRecipe(row: RecipeRow): Recipe {
  return {
    id: row.id,
    kind: row.kind,
    postId: row.post_id,
    permalink: row.permalink,
    username: row.username,
    originalTitle: row.original_title,
    title: row.title,
    description: row.description,
    ingredients: parseJsonArray(row.ingredients_json),
    instructions: parseJsonArray(row.instructions_json),
    cuisine: row.cuisine,
    themes: parseJsonArray(row.themes_json),
    substitutes: parseSubstitutes(row.substitutes_json),
    source: row.source,
  };
}
