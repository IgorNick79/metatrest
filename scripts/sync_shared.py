"""Synchronize shared HTML without a build step.

Run from the MetaTrest root:
    python scripts/sync_shared.py

Edit Header, Footer and the mobile menu in public/index.html.
Mobile menu actions are generated from Hero actions in the same file.
Edit the request section in public/projects.html.
Run this script after editing a shared block, then review the diff.
The resulting pages remain standalone HTML and need no runtime includes.
"""

from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1] / "public"
SOURCES = {
    "header": "index.html",
    "footer": "index.html",
    "mobile-menu": "index.html",
    "request": "projects.html",
}


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
        block = matches[0].group()
        if name == "mobile-menu":
            # Keep Hero actions as the single editable source for the repeated menu CTA.
            actions = re.search(r'<div class="hero-actions[^>]*>(.*?)</div>', source, re.DOTALL)
            if not actions:
                raise ValueError("The shared menu requires Hero actions in index.html")
            block = re.sub(
                r'(<div class="mobile-menu-actions[^>]*>).*?(</div>)',
                lambda m: m[1] + actions[1] + m[2], block, flags=re.DOTALL
            )
        blocks[name] = (pattern, block)

    for path in (ROOT / "index.html", ROOT / "projects.html", ROOT / "services.html", ROOT / "project.html", ROOT / "construction.html", ROOT / "service.html", ROOT / "warehouse.html"):
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

