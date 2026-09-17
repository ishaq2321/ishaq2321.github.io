#!/usr/bin/env bash
# Does the palette guard actually catch what it claims?
#
# A guard that has never been seen to fail is decoration. Each case below mutates a copy
# of the real export and asserts that the guard exits non-zero and names the thing it
# found. The control asserts an untouched copy still passes, so the guard cannot be
# passing everything.
#
#   npm run build && bash scripts/test-palette-guard.sh
#
# Chrome is resolved by puppeteer itself; if yours lives somewhere unusual, point at it:
#   PUPPETEER_EXECUTABLE_PATH=/path/to/chrome bash scripts/test-palette-guard.sh
set -uo pipefail
cd "$(dirname "$0")/.."

BASE=temp/guard-test
rm -rf "$BASE" && mkdir -p "$BASE" "$BASE/evidence"
pass=0
fail=0

run_guard() {
  OUT_DIR="$1" PALETTE_EVIDENCE="$BASE/evidence" node scripts/check-palette.mjs >"$BASE/log.txt" 2>&1
  echo $?
}

expect_fail() { # label, expected substring, out dir
  local code
  code=$(run_guard "$3")
  if [ "$code" != "0" ] && grep -qi "$2" "$BASE/log.txt"; then
    echo "  PASS  $1"
    echo "          -> $(grep -i "$2" "$BASE/log.txt" | head -1 | sed 's/^ *//')"
    pass=$((pass + 1))
  else
    echo "  FAIL  $1 (exit $code, expected a complaint about '$2')"
    tail -4 "$BASE/log.txt" | sed 's/^/          /'
    fail=$((fail + 1))
  fi
}

mutation() { # name -> copies out/ into $BASE/$name and echoes the dir
  cp -r out "$BASE/$1"
  echo "$BASE/$1"
}

echo "control: the unmutated export must pass"
code=$(run_guard "$BASE/control" 2>/dev/null || run_guard out)
cp -r out "$BASE/control"
code=$(run_guard "$BASE/control")
if [ "$code" = "0" ]; then
  echo "  PASS  clean export passes the guard"
  pass=$((pass + 1))
else
  echo "  FAIL  clean export did not pass"
  tail -4 "$BASE/log.txt" | sed 's/^/          /'
  fail=$((fail + 1))
fi

echo "static checks (a light theme reappearing in the source)"

d=$(mutation light-class)
css=$(ls "$d"/_next/static/chunks/*.css | head -1)
printf '\nhtml.light{color-scheme:light;--bg:#f6f4ef}\n' >>"$css"
expect_fail "html.light palette block returns" "light palette block" "$d"

d=$(mutation light-token)
css=$(ls "$d"/_next/static/chunks/*.css | head -1)
printf '\n:root{--paper:#f6f4ef}\n' >>"$css"
expect_fail "the light paper token returns" "light paper token" "$d"

d=$(mutation toggle-markup)
sed -i 's#</body>#<button aria-label="Switch to light mode">theme</button></body>#' "$d/index.html"
expect_fail "a theme toggle returns to the markup" "theme toggle" "$d"

d=$(mutation boot-script)
sed -i "s#</body>#<script>localStorage.getItem('theme')</script></body>#'" "$d/index.html" 2>/dev/null
sed -i "s#</body>#<script>localStorage.getItem(\"theme\")</script></body>#" "$d/index.html"
expect_fail "the theme boot script returns" "theme boot script" "$d"

echo "rendered checks (a light palette that no static pattern would name)"

d=$(mutation light-media-query)
css=$(ls "$d"/_next/static/chunks/*.css | head -1)
# Deliberately not #f6f4ef: nothing in the files names this as light, so only a browser
# that emulates prefers-color-scheme and reads the computed background can catch it.
printf '\n@media (prefers-color-scheme: light){body{background-color:#ffffff!important;color:#111111!important}}\n' >>"$css"
expect_fail "a light palette injected via prefers-color-scheme" "body background" "$d"

d=$(mutation blank-hero)
sed -i 's#</head>#<style>h1{opacity:0!important}</style></head>#' "$d/index.html"
expect_fail "a hero that does not paint" "hero name is not visible" "$d"

echo
echo "$pass passed, $fail failed"
[ "$fail" = "0" ]
