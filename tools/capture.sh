#!/bin/bash
#
# Renders the jigs in this directory to PNGs with headless Chrome.
# See tools/README.md.
#
set -euo pipefail

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="$ROOT/tools/out"

if [ ! -x "$CHROME" ]; then
  echo "❌ Chrome not found at: $CHROME"
  exit 1
fi

mkdir -p "$OUT"

# shot <name> <width> <height> <url> <scale>
#
# Chrome writes the screenshot and then never exits, so it is backgrounded and
# reaped once the PNG size holds steady, with a hard ceiling.
shot() {
  local name="$1" w="$2" h="$3" url="$4" scale="${5:-1}"
  local target="$OUT/$name"
  local profile pid i
  profile="$(mktemp -d)"
  rm -f "$target"

  "$CHROME" \
    --headless \
    --disable-gpu \
    --hide-scrollbars \
    --no-first-run \
    --no-default-browser-check \
    --user-data-dir="$profile" \
    --force-device-scale-factor="$scale" \
    --window-size="$w,$h" \
    --virtual-time-budget=6000 \
    --screenshot="$target" \
    "$url" >/dev/null 2>&1 &
  pid=$!

  for i in $(seq 1 60); do
    # The file appears before Chrome finishes writing it.
    if [ -s "$target" ]; then
      local a b
      a=$(wc -c < "$target")
      sleep 0.5
      b=$(wc -c < "$target")
      [ "$a" = "$b" ] && break
    fi
    sleep 0.5
  done

  kill "$pid" 2>/dev/null || true
  wait "$pid" 2>/dev/null || true
  rm -rf "$profile"

  if [ ! -s "$target" ]; then
    echo "❌ $name — capture produced no file"
    exit 1
  fi
  printf "   %-24s %s\n" "$name" \
    "$(sips -g pixelWidth -g pixelHeight "$target" | awk '/pixel/{printf "%s ", $2}')"
}

# Tokens first: rendering before regenerating produces assets matching nothing.
echo "🎨 Regenerating tokens from src/lib/tokens.ts…"
node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON "$ROOT/tools/gen-tokens.mjs"
echo ""

echo "📸 Capturing jigs…"
# Output names match what the profile README references, so a refresh is a copy
# and never a rename. It previously emitted a light @2x, two unreferenced @1x
# passes, and no dark @2x at all — so the most-served asset could not be built
# by this script.
shot og-card.png             1200 630 "file://$ROOT/tools/og-card.html"
shot banner-light@2x.png     1536 384 "file://$ROOT/tools/github-banner.html" 2
shot banner-dark@2x.png      1536 384 "file://$ROOT/tools/github-banner.html?variant=dark" 2
shot linkedin-banner.png     1584 396 "file://$ROOT/tools/linkedin-banner.html"
shot linkedin-banner@2x.png  1584 396 "file://$ROOT/tools/linkedin-banner.html" 2

echo ""
echo "📦 Installing the OG card…"
cp "$OUT/og-card.png" "$ROOT/src/assets/og-card.png"
echo "   src/assets/og-card.png"

echo ""
echo "✅ Done. Everything in tools/out/ is disposable. The canonical exports are"
echo "   the ones committed next to the README or profile that references them:"
echo "     banner-light@2x.png, banner-dark@2x.png -> the profile repo's assets/"
echo "     linkedin-banner*.png                     -> upload to the profile"
echo "   The OG card is installed into src/assets/ above and ships with the site."
