#!/usr/bin/env bash
# Regenerate an Open Graph card from its HTML source.
#
#   ./scripts/og/render.sh sizing-poker
#
# Renders scripts/og/<name>-card.html headlessly at 1200x630 and writes
# public/og/<name>.jpg. The card is drawn on a <canvas>, so it needs no fonts
# beyond the system stack and no network access.
#
# macOS only: uses the installed Chrome for rendering and sips for the JPEG
# conversion. The committed .jpg is the artefact that ships; this script only
# needs running when the card design changes.

set -euo pipefail

NAME="${1:-}"
if [[ -z "$NAME" ]]; then
  echo "usage: $0 <card-name>   (e.g. sizing-poker)" >&2
  exit 1
fi

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SRC="$ROOT/scripts/og/$NAME-card.html"
OUT="$ROOT/public/og/$NAME.jpg"
TMP="$(mktemp -t og-render).png"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

[[ -f "$SRC" ]] || { echo "no card source at $SRC" >&2; exit 1; }
[[ -x "$CHROME" ]] || { echo "Chrome not found at $CHROME" >&2; exit 1; }

"$CHROME" --headless --disable-gpu --hide-scrollbars \
  --screenshot="$TMP" --window-size=1200,630 "file://$SRC" >/dev/null 2>&1

sips -s format jpeg -s formatOptions 82 "$TMP" --out "$OUT" >/dev/null
rm -f "$TMP"

echo "wrote $OUT ($(du -h "$OUT" | cut -f1))"
