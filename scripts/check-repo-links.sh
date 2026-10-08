#!/bin/bash
# Lists GitHub repositories linked from the site's pages that are not public
# (private, or missing). Needs the GitHub CLI (gh), logged in. Exits 1 if any are found.
set -u
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
bad=0
for repo in $(grep -rhoE '(^|[^A-Za-z0-9.-])github[.]com/[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+' "$DIR" --include='*.html' --include='*.md' --exclude-dir=.git --exclude-dir=node_modules | sed -E 's#^.*github[.]com/##; s#[.]git$##' | sort -u); do
    vis="$(gh repo view "$repo" --json visibility --jq .visibility 2>/dev/null || echo MISSING)"
    if [ "$vis" != "PUBLIC" ]; then
        echo "not public ($vis): $repo"
        bad=1
    fi
done
[ "$bad" -eq 0 ] && echo "All linked repositories are public."
exit "$bad"
