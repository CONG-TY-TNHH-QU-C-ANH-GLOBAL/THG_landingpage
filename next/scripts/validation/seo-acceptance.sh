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
  if body "${url}" | grep -qF "${needle}"; then ok "${label}"; else fail "${label} — [${needle}] missing from ${url}"; fi
}
hreflang() { # hreflang <url> <tag> <href> <label> — attribute-name case varies (React hrefLang)
  # Fixed-string matching only: URLs must never be interpolated into a regex.
  local url="$1" tag="$2" href="$3" label="$4"
  local html
  html="$(body "${url}")"
  if printf '%s' "${html}" | grep -qF "hrefLang=\"${tag}\" href=\"${href}\"" \
    || printf '%s' "${html}" | grep -qF "hreflang=\"${tag}\" href=\"${href}\""; then
    ok "${label}"
  else
    fail "${label} — hreflang ${tag} → ${href} missing from ${url}"
  fi
}
lacks() { # lacks <url> <fixed-string> <label>
  local url="$1" needle="$2" label="$3"
  if body "${url}" | grep -qF "${needle}"; then fail "${label} — [${needle}] present in ${url}"; else ok "${label}"; fi
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
  # Foundation placeholder stays noindex until WEB-001 ships the real homepage.
  has "${URL}" "noindex" "/${lang} robots noindex (foundation state)"
  # No server-only config value may reach the HTML.
  lacks "${URL}" "CMS_API_URL" "/${lang} no server env leak"
done

hasi() { # hasi <url> <fixed-string> <label> — robots.txt directives are case-insensitive
  local url="$1" raw_needle="$2" label="$3"
  local needle
  needle="$(printf '%s' "${raw_needle}" | tr '[:upper:]' '[:lower:]')"
  if body "${url}" | tr '[:upper:]' '[:lower:]' | grep -qF "${needle}"; then ok "${label}"; else fail "${label} — [${raw_needle}] missing from ${url}"; fi
}

[[ "$(st "${BASE}/robots.txt")" == "200" ]] || fail "/robots.txt status"
has  "${BASE}/robots.txt" "Sitemap: ${SITE}/sitemap.xml" "robots.txt sitemap pointer"
hasi "${BASE}/robots.txt" "User-agent: *" "robots.txt default rule"
hasi "${BASE}/robots.txt" "User-agent: GPTBot" "robots.txt AI-bot rule"

[[ "$(st "${BASE}/sitemap.xml")" == "200" ]] || fail "/sitemap.xml status"
# Foundation state: no localhost URLs and no noindex route leaked into the sitemap.
lacks "${BASE}/sitemap.xml" "localhost" "sitemap has no localhost URLs"
lacks "${BASE}/sitemap.xml" "<loc>" "sitemap lists no URLs while all routes are noindex"

echo "SEO acceptance: all checks passed"
