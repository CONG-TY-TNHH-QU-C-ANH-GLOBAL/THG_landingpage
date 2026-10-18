import { readdirSync, readFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { describe, expect, it } from "vitest";

// Page translation domains are no longer in the entry bundle: each registers
// itself when imported (see registry.ts). A module that uses a key from a
// domain it does not import renders the raw key until the CMS answers — or for
// good, if the CMS is down. This scans the source the way the bundler sees it.

const SRC = join(process.cwd(), "src");
const TRANSLATIONS = join(SRC, "lib", "i18n", "translations");
/** Registered by the provider itself, so usable anywhere. */
const SHELL = new Set(["nav", "contact", "common", "seo"]);

function domainKeys(): Map<string, string> {
    const keyDomain = new Map<string, string>();
    for (const file of readdirSync(TRANSLATIONS)) {
        if (file === "index.ts") continue;
        const domain = file.replace(/\.ts$/, "");
        for (const m of readFileSync(join(TRANSLATIONS, file), "utf8").matchAll(/^\s*"([^"]+)":\s*tr\(/gm)) {
            keyDomain.set(m[1], domain);
        }
    }
    return keyDomain;
}

function sourceFiles(dir: string): string[] {
    return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
        e.isDirectory() ? sourceFiles(join(dir, e.name)) : /\.(ts|tsx)$/.test(e.name) ? [join(dir, e.name)] : [],
    );
}

/** Domains whose keys a file names: exact key literals, plus template-literal
 *  and concatenation prefixes such as `chinhngach.meta_${k}`. */
function domainsUsed(source: string, keyDomain: Map<string, string>): Set<string> {
    const keys = [...keyDomain.keys()];
    const used = new Set<string>();
    const byPrefix = (prefix: string) => keys.filter((k) => k.startsWith(prefix)).forEach((k) => used.add(keyDomain.get(k)!));
    for (const m of source.matchAll(/["'`]([A-Za-z0-9_.-]+)["'`]/g)) {
        const domain = keyDomain.get(m[1]);
        if (domain) used.add(domain);
    }
    for (const m of source.matchAll(/`([A-Za-z0-9_.-]+\.)\$\{/g)) byPrefix(m[1]);
    for (const m of source.matchAll(/["']([A-Za-z0-9_-]+\.[A-Za-z0-9_.-]*)["']\s*\+/g)) byPrefix(m[1]);
    return used;
}

describe("translation domains", () => {
    const keyDomain = domainKeys();
    const files = sourceFiles(SRC).filter(
        (f) => !f.startsWith(join(SRC, "lib", "i18n") + sep) && !/\.test\.tsx?$|\.d\.ts$/.test(f),
    );

    it("finds the dictionary", () => {
        expect(keyDomain.size).toBeGreaterThan(1000);
    });

    it("every module imports the page domains whose keys it uses", () => {
        const missing: string[] = [];
        for (const file of files) {
            const source = readFileSync(file, "utf8");
            for (const domain of domainsUsed(source, keyDomain)) {
                if (SHELL.has(domain)) continue;
                if (!source.includes(`"@/lib/i18n/translations/${domain}"`)) {
                    missing.push(`${relative(SRC, file)} uses ${domain}.* without importing @/lib/i18n/translations/${domain}`);
                }
            }
        }
        expect(missing).toEqual([]);
    });

    it("the runtime never imports the full dictionary", () => {
        const offenders = files.filter((f) => /from\s+["'](?:@\/lib\/i18n|\.{1,2}(?:\/[^"']*)?)\/translations["']/.test(readFileSync(f, "utf8")));
        expect(offenders.map((f) => relative(SRC, f))).toEqual([]);
        expect(readFileSync(join(SRC, "lib", "i18n", "index.tsx"), "utf8")).not.toMatch(/from\s+["']\.\/translations["']/);
    });
});
