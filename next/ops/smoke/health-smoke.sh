#!/usr/bin/env bash
# Candidate health smoke check. Asserts the exact FND-001 health contract.
# Usage: BASE_URL=http://127.0.0.1:3000 ops/smoke/health-smoke.sh
set -euo pipefail
BASE="${BASE_URL:-http://127.0.0.1:3000}"

body="$(curl -fsS --connect-timeout 3 --max-time 10 "${BASE}/api/health")"
echo "health body: ${body}"

expected='{"status":"ok","service":"thg-public-web","runtime":"next"}'
# Normalise whitespace before comparing.
got="$(printf '%s' "${body}" | tr -d '[:space:]')"
want="$(printf '%s' "${expected}" | tr -d '[:space:]')"
if [[ "${got}" != "${want}" ]]; then
  echo "FAIL: health contract mismatch" >&2
  exit 1
fi
echo "OK: health contract matches"
