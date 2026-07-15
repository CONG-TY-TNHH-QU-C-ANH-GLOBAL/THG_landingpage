#!/usr/bin/env bash
# Runtime locale routing matrix against a running standalone artifact (FND-002 §11).
# Usage: BASE_URL=http://127.0.0.1:3000 scripts/validation/locale-routing-matrix.sh
set -euo pipefail
BASE="${BASE_URL:-http://127.0.0.1:3000}"

st()  { curl -s -o /dev/null -w '%{http_code}' "$1"; }
loc() { curl -s -o /dev/null -w '%{redirect_url}' "$1"; }
lng() { curl -s "$1" | grep -oE '<html lang="[^"]*"' | head -1; }
eq()  { if [ "$2" != "$3" ]; then echo "FAIL: $1 — expected [$3] got [$2]" >&2; exit 1; fi; echo "ok: $1 = $2"; }

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

# Real 404s.
eq "/vi/nope 404"  "$(st "${BASE}/vi/nope")"  "404"
eq "/nope 404"     "$(st "${BASE}/nope")"     "404"

# Infra bypass (proxy does not touch these).
eq "/api/health 200"           "$(st "${BASE}/api/health")"           "200"
eq "/api/health body"          "$(curl -s "${BASE}/api/health")"      '{"status":"ok","service":"thg-public-web","runtime":"next"}'
eq "/foundation-probe.txt 200" "$(st "${BASE}/foundation-probe.txt")" "200"
eq "/README.md 404"            "$(st "${BASE}/README.md")"            "404"
eq "/_next missing 404"        "$(st "${BASE}/_next/static/chunks/nope.js")" "404"

echo "locale routing matrix OK"
