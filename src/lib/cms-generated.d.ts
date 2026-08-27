/**
 * THIS FILE IS AUTO-GENERATED — DO NOT EDIT BY HAND.
 *
 * Source:  https://cms.thgfulfill.com/api/v1/openapi
 * Run:     bun run generate:cms-types
 * CI:      bun run check:cms-types  (added in D3.3)
 *
 * Manual edits will be overwritten on next regeneration. To change a type,
 * change the backend OpenAPI annotation (cmsthgfulfill/src/openapi/paths.ts)
 * and re-register the schema in cmsthgfulfill/src/features/<f>/<f>.schemas.ts.
 */

export interface paths {
    "/api/v1/faqs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List FAQs for a locale and scope
         * @description VI reads from `faqs`; EN/ZH JOINs `faq_translations` filtered to `status='reviewed'`. Unreviewed rows are omitted (no cross-locale fallback). Landing's static i18n.tsx covers gaps.
         */
        get: {
            parameters: {
                query?: {
                    lang?: "en" | "vi" | "zh";
                    scope?: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description FAQ list */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {string} */
                            locale: "en" | "vi" | "zh";
                            scope: string;
                            faqs: {
                                id: number;
                                position: number;
                                question: string;
                                answer: string;
                            }[];
                        };
                    };
                };
                /** @description Invalid `lang` query parameter */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/testimonials": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List testimonials for a locale
         * @description VI reads from `testimonials`; EN/ZH JOINs `testimonial_translations` filtered to `status='reviewed'`. Per-row `locale` is stripped from the response item — the wrapper's `locale` field carries it instead.
         */
        get: {
            parameters: {
                query?: {
                    lang?: "en" | "vi" | "zh";
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Testimonial list */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {string} */
                            locale: "en" | "vi" | "zh";
                            testimonials: {
                                id: number;
                                position: number;
                                quote: string;
                                author_name: string;
                                author_role: string | null;
                                avatar_media_id: number | null;
                            }[];
                        };
                    };
                };
                /** @description Invalid `lang` query parameter */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/contact-locations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List contact locations for a locale
         * @description Locations include offices, warehouses, and external channels (phone, email, website). Filtered to the requested locale server-side.
         */
        get: {
            parameters: {
                query?: {
                    lang?: "en" | "vi" | "zh";
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Contact locations */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {string} */
                            locale: "en" | "vi" | "zh";
                            locations: {
                                id: number;
                                position: number;
                                /** @enum {string} */
                                kind: "office" | "warehouse" | "phone" | "email" | "website";
                                label: string;
                                address: string | null;
                                phone: string | null;
                                url: string | null;
                                lang_class: string | null;
                            }[];
                        };
                    };
                };
                /** @description Invalid `lang` query parameter */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/integrations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List logistics / platform integrations
         * @description Returns the marquee/logo list of integration partners shown on landing. Sorted by `position`. Not localized.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Integration list */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            integrations: {
                                id: number;
                                position: number;
                                name: string;
                                url: string | null;
                                color_class: string | null;
                                logo_media_id: number | null;
                            }[];
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/partners": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List THG business partners
         * @description Returns live partner rows sorted by `position`. Not localized — rows are company names and URLs. `logo_url` is a fully-resolved absolute URL, or null when no logo is set. Draft partners are never returned.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Partner list */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            partners: {
                                id: number;
                                position: number;
                                name: string;
                                logo_url: string | null;
                                url: string | null;
                                tier: string | null;
                            }[];
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/translations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get the i18n dictionary for a locale
         * @description Returns `Record<string, string>` of all reviewed translation keys for the locale. `lang` is required — omitting it produces a 400.
         */
        get: {
            parameters: {
                query: {
                    lang: "en" | "vi" | "zh";
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Translation dictionary */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {string} */
                            locale: "en" | "vi" | "zh";
                            translations: {
                                [key: string]: string;
                            };
                        };
                    };
                };
                /** @description Missing or invalid `lang` query parameter */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/blog": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List blog posts for a locale
         * @description Status=`live` only (drafts and archived are filtered server-side). VI reads from `blog_posts`; EN/ZH JOINs locale-specific rows. Optional `category` filter is applied client-side after fetch.
         */
        get: {
            parameters: {
                query?: {
                    lang?: "en" | "vi" | "zh";
                    category?: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Blog post summary list (live posts only) */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {string} */
                            locale: "en" | "vi" | "zh";
                            posts: {
                                slug: string;
                                title: string;
                                excerpt: string | null;
                                thumbnail_url: string | null;
                                category: string | null;
                                published_date: string | null;
                                updated_at: number;
                            }[];
                            total: number;
                        };
                    };
                };
                /** @description Invalid `lang` query parameter */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/blog/{slug}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get one blog post by slug for a locale
         * @description Returns post + slides[]. 404 if slug+locale combination not found, or if the post status is not `live`. Slide order is preserved from the database `position` column.
         */
        get: {
            parameters: {
                query?: {
                    lang?: "en" | "vi" | "zh";
                };
                header?: never;
                path: {
                    slug: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Blog post detail with slides */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {string} */
                            locale: "en" | "vi" | "zh";
                            post: {
                                slug: string;
                                title: string;
                                excerpt: string | null;
                                thumbnail_url: string | null;
                                category: string | null;
                                published_date: string | null;
                                seo_title: string | null;
                                seo_description: string | null;
                                body_md: string | null;
                                updated_at: number;
                                slides: {
                                    src: string;
                                    alt_text: string;
                                }[];
                            };
                        };
                    };
                };
                /** @description Invalid `lang` query parameter */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: string;
                        };
                    };
                };
                /** @description Post not found or not published */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/marquee-images": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List marquee images shown in the landing logo strip
         * @description Returns the sorted marquee image list. Not localized. `src` is resolved server-side via INNER JOIN against the media table.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Marquee image list */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            images: {
                                id: number;
                                position: number;
                                src: string;
                                alt_text: string;
                            }[];
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/jobs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List open job postings for a locale
         * @description Status=`open` only (drafts/closed/archived filtered server-side). Optional `category` query narrows the list. `hot` is coerced from the DB integer column to boolean (handler line: `j.hot === 1`).
         */
        get: {
            parameters: {
                query?: {
                    lang?: "en" | "vi" | "zh";
                    category?: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Job summary list (open jobs only) */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {string} */
                            locale: "en" | "vi" | "zh";
                            jobs: {
                                slug: string;
                                position: number;
                                category: string | null;
                                hot: boolean;
                                badge: string | null;
                                tagline: string | null;
                                title: string;
                                location: string | null;
                                employment_type: string | null;
                                salary: string | null;
                                salary_unit: string | null;
                                salary_note: string | null;
                                deadline: string | null;
                                experience: string | null;
                                posted_at: number;
                            }[];
                            total: number;
                        };
                    };
                };
                /** @description Invalid `lang` query parameter */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/jobs/{slug}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get one job posting by slug for a locale
         * @description Returns the full job detail with parsed JSON-string columns materialized into structured fields (responsibilities, requirements, benefits, bonuses). 404 if slug+locale not found, or if status≠open.
         */
        get: {
            parameters: {
                query?: {
                    lang?: "en" | "vi" | "zh";
                };
                header?: never;
                path: {
                    slug: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Job detail with parsed JSON fields */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {string} */
                            locale: "en" | "vi" | "zh";
                            job: {
                                slug: string;
                                category: string | null;
                                hot: boolean;
                                badge: string | null;
                                tagline: string | null;
                                title: string;
                                body_md: string;
                                location: string | null;
                                employment_type: string | null;
                                salary: string | null;
                                salary_unit: string | null;
                                salary_note: string | null;
                                deadline: string | null;
                                experience: string | null;
                                posted_at: number;
                                lead: string | null;
                                responsibilities: {
                                    [key: string]: string[];
                                };
                                requirements: string[];
                                benefits: {
                                    i: string;
                                    t: string;
                                    d: string;
                                }[];
                                bonuses: string[];
                            };
                        };
                    };
                };
                /** @description Invalid `lang` query parameter */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: string;
                        };
                    };
                };
                /** @description Job not found or not open */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/services": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List services for a locale (flat per-locale projection)
         * @description Returns each service flattened with i18n applied for the requested locale. gallery[] and products[] media_id references are hydrated to resolved URLs server-side. Archived services are filtered out.
         */
        get: {
            parameters: {
                query?: {
                    lang?: "en" | "vi" | "zh";
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Service list (draft + live) */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {string} */
                            locale: "en" | "vi" | "zh";
                            services: {
                                id: string;
                                position: number;
                                icon: string | null;
                                /** @enum {string} */
                                status: "draft" | "live" | "archived";
                                name: string;
                                tagline: string | null;
                                hero_eyebrow: string | null;
                                hero_title: string | null;
                                hero_sub: string | null;
                                cta_text: string | null;
                                cta_url: string | null;
                                body_md: string | null;
                                bullets: string[];
                                gallery: {
                                    url?: string;
                                    media_id?: number;
                                    alt?: string;
                                }[];
                                videos: {
                                    youtube_id: string;
                                    caption_key?: string;
                                    caption?: string;
                                    thumb?: string;
                                }[];
                                products: {
                                    name: string;
                                    price?: string;
                                    time?: string;
                                    origin?: string;
                                    image?: string;
                                    media_id?: number;
                                }[];
                            }[];
                        };
                    };
                };
                /** @description Invalid `lang` query parameter */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/homepage": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get homepage blocks for a locale
         * @description Returns the ordered list of homepage blocks (hero, trust, services_grid, etc.) with their string-keyed payload maps. EN/ZH JOIN homepage_block_translations filtered to status='reviewed'.
         */
        get: {
            parameters: {
                query?: {
                    lang?: "en" | "vi" | "zh";
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Homepage block list */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {string} */
                            locale: "en" | "vi" | "zh";
                            blocks: {
                                id: number;
                                /** @enum {string} */
                                kind: "hero" | "trust" | "services_grid" | "about_video" | "marquee" | "sellers" | "process" | "advantages" | "integrations" | "testimonials" | "faq" | "contact";
                                position: number;
                                payload: {
                                    [key: string]: string;
                                };
                                /** @enum {string} */
                                locale: "en" | "vi" | "zh";
                            }[];
                        };
                    };
                };
                /** @description Invalid `lang` query parameter */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/site-settings": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get global site settings (singleton)
         * @description Returns the singleton site-settings document with brand info, tracking IDs, contact details, and parsed remote_area_links / terminology arrays. `settings` is null when the row is missing.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Site settings document or null */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            settings: {
                                brand_name: string;
                                ga4_id: string | null;
                                gtm_id: string | null;
                                fb_pixel_id: string | null;
                                tiktok_pixel_id: string | null;
                                contact_phone: string | null;
                                contact_email: string | null;
                                facebook_url: string | null;
                                logo_media_id: number | null;
                                default_og_image_id: number | null;
                                about_video_url: string | null;
                                og_image_url: string | null;
                                remote_area_links: {
                                    label: string;
                                    icon?: string;
                                    url: string;
                                }[];
                                terminology: unknown[];
                            } | null;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/pricing": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List pricing tables grouped by category
         * @description Returns all pricing tables grouped into categories inferred from slug. Each entry is a summary (no schema/data blobs) — fetch the detail endpoint for full table content.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Pricing categories + table summaries */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            categories: {
                                name: string;
                                tables: {
                                    id: number;
                                    slug: string;
                                    name: string;
                                    /** @enum {string} */
                                    kind: "weight_grid" | "meta_kv";
                                    version: number;
                                    /** @enum {string} */
                                    status: "draft" | "live" | "archived";
                                    updated_at: number;
                                    row_count: number;
                                    col_count: number;
                                }[];
                            }[];
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/pricing/{slug}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get one pricing table by slug
         * @description Returns the full pricing table including parsed schema + data blobs. 404 if slug not found. Parse failures on schema_json or data_json produce `null` for the affected field rather than the whole table — consumers should defend against partial payloads.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    slug: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Pricing table detail */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            table: {
                                id: number;
                                slug: string;
                                name: string;
                                /** @enum {string} */
                                kind: "weight_grid" | "meta_kv";
                                description: string | null;
                                schema?: unknown;
                                data?: unknown;
                                version: number;
                                /** @enum {string} */
                                status: "draft" | "live" | "archived";
                                updated_at: number;
                            };
                        };
                    };
                };
                /** @description No pricing table with given slug */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/policies": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List policies for a locale
         * @description Returns the ordered list of policy summaries for the given locale. Each entry has slug, title, icon, mode (image|text), summary, position — no body_md or full content. Fetch the detail endpoint for full policy text.
         */
        get: {
            parameters: {
                query?: {
                    lang?: "en" | "vi" | "zh";
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Policy summary list */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {string} */
                            locale: "en" | "vi" | "zh";
                            policies: {
                                slug: string;
                                title: string;
                                icon: string | null;
                                /** @enum {string} */
                                mode: "image" | "text";
                                summary: string | null;
                                position: number;
                            }[];
                        };
                    };
                };
                /** @description Invalid `lang` query parameter */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/policies/{slug}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get one policy by slug for a locale
         * @description Returns the full policy including body_md (markdown) and parsed image_list + text_blocks arrays. 404 if slug+locale not found.
         */
        get: {
            parameters: {
                query?: {
                    lang?: "en" | "vi" | "zh";
                };
                header?: never;
                path: {
                    slug: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Policy detail */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {string} */
                            locale: "en" | "vi" | "zh";
                            policy: {
                                slug: string;
                                title: string;
                                icon: string | null;
                                /** @enum {string} */
                                mode: "image" | "text";
                                body_md: string;
                                image_list: string[];
                                text_blocks: {
                                    /** @enum {string} */
                                    type: "normal" | "warn" | "info";
                                    heading: string;
                                    content: string[];
                                }[];
                                summary: string | null;
                                position: number;
                                updated_at: number;
                                version: number;
                            };
                        };
                    };
                };
                /** @description Invalid `lang` query parameter */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: string;
                        };
                    };
                };
                /** @description Policy not found in locale */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/community/questions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List published community questions
         * @description Published questions only — pending/rejected never leave the CMS. `indexable` is computed server-side (published AND verified AND has expert answer — see community.policy.ts); landing derives its noindex rule from it. Optional `category` filters by category slug.
         */
        get: {
            parameters: {
                query?: {
                    category?: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Published question summary list */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            questions: {
                                slug: string;
                                title: string;
                                excerpt: string;
                                category: {
                                    slug: string;
                                    name: string;
                                } | null;
                                has_expert_answer: boolean;
                                verified: boolean;
                                indexable: boolean;
                                same_issue_count: number;
                                published_at: number | null;
                            }[];
                        };
                    };
                };
            };
        };
        put?: never;
        /**
         * Submit a community question for moderation
         * @description Every submission enters moderation: the response `status` is always `pending` and the question is absent from the public list until an operator publishes it. `owner_token` is returned ONCE here and never again — the client stores it to enable self-service withdrawal. Protected by Turnstile and a 5-per-IP-per-hour rate limit.
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": {
                        title: string;
                        body: string;
                        category_slug?: string | null;
                        author_name: string;
                        /** Format: email */
                        author_email: string;
                        /** @enum {string|null} */
                        locale?: "en" | "vi" | "zh" | null;
                        utm?: {
                            [key: string]: string;
                        } | null;
                        turnstile_token: string;
                    };
                };
            };
            responses: {
                /** @description Question accepted; awaiting moderation */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            ok: true;
                            id: number;
                            slug: string;
                            /** @enum {string} */
                            status: "pending";
                            owner_token: string;
                        };
                    };
                };
                /** @description Malformed JSON or field validation failure */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: string;
                        };
                    };
                };
                /** @description Turnstile verification failed */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: string;
                        };
                    };
                };
                /** @description Rate limit exceeded (5 per IP per hour) */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/community/questions/{slug}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get one published community question by slug
         * @description 404 unless the question status is `published`. Includes the THG expert answer (nullable) and the computed `indexable` flag.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    slug: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Published question detail */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            question: {
                                slug: string;
                                title: string;
                                body: string;
                                category: {
                                    slug: string;
                                    name: string;
                                } | null;
                                author_name: string;
                                expert_answer: string | null;
                                expert_answer_updated_at: number | null;
                                verified: boolean;
                                indexable: boolean;
                                same_issue_count: number;
                                published_at: number | null;
                            };
                        };
                    };
                };
                /** @description Question not found or not published */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/community/categories": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List community categories
         * @description Ordered category list used for filtering and the ask-question form.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Category list */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            categories: {
                                slug: string;
                                name: string;
                                position: number;
                            }[];
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/community/reviews": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List published community reviews
         * @description Published reviews only — pending/rejected/withdrawn never leave the CMS. `indexable` is computed server-side (published AND verified AND non-thin body — see community.policy.ts); landing derives its noindex rule from it. Optional `category` filters by category slug.
         */
        get: {
            parameters: {
                query?: {
                    category?: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Published review summary list */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            reviews: {
                                slug: string;
                                title: string;
                                excerpt: string;
                                category: {
                                    slug: string;
                                    name: string;
                                } | null;
                                rating: number | null;
                                verified: boolean;
                                indexable: boolean;
                                published_at: number | null;
                            }[];
                        };
                    };
                };
            };
        };
        put?: never;
        /**
         * Submit a community review for moderation
         * @description Same moderation contract as question submission: `status` is always `pending`, and `owner_token` is returned only on this response. `private_evidence_note` and `private_order_reference` are accepted as operator-only context and are never echoed on a public read. Protected by Turnstile and a 5-per-IP-per-hour rate limit.
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": {
                        title: string;
                        body: string;
                        category_slug?: string | null;
                        reviewer_name: string;
                        /** Format: email */
                        reviewer_email: string;
                        rating?: number | null;
                        /** @enum {string|null} */
                        locale?: "en" | "vi" | "zh" | null;
                        private_evidence_note?: string | null;
                        private_order_reference?: string | null;
                        utm?: {
                            [key: string]: string;
                        } | null;
                        turnstile_token: string;
                    };
                };
            };
            responses: {
                /** @description Review accepted; awaiting moderation */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            ok: true;
                            id: number;
                            slug: string;
                            /** @enum {string} */
                            status: "pending";
                            owner_token: string;
                        };
                    };
                };
                /** @description Malformed JSON or field validation failure */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: string;
                        };
                    };
                };
                /** @description Turnstile verification failed */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: string;
                        };
                    };
                };
                /** @description Rate limit exceeded (5 per IP per hour) */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/community/reviews/{slug}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get one published community review by slug
         * @description 404 unless the review status is `published` and not withdrawn. Includes the optional operator `public_summary`, `rating` and the computed `indexable` flag.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    slug: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Published review detail */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            review: {
                                slug: string;
                                title: string;
                                body: string;
                                category: {
                                    slug: string;
                                    name: string;
                                } | null;
                                reviewer_name: string;
                                rating: number | null;
                                public_summary: string | null;
                                verified: boolean;
                                indexable: boolean;
                                published_at: number | null;
                            };
                        };
                    };
                };
                /** @description Review not found or not published */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/service-blocks": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List page blocks for one page and locale
         * @description Returns generic blocks (pain_point, process_step, solution, shipping_lane, policy, stat, …) for one `page_slug` + locale, ordered by `position`. Omit `kind` to hydrate every section of a page in one request; the response echoes the filter as `kind` (null when omitted). VI reads `service_blocks`; EN/ZH JOIN `service_block_translations` filtered to `status='reviewed'` — no cross-locale fallback. FAIL-SAFE: a row whose `payload_json` is malformed is returned with `payload: {}` rather than being dropped or failing the request.
         */
        get: {
            parameters: {
                query: {
                    page_slug: string;
                    lang?: "en" | "vi" | "zh";
                    kind?: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Ordered block list for the page + locale */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {string} */
                            locale: "en" | "vi" | "zh";
                            page_slug: string;
                            kind: string | null;
                            blocks: {
                                id: number;
                                kind: string;
                                position: number;
                                icon: string | null;
                                title: string | null;
                                description: string | null;
                                payload: {
                                    [key: string]: unknown;
                                };
                            }[];
                        };
                    };
                };
                /** @description Invalid `lang`, or missing required `page_slug` */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/blog/categories": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List distinct blog categories for a locale
         * @description Distinct non-null `category` values across live posts, sorted by the database. `lang` defaults to **vi** on this endpoint. An empty array is a valid response, not an error.
         */
        get: {
            parameters: {
                query?: {
                    lang?: "en" | "vi" | "zh";
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Category list */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {string} */
                            locale: "en" | "vi" | "zh";
                            categories: string[];
                        };
                    };
                };
                /** @description Invalid `lang` query parameter */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/shipping-routes": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List live shipping routes for a locale
         * @description Unpaginated: returns every `status='live'` route for the locale, ordered by (position, slug). `total` is the length of `routes` in the same response — it is NOT a pagination total. EN/ZH require a `status='reviewed'` translation; there is no cross-locale fallback.
         */
        get: {
            parameters: {
                query?: {
                    lang?: "en" | "vi" | "zh";
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Live shipping-route summaries */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {string} */
                            locale: "en" | "vi" | "zh";
                            routes: {
                                slug: string;
                                position: number;
                                title: string;
                                origin: string | null;
                                destination: string | null;
                                kind: string | null;
                            }[];
                            total: number;
                        };
                    };
                };
                /** @description Invalid `lang` query parameter */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/shipping-routes/{slug}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get one live shipping route by slug
         * @description 404 unless the route resolves in the requested locale AND its status is `live`. Rate tables are resolved by (slug, locale). FAIL-SAFE: a malformed `notes_json` / `columns_json` / `rows_json` blob degrades to an empty array instead of failing the request.
         */
        get: {
            parameters: {
                query?: {
                    lang?: "en" | "vi" | "zh";
                };
                header?: never;
                path: {
                    slug: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Shipping route detail with rate tables */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {string} */
                            locale: "en" | "vi" | "zh";
                            route: {
                                slug: string;
                                position: number;
                                title: string;
                                origin: string | null;
                                destination: string | null;
                                kind: string | null;
                                body_md: string | null;
                                notes: string[];
                                tables: {
                                    caption: string | null;
                                    columns: {
                                        key: string;
                                        label: string;
                                    }[];
                                    rows: {
                                        [key: string]: string | number | null;
                                    }[];
                                }[];
                                updated_at: number;
                            };
                        };
                    };
                };
                /** @description Invalid `lang` query parameter */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: string;
                        };
                    };
                };
                /** @description No live shipping route with that slug in the locale */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: string;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/sitemap": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List live page routes and blog slugs for sitemap generation
         * @description Feed for the landing's sitemap builder. Returns every `status='live'` row across ALL locales; the consumer groups by `locale`. Takes no parameters. `locale` is an unconstrained string here because the column carries no CHECK constraint in D1.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Live routes and blog slugs across every locale */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            pages: {
                                route: string;
                                locale: string;
                                updated_at: number;
                            }[];
                            blog: {
                                slug: string;
                                locale: string;
                                published_date: string | null;
                                updated_at: number;
                            }[];
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/leads": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Submit a multi-intent lead
         * @description Multi-intent by design: an optional `primary_service`, zero or more `service_interests`, and per-service `service_details`. Cross-field rules enforced beyond the field schema: `service_interests` must not contain duplicates; `primary_service`, when set, must be a member of `service_interests`; each `service_details` key must be a selected interest and validates against that service's strict schema. Interests are persisted in a deterministic order (primary first, then canonical registry order) — never client submission order. Protected by Turnstile and a 10-per-IP-per-hour rate limit. No provider or database error is ever surfaced; failures use the bounded `{ error }` envelope.
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": {
                        name: string;
                        /** Format: email */
                        email: string;
                        phone?: string | null;
                        message?: string | null;
                        source_page?: string | null;
                        /** @enum {string|null} */
                        locale?: "en" | "vi" | "zh" | null;
                        utm?: {
                            [key: string]: string;
                        } | null;
                        /** @enum {string|null} */
                        primary_service?: "fulfill" | "express" | "warehouse" | "dropship" | null;
                        service_interests?: ("fulfill" | "express" | "warehouse" | "dropship")[] | null;
                        service_details?: {
                            [key: string]: {
                                [key: string]: unknown;
                            };
                        } | null;
                        /** @enum {string|null} */
                        surface?: "global-services-dialog" | "fulfill-inline" | "express-inline" | "warehouse-inline" | "dropship-inline" | "home-conversion-inline" | null;
                        turnstile_token: string;
                    };
                };
            };
            responses: {
                /** @description Lead accepted and persisted */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            ok: true;
                            id: number;
                        };
                    };
                };
                /** @description Malformed JSON, or a field/cross-field validation failure */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: string;
                        };
                    };
                };
                /** @description Turnstile verification failed */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: string;
                        };
                    };
                };
                /** @description Rate limit exceeded (10 per IP per hour) */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/applicants": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Submit a job application
         * @description Validates that the job exists and is open before accepting. A job whose deadline has passed is treated as closed (410) even when its status is still `open`. Protected by Turnstile and a stricter 5-per-IP-per-hour rate limit than leads. Upload the CV first via POST /api/v1/applicant-cv and pass the returned URL as `cv_url`. That URL requires an authenticated CMS session to read.
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": {
                        job_slug: string;
                        name: string;
                        /** Format: email */
                        email: string;
                        phone?: string | null;
                        /** Format: uri */
                        cv_url?: string | null;
                        cover_letter?: string | null;
                        /** @enum {string} */
                        locale: "en" | "vi" | "zh";
                        source_page?: string | null;
                        utm?: {
                            [key: string]: string;
                        } | null;
                        turnstile_token: string;
                    };
                };
            };
            responses: {
                /** @description Application accepted and persisted */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            ok: true;
                            id: number;
                        };
                    };
                };
                /** @description Malformed JSON or field validation failure */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: string;
                        };
                    };
                };
                /** @description Turnstile verification failed */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: string;
                        };
                    };
                };
                /** @description Job does not exist or is not open */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: string;
                        };
                    };
                };
                /** @description Application deadline has passed */
                410: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: string;
                        };
                    };
                };
                /** @description Rate limit exceeded (5 per IP per hour) */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/applicant-cv": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Upload an applicant CV and get its URL
         * @description Accepts `multipart/form-data` with a single `file` field: PDF, DOC or DOCX, at most 10MB. Returns an AUTHENTICATED retrieval URL to pass as `cv_url` on POST /api/v1/applicants — it is not a public link and not a bearer URL: reading the CV requires a CMS session, and the public media proxy refuses the applicant namespace. Rate limited to 5 uploads per IP per hour.
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "multipart/form-data": {
                        /** Format: binary */
                        file: string;
                    };
                };
            };
            responses: {
                /** @description CV stored; URL returned */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            ok: true;
                            url: string;
                            filename: string;
                            size: number;
                        };
                    };
                };
                /** @description Body is not multipart/form-data, or `file` is missing */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: string;
                        };
                    };
                };
                /** @description File exceeds the 10MB limit */
                413: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: string;
                        };
                    };
                };
                /** @description Unsupported file type (only PDF, DOC, DOCX) */
                415: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: string;
                        };
                    };
                };
                /** @description Rate limit exceeded (5 per IP per hour) */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/community/questions/{slug}/same-issue": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * React same-issue to a published question
         * @description Idempotent per client: the hashed client IP is the dedupe identity, so a repeat reaction answers 200 with `deduped: true` and an unchanged count. No Turnstile (one-click UX), so a request whose client IP cannot be determined is refused with 400 rather than pooled into a shared bucket. Rate limited to 30 per IP per hour. Takes no body.
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    slug: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Reaction recorded, or already present (`deduped: true`) */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            ok: true;
                            same_issue_count: number;
                            deduped: boolean;
                        };
                    };
                };
                /** @description Client IP could not be determined */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: string;
                        };
                    };
                };
                /** @description No published question with that slug */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: string;
                        };
                    };
                };
                /** @description Rate limit exceeded (30 per IP per hour) */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/community/questions/{slug}/withdraw": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Withdraw your own question using its owner token
         * @description The owner token issued at submission is the only authorization. An invalid token is answered with the SAME generic 404 as a missing slug — deliberately indistinguishable, so the endpoint cannot be used to probe which slugs exist. Rate limited to 20 per IP per hour.
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    slug: string;
                };
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": {
                        ownerToken: string;
                    };
                };
            };
            responses: {
                /** @description Question withdrawn */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            ok: true;
                            /** @enum {boolean} */
                            withdrawn: true;
                        };
                    };
                };
                /** @description Malformed JSON or missing `ownerToken` */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: string;
                        };
                    };
                };
                /** @description Unknown slug or wrong owner token (indistinguishable) */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: string;
                        };
                    };
                };
                /** @description Rate limit exceeded (20 per IP per hour) */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/community/reviews/{slug}/withdraw": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Withdraw your own review using its owner token
         * @description Identical semantics to the question withdraw endpoint: owner token is the only authorization, and a wrong token is indistinguishable from a missing slug (generic 404). Rate limited to 20 per IP per hour.
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    slug: string;
                };
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": {
                        ownerToken: string;
                    };
                };
            };
            responses: {
                /** @description Review withdrawn */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @enum {boolean} */
                            ok: true;
                            /** @enum {boolean} */
                            withdrawn: true;
                        };
                    };
                };
                /** @description Malformed JSON or missing `ownerToken` */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: string;
                        };
                    };
                };
                /** @description Unknown slug or wrong owner token (indistinguishable) */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: string;
                        };
                    };
                };
                /** @description Rate limit exceeded (20 per IP per hour) */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: never;
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export type operations = Record<string, never>;
