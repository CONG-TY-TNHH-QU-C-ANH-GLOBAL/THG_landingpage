import os
from PIL import Image

input_dir = 'src/assets/catalog'
output_dir = 'public/catalog/items'
ts_output = 'src/data/catalogData.ts'

os.makedirs(output_dir, exist_ok=True)

valid_files = sorted([f for f in os.listdir(input_dir) if f.endswith('.png')])
global_count = 1
items_data = []

for filename in valid_files:
    print(f"Processing {filename}...")
    img = Image.open(os.path.join(input_dir, filename))
    width, height = img.size
    columns = 5
    card_width = width // columns
    
    for c in range(columns):
        x = c * card_width
        box = (x, 0, x + card_width, height)
        cropped_img = img.crop(box)
        
        url_path = f'/catalog/items/card_{global_count:03d}.png'
        out_path = os.path.join(output_dir, f'card_{global_count:03d}.png')
        cropped_img.save(out_path)
        print(f"Saved {out_path}")
        
        # Determine dummy category based on index
        cat = "mens"
        if global_count > 20: cat = "womens"
        if global_count > 40: cat = "accessories"
        
        items_data.append(f'''  {{
    id: "item-{global_count}",
    name: "THG Legacy Product #{global_count}",
    category: "{cat}",
    basecost: 0.00,
    sku: "THG-LEGACY-{global_count:03d}",
    sizes: "Legacy",
    imageUrl: "{url_path}",
  }}''')
        
        global_count += 1

ts_content = f'''export interface CatalogItem {{
  id: string;
  name: string;
  category: "mens" | "womens" | "accessories";
  basecost: number;
  sku: string;
  sizes: string;
  imageUrl: string;
}}

export const catalogData: CatalogItem[] = [
{",\n".join(items_data)}
];
'''

with open(ts_output, 'w', encoding='utf-8') as f:
    f.write(ts_content)

print(f"Finished processing {global_count - 1} cards and generated catalogData.ts.")
