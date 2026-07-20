import type { CmsCategoriesResponse } from "../schemas/categories";
import type { CommunityCategory } from "../models/category";

/** CMS order is `position ASC, id ASC`; sorting here keeps display order independent
 *  of transport order. `position` is an ordering key only and is dropped from the model. */
export function categoriesFromDto(dto: CmsCategoriesResponse): CommunityCategory[] {
  return dto.categories
    .slice()
    .sort((a, b) => a.position - b.position)
    .map((c) => ({ slug: c.slug, name: c.name }));
}
