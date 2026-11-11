"""Synchronize shared HTML without a build step.

Run from the MetaTrest root:
    python scripts/sync_shared.py

Edit Header and Footer in public/index.html.
Edit the request section in public/projects.html.
Run this script after editing a shared block, then review the diff.
The resulting pages remain standalone HTML and need no runtime includes.
"""

from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1] / "public"
SOURCES = {"header": "index.html", "footer": "index.html", "request": "projects.html"}


def synchronize():
    blocks = {}
    for name, filename in SOURCES.items():
        pattern = re.compile(
            rf"<!-- shared:{name} -->.*?<!-- /shared:{name} -->", re.DOTALL
        )
        source = (ROOT / filename).read_text(encoding="utf-8-sig")
        matches = list(pattern.finditer(source))
        if len(matches) != 1:
            raise ValueError(f"{filename} must contain exactly one shared {name} block")
        blocks[name] = (pattern, matches[0].group())

    for path in (ROOT / "index.html", ROOT / "projects.html", ROOT / "services.html"):
        original = path.read_text(encoding="utf-8-sig")
        updated = original
        for name, (pattern, block) in blocks.items():
            if f"<!-- shared:{name} -->" in updated:
                if len(pattern.findall(updated)) != 1:
                    raise ValueError(f"Duplicate shared {name} block in {path.name}")
                updated = pattern.sub(lambda match: block, updated)
        if updated != original:
            path.write_text(updated, encoding="utf-8")
            print(f"Updated {path.name}")


if __name__ == "__main__":
    synchronize()

