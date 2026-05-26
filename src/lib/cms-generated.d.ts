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
                                lead_form_destination: string | null;
                                logo_media_id: number | null;
                                default_og_image_id: number | null;
                                about_video_url: string | null;
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
