#!/bin/bash
#
# Renders the jigs in this directory to PNGs with headless Chrome.
#
# These jigs are deliberately NOT Next.js routes. `output: "export"` publishes
# every route under src/app/, so a jig living there becomes a public page on
# itsmor.com the moment it is committed and deployed. Same reasoning as
# career/assets/linkedin-banner.html.
#
# Usage: ./tools/capture.sh
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
# Chrome writes the screenshot and then does not exit — true for both the new
# and the old headless mode — so the process is backgrounded and reaped as soon
# as the PNG appears, with a hard ceiling so a genuine failure cannot hang.
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
    # The file appears before Chrome is finished writing it, so require the
    # size to hold steady for a beat before declaring it done.
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

# Tokens first. Rendering before regenerating produces assets that match
# nothing, which is the whole failure this consolidation exists to prevent.
echo "🎨 Regenerating tokens from src/lib/tokens.ts…"
node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON "$ROOT/tools/gen-tokens.mjs"
echo ""

echo "📸 Capturing jigs…"
shot og-card.png             1200 630 "file://$ROOT/tools/og-card.html"
shot github-banner.png       1536 384 "file://$ROOT/tools/github-banner.html"
shot github-banner-dark.png  1536 384 "file://$ROOT/tools/github-banner.html?variant=dark"
shot github-banner@2x.png    1536 384 "file://$ROOT/tools/github-banner.html" 2
shot linkedin-banner.png     1584 396 "file://$ROOT/tools/linkedin-banner.html"
shot linkedin-banner@2x.png  1584 396 "file://$ROOT/tools/linkedin-banner.html" 2

echo ""
echo "📦 Installing the OG card where Next's file convention finds it…"
cp "$OUT/og-card.png" "$ROOT/src/app/opengraph-image.png"
cp "$OUT/og-card.png" "$ROOT/src/app/twitter-image.png"
echo "   src/app/opengraph-image.png"
echo "   src/app/twitter-image.png"

echo ""
echo "✅ Done. Everything in tools/out/ is disposable. The canonical exports are"
echo "   the ones committed next to the README or profile that references them:"
echo "     github-banner*.png  -> the GitHub profile repo's assets/"
echo "     linkedin-banner.png -> ~/logzio/career/assets/, then re-upload"
echo "   The OG card is installed into src/app/ above and ships with the site."
