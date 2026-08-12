// The products the Fulfill page shows as proof of capability.
//
// This list is the ONLY thing about those cards that is authored here. Name, image, origin,
// price and lead time are read live from the Hub at render/ISR time — so this file cannot drift
// from the catalog, and a product renamed or repriced on the Hub is renamed and repriced here
// with no code change.
//
// Why ids and not a hand-written card model: a card that hardcodes a name and an image is a
// brochure, and a brochure goes stale silently. The section's job is to let a seller see that
// THG can fulfill the exact SKU they sell, which is only true if the card IS the SKU. Every id
// below was verified to resolve on hub.thgfulfill.com; an id that stops resolving drops its
// card (loadFeaturedProducts filters 404s) rather than rendering a dead deep link.
//
// ponytail: a code-owned list because the CMS `thg-fulfill` service publishes an empty
// `products` array today. When it starts publishing product ids, the mapper feeds them in and
// this becomes the fallback — the loader already prefers CMS ids when present.

export const FULFILL_FEATURED_PRODUCT_IDS: readonly string[] = [
  // 180 g milk thread women's heat transfer T-shirt - Double-sided (Apparel, PH)
  "cmqv14yj601su01mmvr3whrk8",
  // 15oz Mug (Drinkware, CA)
  "6b681ed2-e9e3-4517-b787-8931fe298b5a",
  // All-Over Print Fleece Pajama Pants (Apparel, VN)
  "3b1f08a7-4ca1-43d4-94df-1bd6ec07a70e",
];
