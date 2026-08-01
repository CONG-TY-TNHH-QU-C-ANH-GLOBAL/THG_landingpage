#!/usr/bin/env bash
# Runtime SEO acceptance against a running standalone artifact (FND-003).
# Usage: BASE_URL=http://127.0.0.1:3000 scripts/validation/seo-acceptance.sh
# Canonical/hreflang values assert the PRODUCTION origin because metadata is built from
# NEXT_PUBLIC_SITE_URL with the production default — independent of the probe BASE_URL.
set -euo pipefail
BASE="${BASE_URL:-http://127.0.0.1:3000}"
SITE="${SITE_ORIGIN:-https://thgfulfill.com}"

CONNECT_TIMEOUT=3
MAX_TIME=10

body() {
  local url="$1"
  curl -s --connect-timeout "${CONNECT_TIMEOUT}" --max-time "${MAX_TIME}" "${url}"
}
st() {
  local url="$1"
  curl -s --connect-timeout "${CONNECT_TIMEOUT}" --max-time "${MAX_TIME}" -o /dev/null -w '%{http_code}' "${url}"
}

fail() {
  local message="$1"
  echo "FAIL: ${message}" >&2
  exit 1
}
ok() {
  local message="$1"
  echo "ok: ${message}"
}

has() { # has <url> <fixed-string> <label>
  local url="$1" needle="$2" label="$3"
  if body "${url}" | grep -cF "${needle}" >/dev/null; then ok "${label}"; else fail "${label} — [${needle}] missing from ${url}"; fi
}
hreflang() { # hreflang <url> <tag> <href> <label> — attribute-name case varies (React hrefLang)
  # Fixed-string matching only: URLs must never be interpolated into a regex.
  local url="$1" tag="$2" href="$3" label="$4"
  local html
  html="$(body "${url}")"
  if printf '%s' "${html}" | grep -cF "hrefLang=\"${tag}\" href=\"${href}\"" >/dev/null \
    || printf '%s' "${html}" | grep -cF "hreflang=\"${tag}\" href=\"${href}\"" >/dev/null; then
    ok "${label}"
  else
    fail "${label} — hreflang ${tag} → ${href} missing from ${url}"
  fi
}
lacks() { # lacks <url> <fixed-string> <label>
  local url="$1" needle="$2" label="$3"
  if body "${url}" | grep -cF "${needle}" >/dev/null; then fail "${label} — [${needle}] present in ${url}"; else ok "${label}"; fi
}

for lang in vi en zh; do
  URL="${BASE}/${lang}"
  [[ "$(st "${URL}")" == "200" ]] || fail "/${lang} status"
  has "${URL}" "rel=\"canonical\" href=\"${SITE}/${lang}\"" "/${lang} canonical"
  # Exactly the approved hreflang set (vi, en, zh-CN, x-default → /vi).
  hreflang "${URL}" "vi" "${SITE}/vi"        "/${lang} hreflang vi"
  hreflang "${URL}" "en" "${SITE}/en"        "/${lang} hreflang en"
  hreflang "${URL}" "zh-CN" "${SITE}/zh"     "/${lang} hreflang zh-CN"
  hreflang "${URL}" "x-default" "${SITE}/vi" "/${lang} hreflang x-default"
  has "${URL}" "property=\"og:url\" content=\"${SITE}/${lang}\"" "/${lang} og:url"
  has "${URL}" "name=\"description\""                       "/${lang} meta description"
  # Exactly one canonical link.
  N=$(body "${URL}" | grep -oF 'rel="canonical"' | wc -l | tr -d ' ')
  [[ "${N}" == "1" ]] || fail "/${lang} duplicate canonical (${N})"
  # WEB-001: the real homepage is indexable and the placeholder copy is gone.
  lacks "${URL}" "noindex" "/${lang} robots indexable (WEB-001)"
  lacks "${URL}" "định tuyến ngôn ngữ" "/${lang} placeholder title absent"
  lacks "${URL}" "Không phải môi trường production" "/${lang} placeholder body absent"
  # Real homepage content markers: hero brand copy + shell landmarks.
  has "${URL}" "id=\"faq\"" "/${lang} FAQ section present"
  has "${URL}" "id=\"contact\"" "/${lang} footer contact section present"
  has "${URL}" "application/ld+json" "/${lang} JSON-LD present"
  # No server-only config value may reach the HTML.
  lacks "${URL}" "CMS_API_URL" "/${lang} no server env leak"
done

hasi() { # hasi <url> <fixed-string> <label> — robots.txt directives are case-insensitive
  local url="$1" raw_needle="$2" label="$3"
  local needle
  needle="$(printf '%s' "${raw_needle}" | tr '[:upper:]' '[:lower:]')"
  if body "${url}" | tr '[:upper:]' '[:lower:]' | grep -cF "${needle}" >/dev/null; then ok "${label}"; else fail "${label} — [${raw_needle}] missing from ${url}"; fi
}

[[ "$(st "${BASE}/robots.txt")" == "200" ]] || fail "/robots.txt status"
has  "${BASE}/robots.txt" "Sitemap: ${SITE}/sitemap.xml" "robots.txt sitemap pointer"
hasi "${BASE}/robots.txt" "User-agent: *" "robots.txt default rule"
hasi "${BASE}/robots.txt" "User-agent: GPTBot" "robots.txt AI-bot rule"

[[ "$(st "${BASE}/sitemap.xml")" == "200" ]] || fail "/sitemap.xml status"
# The sitemap invariant is NOT a row count. It is:
#
#     approved static indexable route templates  x  supported locales
#
# This block used to assert `LOCS == 3` ("the home rows"), which was correct only while the
# homepage was the sole migrated route. It was a second, hand-maintained source of truth and it
# broke on the first route slice that legitimately added rows. The expectation now comes from
# the SAME canonical registry the app builds its sitemap from (shared/seo/indexable-routes), so
# a slice that adds an approved route updates both sides at once.
#
# The registry's own correctness — every template resolves to a real page.tsx, blocked routes
# stay out, no duplicate templates — is proven independently by tests/integration/seo.test.ts,
# which never reads the sitemap. What THIS adds is that the packaged standalone artifact
# actually serves it, plus the structural checks below that need no knowledge of the count.
SITEMAP_BODY="$(body "${BASE}/sitemap.xml")"
SERVED_LOCS="$(printf '%s' "${SITEMAP_BODY}" | grep -oE "<loc>[^<]*</loc>" | sed -e 's#</\?loc>##g' | LC_ALL=C sort)"
EXPECTED_LOCS="$(SITE_ORIGIN="${SITE}" bun run --silent scripts/validation/expected-sitemap-urls.ts | LC_ALL=C sort)"

lacks "${BASE}/sitemap.xml" "localhost" "sitemap has no localhost URLs"

# 1. Exact set equality with the approved registry — no missing row, no extra row.
if [[ "${SERVED_LOCS}" != "${EXPECTED_LOCS}" ]]; then
  echo "--- served ---"   >&2; printf '%s
' "${SERVED_LOCS}"   >&2
  echo "--- expected ---" >&2; printf '%s
' "${EXPECTED_LOCS}" >&2
  fail "sitemap does not match the approved indexable-route registry"
fi
ok "sitemap matches the approved indexable-route registry exactly"

# 2. No duplicate URL.
SERVED_COUNT="$(printf '%s
' "${SERVED_LOCS}" | grep -c . || true)"
UNIQUE_COUNT="$(printf '%s
' "${SERVED_LOCS}" | LC_ALL=C sort -u | grep -c . || true)"
[[ "${SERVED_COUNT}" == "${UNIQUE_COUNT}" ]] || fail "sitemap contains duplicate URLs"
ok "sitemap has no duplicate URLs"

# 3. Every URL is on the production origin (never the probe BASE_URL).
NON_CANONICAL="$(printf '%s
' "${SERVED_LOCS}" | grep -vc "^${SITE}/" || true)"
[[ "${NON_CANONICAL}" == "0" ]] || fail "sitemap contains ${NON_CANONICAL} URL(s) off the canonical origin"
ok "sitemap uses the canonical origin for every URL"

# 4. Locale symmetry — every template expands to every locale, so each locale must appear the
#    same number of times. Independent of how many templates there are.
HOME_ROWS=0
for lang in vi en zh; do
  printf '%s
' "${SERVED_LOCS}" | grep -qxF "${SITE}/${lang}"     || fail "sitemap is missing the home row for /${lang}"
  HOME_ROWS=$((HOME_ROWS + 1))
  COUNT_THIS="$(printf '%s
' "${SERVED_LOCS}" | grep -c "^${SITE}/${lang}\(/\|$\)" || true)"
  if [[ -z "${PER_LOCALE:-}" ]]; then PER_LOCALE="${COUNT_THIS}"; fi
  [[ "${COUNT_THIS}" == "${PER_LOCALE}" ]]     || fail "locale /${lang} has ${COUNT_THIS} rows but /vi has ${PER_LOCALE} — templates must expand to every locale"
done
ok "home is present exactly once per locale (${HOME_ROWS} locales)"
ok "every template expands to all ${HOME_ROWS} locales (${PER_LOCALE} rows each)"

# 5. Routes that are deliberately NOT indexable must never appear — a registry mistake that
#    admitted one would pass set-equality above, so this is asserted against the product
#    decision directly rather than against the registry.
for blocked in /catalog /international-pricing /domestic-pricing /community; do
  printf '%s
' "${SERVED_LOCS}" | grep -q "${blocked}"     && fail "sitemap lists ${blocked}, which is not approved for indexing"
done
ok "sitemap excludes every blocked route"

# 6. CMS-owned detail URLs stay out until their approved migration phase (M9): their slugs
#    change without a build, so a static sitemap must not enumerate them.
for dynamic in "/blog/" "/careers/" "/community/"; do
  printf '%s
' "${SERVED_LOCS}" | grep -q "${dynamic}"     && fail "sitemap lists a CMS-owned detail URL (${dynamic}) — those are excluded until M9"
done
ok "sitemap excludes CMS-owned detail URLs"

echo "SEO acceptance: all checks passed"
