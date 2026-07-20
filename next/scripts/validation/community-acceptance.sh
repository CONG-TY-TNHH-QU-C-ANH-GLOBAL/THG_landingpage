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

# The canonical Vietnamese community routes. Every use below — whether it is the path
# being requested or the href the page is asserted to render — refers to this same route,
# so it is named once. Paths that only share a prefix (a filtered URL, a detail slug) are
# composed from it; the "/community" substring passed to the sitemap check is deliberately
# NOT this value — it is a fragment matched against any community URL.
readonly VI_COMMUNITY="/vi/community"
readonly VI_COMMUNITY_REVIEWS="${VI_COMMUNITY}/reviews"

# Every parameter below is mandatory; `set -u` already aborts on a missing one, so the
# `${1:?}` form would only restate that.
body() { # body <url>
  local url="$1"
  curl -s --connect-timeout "${CONNECT_TIMEOUT}" --max-time "${MAX_TIME}" "${url}"
}

st() { # st <url>
  local url="$1"
  curl -s --connect-timeout "${CONNECT_TIMEOUT}" --max-time "${MAX_TIME}" -o /dev/null -w '%{http_code}' "${url}"
}

fail() { # fail <message>
  local message="$1"
  echo "FAIL: ${message}" >&2
  exit 1
}

ok() { # ok <message>
  local message="$1"
  echo "ok: ${message}"
}

status() { # status <path> <expected-status> <label>
  local path="$1"
  local expected="$2"
  local label="$3"
  local got
  got="$(st "${BASE}${path}")"
  if [[ "${got}" == "${expected}" ]]; then
    ok "${label} (${path} → ${expected})"
  else
    fail "${label} — ${path} returned ${got}, expected ${expected}"
  fi
}

# The response is captured into a variable and matched with a here-string rather than a
# pipeline: under `set -o pipefail`, `curl | grep -q` makes grep exit at the first match,
# SIGPIPE the still-writing curl, and fail the whole pipeline — which reads as "absent"
# and would silently turn every `lacks` assertion into a false pass.
has() { # has <path> <fixed-string> <label>
  local path="$1"
  local needle="$2"
  local label="$3"
  local html
  html="$(body "${BASE}${path}")"
  if grep -qF -- "${needle}" <<<"${html}"; then
    ok "${label}"
  else
    fail "${label} — [${needle}] missing from ${path}"
  fi
}

lacks() { # lacks <path> <fixed-string> <label>
  local path="$1"
  local needle="$2"
  local label="$3"
  local html
  html="$(body "${BASE}${path}")"
  if grep -qF -- "${needle}" <<<"${html}"; then
    fail "${label} — [${needle}] unexpectedly present in ${path}"
  else
    ok "${label}"
  fi
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

VI_QUESTION="${VI_COMMUNITY}/${PUBLISHED_Q}"
VI_REVIEW="${VI_COMMUNITY_REVIEWS}/${PUBLISHED_R}"

echo "— the homepage/nav link targets are no longer 404 —"
status "${VI_COMMUNITY}" 200 "FAQ + Knowledge Loop CTA target"
status "${VI_COMMUNITY_REVIEWS}" 200 "navbar Verified Reviews target"

echo "— category filter is a real server-rendered URL —"
status "${VI_COMMUNITY}?category=van-chuyen" 200 "filtered listing"
status "${VI_COMMUNITY}?category=khong-ton-tai" 200 "unknown category is an empty list, not an error"

echo "— detail routes —"
status "${VI_QUESTION}" 200 "published question detail"
status "${VI_COMMUNITY}/${NONINDEXABLE_Q}" 200 "non-indexable published question still renders"
status "${VI_REVIEW}" 200 "published review detail"

echo "— unknown, pending, rejected and withdrawn are one REAL 404 —"
status "${VI_COMMUNITY}/khong-ton-tai-cau-hoi-nay" 404 "unknown question slug"
status "/en/community/khong-ton-tai-cau-hoi-nay" 404 "unknown question slug (en)"
status "${VI_COMMUNITY_REVIEWS}/khong-ton-tai-danh-gia" 404 "unknown review slug"

echo "— indexability hold (OQ-P-002): every community route is noindex —"
for path in "${VI_COMMUNITY}" "/en/community" "/zh/community" "${VI_COMMUNITY_REVIEWS}" "${VI_QUESTION}" "${VI_REVIEW}"; do
  has "${path}" 'name="robots" content="noindex' "noindex on ${path}"
done

echo "— and no community URL is advertised as canonical or alternate —"
lacks "${VI_COMMUNITY}" 'rel="canonical"' "no canonical on the listing"
lacks "${VI_QUESTION}" 'rel="canonical"' "no canonical on question detail"
lacks "${VI_QUESTION}" 'hreflang' "no hreflang on question detail"
# A bare fragment, not the canonical route: this asserts that NO community URL of any
# locale or depth appears in the sitemap.
lacks "/sitemap.xml" "/community" "sitemap excludes community"

echo "— essential content is in the SSR payload (works without JavaScript) —"
has "${VI_COMMUNITY}" "${PUBLISHED_Q}" "listing links the question server-side"
has "${VI_QUESTION}" "Ship VN" "question title server-rendered"
has "${VI_COMMUNITY}" "href=\"${VI_COMMUNITY}?category=van-chuyen\"" "filter chips are links, not buttons"
has "${VI_COMMUNITY}" "href=\"${VI_COMMUNITY_REVIEWS}\"" "reviews tab is a link"

echo "— user-generated content is never rendered as markup —"
lacks "${VI_QUESTION}" "<script>alert" "UGC script payload is escaped, not executed"

echo "— owner tokens never reach a server-rendered page —"
for path in "${VI_COMMUNITY}" "${VI_QUESTION}" "${VI_REVIEW}"; do
  lacks "${path}" "ownerToken" "no ownerToken in ${path}"
  lacks "${path}" "owner_token" "no owner_token in ${path}"
done

echo "— private submitter data never reaches the wire —"
lacks "${VI_QUESTION}" "author_email" "no author_email on question detail"
lacks "${VI_REVIEW}" "reviewer_email" "no reviewer_email on review detail"
lacks "${VI_REVIEW}" "private_evidence_note" "no evidence note on review detail"

echo "ALL COMMUNITY ACCEPTANCE CHECKS PASSED"
