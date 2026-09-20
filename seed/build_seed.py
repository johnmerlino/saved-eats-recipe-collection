#!/usr/bin/env python3
"""Generate seed CSV + schema for the Saved Eats Supabase database.

Source of truth: ~/workspace/goals/food-recipes/hidden_files/
  - recipes_merged.json  -> 116 authoritative original recipes (source: caption | creator_website)
  - copycats_merged.json -> 226 clearly-badged copycat recipes (source: copycat)
  - archive (in recipes_merged.json) -> 227 archived posts; 226 already covered by
    copycats; the 1 without a copycat ('Happy meals day 11') becomes kind=non_recipe.
    The 2 copycat entries with no ingredients ('Buy and Pass', 'Untitled post')
    stay kind=copycat with empty ingredient/instruction lists (their descriptions
    explain they are not recipe posts).
"""
import csv, json, os

HERE = os.path.expanduser('~/workspace/goals/food-recipes/hidden_files')
rm = json.load(open(os.path.join(HERE, 'recipes_merged.json')))
cc = json.load(open(os.path.join(HERE, 'copycats_merged.json')))

def j(v):
    return json.dumps(v or [], ensure_ascii=False)

rows = []
for r in rm['recipes']:
    rows.append({
        'kind': 'original',
        'post_id': r['post_id'],
        'permalink': r.get('permalink', ''),
        'username': r.get('username', ''),
        'original_title': '',
        'title': r.get('title', ''),
        'description': '',
        'ingredients_json': j(r.get('ingredients')),
        'instructions_json': j(r.get('instructions')),
        'cuisine': r.get('cuisine', ''),
        'themes_json': j(r.get('themes')),
        'substitutes_json': j([]),
        'source': r.get('source', ''),
    })
for c in cc:
    rows.append({
        'kind': 'copycat',
        'post_id': c['post_id'],
        'permalink': c.get('permalink', ''),
        'username': c.get('username', ''),
        'original_title': c.get('original_title', ''),
        'title': c.get('title', ''),
        'description': c.get('description', ''),
        'ingredients_json': j(c.get('ingredients')),
        'instructions_json': j(c.get('instructions')),
        'cuisine': c.get('cuisine', ''),
        'themes_json': j(c.get('themes')),
        'substitutes_json': j(c.get('substitutes')),
        'source': c.get('source', ''),
    })
arch_ids = {c['post_id'] for c in cc}
for a in rm['archive']:
    if a['post_id'] not in arch_ids:
        rows.append({
            'kind': 'non_recipe',
            'post_id': a['post_id'],
            'permalink': a.get('permalink', ''),
            'username': a.get('username', ''),
            'original_title': a.get('title', ''),
            'title': a.get('title', ''),
            'description': ('No identifiable dish or retrievable recipe details were available '
                            'for this saved post. The original Instagram post is retained for browsing.'),
            'ingredients_json': j([]),
            'instructions_json': j([]),
            'cuisine': '',
            'themes_json': j([]),
            'substitutes_json': j([]),
            'source': 'archive',
        })

assert len({r['post_id'] for r in rows}) == len(rows), 'duplicate post_id!'
orig = sum(1 for r in rows if r['kind'] == 'original')
copy = sum(1 for r in rows if r['kind'] == 'copycat')
nonr = sum(1 for r in rows if r['kind'] == 'non_recipe')
print(f'rows: {len(rows)}  (original={orig}, copycat={copy}, non_recipe={nonr})')
assert orig == 116 and copy == 226 and nonr == 1, 'unexpected counts!'

out = os.path.expanduser('~/workspace/saved-eats-data/recipes.csv')
os.makedirs(os.path.dirname(out), exist_ok=True)
with open(out, 'w', newline='', encoding='utf-8') as f:
    w = csv.DictWriter(f, fieldnames=['kind','post_id','permalink','username','original_title',
        'title','description','ingredients_json','instructions_json','cuisine',
        'themes_json','substitutes_json','source'])
    w.writeheader(); w.writerows(rows)
print('wrote', out, f'{os.path.getsize(out)} bytes')
