#!/usr/bin/env bash
# Runtime locale routing matrix against a running standalone artifact (FND-002 §11).
# Usage: BASE_URL=http://127.0.0.1:3000 scripts/validation/locale-routing-matrix.sh
set -euo pipefail
BASE="${BASE_URL:-http://127.0.0.1:3000}"

# Bounded curl for localhost CI: fail fast on connect, cap total time (deterministic values).
CONNECT_TIMEOUT=3
MAX_TIME=10

st() {
  local url="$1"
  curl -s --connect-timeout "${CONNECT_TIMEOUT}" --max-time "${MAX_TIME}" -o /dev/null -w '%{http_code}' "${url}"
}
loc() {
  local url="$1"
  curl -s --connect-timeout "${CONNECT_TIMEOUT}" --max-time "${MAX_TIME}" -o /dev/null -w '%{redirect_url}' "${url}"
}
body() {
  local url="$1"
  curl -s --connect-timeout "${CONNECT_TIMEOUT}" --max-time "${MAX_TIME}" "${url}"
}
lng() {
  local url="$1"
  body "${url}" | grep -oE '<html lang="[^"]*"' | head -1
}
hl() {
  local url="$1"
  local tag="$2"
  # Attribute name is case-insensitive in HTML (React renders the JSX `hrefLang` prop);
  # assert the exact tag VALUE regardless of the attribute-name casing.
  if body "${url}" | grep -E "href[Ll]ang=\"${tag}\"" >/dev/null; then echo "${tag}"; fi
}
eq() {
  local label="$1"
  local actual="$2"
  local expected="$3"
  if [[ "${actual}" != "${expected}" ]]; then
    echo "FAIL: ${label} — expected [${expected}] got [${actual}]" >&2
    exit 1
  fi
  echo "ok: ${label} = ${actual}"
}

# Root + locale normalization (308, query preserved), no loop.
eq "/ status"                "$(st "${BASE}/")"                       "308"
eq "/ location"              "$(loc "${BASE}/")"                      "${BASE}/vi"
eq "/?source=test location"  "$(loc "${BASE}/?source=test")"         "${BASE}/vi?source=test"
eq "/fr status"              "$(st "${BASE}/fr")"                     "308"
eq "/fr location"            "$(loc "${BASE}/fr")"                    "${BASE}/vi"
eq "/de/x?a=1 location"      "$(loc "${BASE}/de/x?a=1")"             "${BASE}/vi/x?a=1"

# Supported locales: 200 + correct document language.
eq "/vi status" "$(st "${BASE}/vi")" "200"; eq "/vi lang" "$(lng "${BASE}/vi")" '<html lang="vi"'
eq "/en status" "$(st "${BASE}/en")" "200"; eq "/en lang" "$(lng "${BASE}/en")" '<html lang="en"'
eq "/zh status" "$(st "${BASE}/zh")" "200"; eq "/zh lang" "$(lng "${BASE}/zh")" '<html lang="zh-CN"'

# Edge cases: uppercase locale-like, malformed, trailing-slash canonicalization, query.
eq "/VI status"                 "$(st "${BASE}/VI")"                     "308"
eq "/VI location"               "$(loc "${BASE}/VI")"                    "${BASE}/vi"
eq "/EN status"                 "$(st "${BASE}/EN")"                     "308"
eq "/EN location"               "$(loc "${BASE}/EN")"                    "${BASE}/vi"
eq "/en-US status"              "$(st "${BASE}/en-US")"                  "404"
eq "/zh/ trailing status"       "$(st "${BASE}/zh/")"                    "308"
eq "/zh/ trailing location"     "$(loc "${BASE}/zh/")"                   "${BASE}/zh"
eq "/vi/?source=test status"    "$(st "${BASE}/vi/?source=test")"        "308"
eq "/vi/?source=test location"  "$(loc "${BASE}/vi/?source=test")"       "${BASE}/vi?source=test"
eq "/vi/nope?source=test 404"   "$(st "${BASE}/vi/nope?source=test")"    "404"

# Dotted route: a dot in a NON-final segment is a route (locale-normalized), not an asset.
eq "/fr/legal.v2/terms status"   "$(st "${BASE}/fr/legal.v2/terms")"     "308"
eq "/fr/legal.v2/terms location" "$(loc "${BASE}/fr/legal.v2/terms")"    "${BASE}/vi/legal.v2/terms"
eq "/fr/legal.v2/terms?src loc"  "$(loc "${BASE}/fr/legal.v2/terms?source=test")" "${BASE}/vi/legal.v2/terms?source=test"
eq "/nope.js missing-file 404"   "$(st "${BASE}/nope.js")"               "404"

# hreflang: the foundation page advertises zh via the approved zh-CN tag (HTML_LANG).
eq "/vi advertises zh-CN hreflang" "$(hl "${BASE}/vi" "zh-CN")"          "zh-CN"

# Legacy unprefixed route: intentional 404 in FND-002 (redirect owned by the migrating item).
eq "/thg-fulfill legacy 404"    "$(st "${BASE}/thg-fulfill")"           "404"

# Real 404s.
eq "/vi/nope 404"  "$(st "${BASE}/vi/nope")"  "404"
eq "/nope 404"     "$(st "${BASE}/nope")"     "404"

# Infra bypass (proxy does not touch these).
eq "/api/health 200"           "$(st "${BASE}/api/health")"           "200"
eq "/api/health body"          "$(body "${BASE}/api/health")"         '{"status":"ok","service":"thg-public-web","runtime":"next"}'
eq "/foundation-probe.txt 200" "$(st "${BASE}/foundation-probe.txt")" "200"
eq "/README.md 404"            "$(st "${BASE}/README.md")"            "404"
eq "/_next missing 404"        "$(st "${BASE}/_next/static/chunks/nope.js")" "404"

echo "locale routing matrix OK"
