#!/usr/bin/env bash
# Runtime community acceptance against a running standalone artifact (COM-001 / COM-002).
# Usage: BASE_URL=http://127.0.0.1:3000 scripts/validation/community-acceptance.sh
#
# HTTP status and rendered-HTML facts that unit tests cannot observe. The 404 assertions
# are the important ones: a Suspense boundary above these routes flushes 200 headers
# before the page can call notFound(), which silently turns every unknown slug into a
# soft 404. That regression is invisible to vitest and only shows up here.
set -euo pipefail
BASE="${BASE_URL:-http://127.0.0.1:3000}"

CONNECT_TIMEOUT=3
MAX_TIME=10

body() { curl -s --connect-timeout "${CONNECT_TIMEOUT}" --max-time "${MAX_TIME}" "$1"; }
st() { curl -s --connect-timeout "${CONNECT_TIMEOUT}" --max-time "${MAX_TIME}" -o /dev/null -w '%{http_code}' "$1"; }

fail() { echo "FAIL: $1" >&2; exit 1; }
ok() { echo "ok: $1"; }

status() { # status <path> <expected> <label>
  local got
  got="$(st "${BASE}$1")"
  if [ "${got}" = "$2" ]; then ok "$3 ($1 → $2)"; else fail "$3 — $1 returned ${got}, expected $2"; fi
}

# The response is captured into a variable and matched with a here-string rather than a
# pipeline: under `set -o pipefail`, `curl | grep -q` makes grep exit at the first match,
# SIGPIPE the still-writing curl, and fail the whole pipeline — which reads as "absent"
# and would silently turn every `lacks` assertion into a false pass.
has() { # has <path> <fixed-string> <label>
  local html; html="$(body "${BASE}$1")"
  if grep -qF -- "$2" <<<"${html}"; then ok "$3"; else fail "$3 — [$2] missing from $1"; fi
}

lacks() { # lacks <path> <fixed-string> <label>
  local html; html="$(body "${BASE}$1")"
  if grep -qF -- "$2" <<<"${html}"; then fail "$3 — [$2] unexpectedly present in $1"; else ok "$3"; fi
}

# Slugs the seeded CMS is expected to serve. Override for a different dataset.
PUBLISHED_Q="${COMMUNITY_PUBLISHED_QUESTION:-ship-vn-us-mat-bao-lau}"
NONINDEXABLE_Q="${COMMUNITY_NONINDEXABLE_QUESTION:-chua-co-chuyen-gia-tra-loi}"
PUBLISHED_R="${COMMUNITY_PUBLISHED_REVIEW:-pod-fulfillment-on-dinh}"

echo "— community route family reachable in every locale —"
for lang in vi en zh; do
  status "/${lang}/community" 200 "Q&A listing renders (${lang})"
  status "/${lang}/community/reviews" 200 "reviews listing renders (${lang})"
done

echo "— the homepage/nav link targets are no longer 404 —"
status "/vi/community" 200 "FAQ + Knowledge Loop CTA target"
status "/vi/community/reviews" 200 "navbar Verified Reviews target"

echo "— category filter is a real server-rendered URL —"
status "/vi/community?category=van-chuyen" 200 "filtered listing"
status "/vi/community?category=khong-ton-tai" 200 "unknown category is an empty list, not an error"

echo "— detail routes —"
status "/vi/community/${PUBLISHED_Q}" 200 "published question detail"
status "/vi/community/${NONINDEXABLE_Q}" 200 "non-indexable published question still renders"
status "/vi/community/reviews/${PUBLISHED_R}" 200 "published review detail"

echo "— unknown, pending, rejected and withdrawn are one REAL 404 —"
status "/vi/community/khong-ton-tai-cau-hoi-nay" 404 "unknown question slug"
status "/en/community/khong-ton-tai-cau-hoi-nay" 404 "unknown question slug (en)"
status "/vi/community/reviews/khong-ton-tai-danh-gia" 404 "unknown review slug"

echo "— indexability hold (OQ-P-002): every community route is noindex —"
for path in "/vi/community" "/en/community" "/zh/community" "/vi/community/reviews" "/vi/community/${PUBLISHED_Q}" "/vi/community/reviews/${PUBLISHED_R}"; do
  has "${path}" 'name="robots" content="noindex' "noindex on ${path}"
done

echo "— and no community URL is advertised as canonical or alternate —"
lacks "/vi/community" 'rel="canonical"' "no canonical on the listing"
lacks "/vi/community/${PUBLISHED_Q}" 'rel="canonical"' "no canonical on question detail"
lacks "/vi/community/${PUBLISHED_Q}" 'hreflang' "no hreflang on question detail"
lacks "/sitemap.xml" "/community" "sitemap excludes community"

echo "— essential content is in the SSR payload (works without JavaScript) —"
has "/vi/community" "${PUBLISHED_Q}" "listing links the question server-side"
has "/vi/community/${PUBLISHED_Q}" "Ship VN" "question title server-rendered"
has "/vi/community" 'href="/vi/community?category=van-chuyen"' "filter chips are links, not buttons"
has "/vi/community" 'href="/vi/community/reviews"' "reviews tab is a link"

echo "— user-generated content is never rendered as markup —"
lacks "/vi/community/${PUBLISHED_Q}" "<script>alert" "UGC script payload is escaped, not executed"

echo "— owner tokens never reach a server-rendered page —"
for path in "/vi/community" "/vi/community/${PUBLISHED_Q}" "/vi/community/reviews/${PUBLISHED_R}"; do
  lacks "${path}" "ownerToken" "no ownerToken in ${path}"
  lacks "${path}" "owner_token" "no owner_token in ${path}"
done

echo "— private submitter data never reaches the wire —"
lacks "/vi/community/${PUBLISHED_Q}" "author_email" "no author_email on question detail"
lacks "/vi/community/reviews/${PUBLISHED_R}" "reviewer_email" "no reviewer_email on review detail"
lacks "/vi/community/reviews/${PUBLISHED_R}" "private_evidence_note" "no evidence note on review detail"

echo "ALL COMMUNITY ACCEPTANCE CHECKS PASSED"
