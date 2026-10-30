import argparse
import html
import io
import re
import sys
import unicodedata
from pathlib import Path

import uharfbuzz as hb
from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

ROOT = Path(__file__).resolve().parents[2]
SOURCE_DIR = ROOT / "scripts" / "fonts" / "source"
FONT_DIR = ROOT / "app" / "fonts"
MODULE = FONT_DIR / "index.ts"

ASCII = set(range(0x20, 0x7F))
LATIN_1 = set(range(0xA0, 0x100))
LATIN_EXTENDED_A = set(range(0x100, 0x180))
PUNCTUATION = set(map(ord, "‘’“”–—…−"))
IMPLICIT = set(map(ord, "…• "))
HYPHEN = 0x2010
HINTING_TABLES = ["fpgm", "prep", "cvt ", "hdmx", "VDMX", "LTSH", "cvar"]
SOURCE_SCAN = ["app", "components", "content", "hooks", "lib", "pro/blocks"]
SKIPPED_ELEMENTS = ["script", "style", "noscript", "template", "title", "head"]


def parse_ranges(text):
    codepoints = set()
    for part in text.replace(" ", "").upper().replace("U+", "").split(","):
        if "?" in part:
            codepoints.update(range(int(part.replace("?", "0"), 16), int(part.replace("?", "F"), 16) + 1))
        elif "-" in part:
            start, end = part.split("-")
            codepoints.update(range(int(start, 16), int(end, 16) + 1))
        else:
            codepoints.add(int(part, 16))
    return codepoints


def format_ranges(codepoints):
    ordered = sorted(codepoints)
    parts = []
    start = previous = ordered[0]
    for codepoint in ordered[1:] + [None]:
        if codepoint is not None and codepoint == previous + 1:
            previous = codepoint
            continue
        parts.append(f"U+{start:X}" if start == previous else f"U+{start:X}-{previous:X}")
        if codepoint is not None:
            start = previous = codepoint
    return ",".join(parts)


FONTS = [
    {
        "name": "inter",
        "export": "fontSans",
        "source": "Inter[opsz,wght].woff2",
        "family": "Inter",
        "variable": "--font-inter",
        "fallback": ["Inter Fallback"],
        "features": ["calt", "ccmp", "kern", "locl", "mark", "mkmk", "tnum"],
        "minimum": {"wght": 400},
        "hinting": False,
        "coverage": parse_ranges(
            "U+0,U+20-7E,U+A0-AC,U+AE-148,U+14A-1C3,U+1C5-254,U+256-27B,U+27E-284,U+286-290,U+292-2A4,"
            "U+2A6-2CC,U+2CE-2D7,U+2DA,U+2DC-301,U+303-304,U+308-309,U+323,U+374-376,U+37A-37F,"
            "U+384-38A,U+38C,U+38E-3A1,U+3A3-3D7,U+3DC-3DD,U+3F0-3F6,U+3F9-3FA,U+3FC-479,U+480-49D,"
            "U+4A0-4FF,U+52F,U+1D00,U+1D0D,U+1D1B,U+1D43,U+1D47-1D49,U+1D4D,U+1D4F-1D50,U+1D52,"
            "U+1D56-1D58,U+1D5B,U+1D62-1D65,U+1D9C,U+1DA0,U+1DBB,U+1DBF,U+1E00-1E9B,U+1E9D-1F15,"
            "U+1F18-1F1D,U+1F20-1F45,U+1F48-1F4D,U+1F50-1F57,U+1F59,U+1F5B,U+1F5D,U+1F5F-1F7D,"
            "U+1F80-1FB4,U+1FB6-1FC4,U+1FC6-1FD3,U+1FD6-1FDB,U+1FDD-1FEF,U+1FF2-1FF4,U+1FF6-1FFE,"
            "U+2002,U+2009,U+200B,U+2013-2014,U+2018-201A,U+201C-201E,U+2020,U+2022,U+2026,"
            "U+2032-2033,U+2039-203A,U+2044,U+20A0-20AF,U+20B1-20B5,U+20B8-20BA,U+20BC-20BF,U+2113,"
            "U+2116,U+2122,U+2191,U+2193,U+2212,U+2C7C,U+2C7F,U+2DFF,U+A69F,U+A7FF,U+FEFF"
        ),
        "core": parse_ranges(
            "U+0,U+20-7E,U+A0-AC,U+AE-FF,U+131,U+152-153,U+2BB-2BC,U+2C6,U+2DA,U+2DC,U+304,U+308,"
            "U+2002,U+2009,U+200B,U+2013-2014,U+2018-201A,U+201C-201E,U+2022,U+2026,U+2032-2033,"
            "U+2039-203A,U+2044,U+20AC,U+2122,U+2191,U+2193,U+2212,U+FEFF"
        ),
        "core_categories": set(),
    },
    {
        "name": "paper-mono",
        "export": "fontMono",
        "source": "PaperMono.woff2",
        "family": "fontMono",
        "variable": "--font-paper-mono",
        "fallback": ["ui-monospace", "Menlo", "Consolas", "monospace"],
        "features": ["calt", "ccmp", "locl", "mark", "mkmk", "rvrn"],
        "minimum": {"wght": 400},
        "hinting": True,
        "coverage": None,
        "core": parse_ranges("U+2500-257F"),
        "core_categories": {"Mn"},
    },
]


def page_text(markup):
    for tag in SKIPPED_ELEMENTS:
        markup = re.sub(rf"<{tag}\b[^>]*>.*?</{tag}>", " ", markup, flags=re.S | re.I)
    markup = re.sub(r"<!--.*?-->", " ", markup, flags=re.S)
    pieces = re.split(r"<[^>]*>", markup)
    attributes = re.findall(r"""\s(?:placeholder|value)=(?:"([^"]*)"|'([^']*)')""", markup)
    return html.unescape(" ".join(pieces) + " " + " ".join(a or b for a, b in attributes))


def scan_site(out_dir):
    pages = {}
    for file in sorted(out_dir.rglob("*.html")):
        text = page_text(file.read_text(encoding="utf-8", errors="ignore"))
        pages[str(file.relative_to(out_dir))] = {ord(ch) for ch in text if not ch.isspace() or ord(ch) > 0x7F}
    css_chars = set()
    hyphenates = False
    for file in (out_dir / "_next" / "static").rglob("*.css"):
        css = file.read_text(encoding="utf-8", errors="ignore")
        hyphenates = hyphenates or re.search(r"hyphens:\s*auto", css) is not None
        for match in re.findall(r"""content:\s*(?:"([^"]*)"|'([^']*)')""", css):
            css_chars.update(map(ord, match[0] or match[1]))
    return pages, css_chars, hyphenates


def scan_source():
    chars = set()
    for folder in SOURCE_SCAN:
        base = ROOT / folder
        if not base.exists():
            continue
        for file in base.rglob("*"):
            if not file.is_file() or file.suffix not in {".ts", ".tsx", ".md", ".mdx", ".json", ".css"}:
                continue
            if ".test." in file.name:
                continue
            if "node_modules" in file.parts:
                continue
            chars.update(ord(ch) for ch in file.read_text(encoding="utf-8", errors="ignore") if ord(ch) > 0x7E)
    return chars


def plan(config, used, source_chars, hyphenates):
    cmap = set(TTFont(SOURCE_DIR / config["source"]).getBestCmap())
    drawn = cmap if config["coverage"] is None else cmap & config["coverage"]
    implicit = IMPLICIT | ({HYPHEN} if hyphenates else set())
    selected = {
        c for c in used if c in config["core"] or unicodedata.category(chr(c)) in config["core_categories"]
    }
    core = (ASCII | PUNCTUATION | implicit | selected) & drawn
    everything = (used | source_chars | LATIN_1 | LATIN_EXTENDED_A | core) & drawn
    return core, everything - core


def clip_minimum(font, axis, minimum):
    fvar_axis = next(a for a in font["fvar"].axes if a.axisTag == axis)
    if fvar_axis.defaultValue != minimum:
        raise SystemExit(f"{axis} can only be clipped at its default ({fvar_axis.defaultValue}), not {minimum}")
    original = {glyph: list(tuples) for glyph, tuples in font["gvar"].variations.items()}
    font = instancer.instantiateVariableFont(font, {axis: (minimum, fvar_axis.defaultValue, fvar_axis.maxValue)})
    font["gvar"].variations = {
        glyph: [t for t in tuples if not (t.axes.get(axis, (0, 0, 0))[1] < 0 and t.axes.get(axis, (0, 0, 0))[2] <= 0)]
        for glyph, tuples in original.items()
    }
    return font


def build(config, codepoints):
    source = TTFont(SOURCE_DIR / config["source"])
    modified = source["head"].modified
    bounds = {field: getattr(source["head"], field) for field in ["xMin", "yMin", "xMax", "yMax"]}
    extents = {field: getattr(source["hhea"], field) for field in ["minLeftSideBearing", "minRightSideBearing", "xMaxExtent"]}
    options = subset.Options()
    options.layout_features = config["features"]
    options.hinting = config["hinting"]
    options.glyph_names = True
    options.notdef_outline = True
    options.name_IDs = [0, 1, 2, 3, 4, 5, 6]
    options.drop_tables += ["STAT", "meta", "DSIG"]
    subsetter = subset.Subsetter(options)
    subsetter.populate(unicodes=sorted(codepoints))
    subsetter.subset(source)
    font = source
    for table in font["cmap"].tables:
        table.cmap = {c: glyph for c, glyph in table.cmap.items() if c in codepoints}
    for axis, minimum in config["minimum"].items():
        font = clip_minimum(font, axis, minimum)
    font["fvar"].instances = []
    axis_names = {axis.axisNameID for axis in font["fvar"].axes}
    font["name"].names = [n for n in font["name"].names if n.nameID < 256 or n.nameID in axis_names]
    font["head"].modified = modified
    for field, value in bounds.items():
        setattr(font["head"], field, value)
    for field, value in extents.items():
        setattr(font["hhea"], field, value)
    font.recalcBBoxes = False
    font.recalcTimestamp = False
    font.flavor = "woff2"
    buffer = io.BytesIO()
    font.save(buffer)
    return buffer.getvalue()


def harfbuzz_font(data):
    font = TTFont(io.BytesIO(data))
    font.flavor = None
    buffer = io.BytesIO()
    font.save(buffer)
    return hb.Font(hb.Face(buffer.getvalue()))


def draw_funcs():
    funcs = hb.DrawFuncs()
    funcs.set_move_to_func(lambda x, y, out: out.append(("M", x, y)))
    funcs.set_line_to_func(lambda x, y, out: out.append(("L", x, y)))
    funcs.set_quadratic_to_func(lambda a, b, x, y, out: out.append(("Q", a, b, x, y)))
    funcs.set_cubic_to_func(lambda a, b, c, d, x, y, out: out.append(("C", a, b, c, d, x, y)))
    funcs.set_close_path_func(lambda out: out.append(("Z",)))
    return funcs


DRAW = draw_funcs()
OUTLINES = {}


def shape(font, text, coords, features):
    font.set_variations(coords)
    buffer = hb.Buffer()
    buffer.add_str(text)
    buffer.guess_segment_properties()
    hb.shape(font, buffer, features)
    result = []
    location = tuple(sorted(coords.items()))
    for info, position in zip(buffer.glyph_infos, buffer.glyph_positions):
        key = (id(font), location, info.codepoint)
        if key not in OUTLINES:
            outline = []
            font.draw_glyph(info.codepoint, DRAW, outline)
            OUTLINES[key] = outline
        result.append((position.x_advance, position.x_offset, position.y_offset, OUTLINES[key]))
    return result


def same_shape(a, b):
    if len(a) != len(b):
        return False
    for ga, gb in zip(a, b):
        if ga[:3] != gb[:3] or len(ga[3]) != len(gb[3]):
            return False
        for pa, pb in zip(ga[3], gb[3]):
            if pa[0] != pb[0] or any(abs(x - y) > 0.05 for x, y in zip(pa[1:], pb[1:])):
                return False
    return True


def verify(config, name, data, codepoints, source_data):
    font = TTFont(io.BytesIO(data))
    source = TTFont(io.BytesIO(source_data))
    problems = []
    if set(font.getBestCmap()) != codepoints:
        problems.append("character set differs from the plan")
    for table in ["STAT", "meta"] + ([] if config["hinting"] else HINTING_TABLES):
        if table in font:
            problems.append(f"still has {table.strip()}")
    if config["hinting"] and ("prep" in source) != ("prep" in font):
        problems.append("lost the prep program")
    if font["fvar"].instances:
        problems.append("still has named instances")
    for axis in font["fvar"].axes:
        original = next(a for a in source["fvar"].axes if a.axisTag == axis.axisTag)
        expected = (config["minimum"].get(axis.axisTag, original.minValue), original.defaultValue, original.maxValue)
        if (axis.minValue, axis.defaultValue, axis.maxValue) != expected:
            problems.append(f"{axis.axisTag} axis is {axis.minValue} {axis.defaultValue} {axis.maxValue}")
    for table in ["GSUB", "GPOS"]:
        if table in font and font[table].table.FeatureList:
            extra = {r.FeatureTag for r in font[table].table.FeatureList.FeatureRecord} - set(config["features"])
            if extra:
                problems.append(f"{table} keeps {sorted(extra)}")
    metrics = [
        ("hhea", ["ascent", "descent", "lineGap"]),
        ("OS/2", ["sTypoAscender", "sTypoDescender", "sTypoLineGap", "usWinAscent", "usWinDescent", "fsSelection", "usWeightClass"]),
        ("head", ["unitsPerEm", "xMin", "yMin", "xMax", "yMax"]),
        ("post", ["formatType", "underlinePosition", "underlineThickness"]),
    ]
    for table, fields in metrics:
        for field in fields:
            if getattr(font[table], field) != getattr(source[table], field):
                problems.append(f"{table}.{field} changed")
    if "glyf" in font and not config["hinting"]:
        if any(getattr(font["glyf"][g], "program", None) and font["glyf"][g].program.getBytecode() for g in font.getGlyphOrder()):
            problems.append("glyphs still carry instructions")
    subset_font = harfbuzz_font(data)
    source_font = harfbuzz_font(source_data)
    axes = {a.axisTag: a for a in font["fvar"].axes}
    grid = [{}]
    for tag, axis in axes.items():
        values = sorted({axis.minValue, axis.defaultValue, (axis.minValue + axis.maxValue) / 2, axis.maxValue})
        grid = [dict(point, **{tag: value}) for point in grid for value in values]
    chars = [chr(c) for c in sorted(codepoints) if c > 0x20]
    partners = chars[:: max(1, len(chars) // 40)] + [ch for ch in "AVTWYafjkrty01.,-'\"(" if ch in chars]
    pairs = {a + b for a in chars for b in partners} | {b + a for a in chars for b in partners}
    texts = chars + sorted(t for t in pairs if unicodedata.normalize("NFC", t) == t)
    feature_sets = [{}] + ([{"tnum": True}] if "tnum" in config["features"] else [])
    mismatches = 0
    for coords in grid:
        for features in feature_sets:
            for text in texts:
                if not same_shape(shape(subset_font, text, coords, features), shape(source_font, text, coords, features)):
                    mismatches += 1
    if mismatches:
        problems.append(f"{mismatches} shaping results differ from the source font")
    if problems:
        raise SystemExit(f"{name}: " + "; ".join(problems))


def module_source(entries):
    lines = ['import localFont from "next/font/local"', ""]
    exports = []
    for entry in entries:
        config = entry["config"]
        for part in ["core", "extended"]:
            item = entry[part]
            suffix = "" if part == "core" else "Extended"
            const = f"{config['family']}{suffix}"
            alias = f"{config['export']}{suffix}"
            exports.append(const if const == alias else f"{const} as {alias}")
            lines.append(f"const {const} = localFont({{")
            lines.append(f'  src: "./{item["file"]}",')
            lines.append(f'  weight: "{entry["weight"]}",')
            lines.append('  style: "normal",')
            lines.append('  display: "swap",')
            if part == "core":
                lines.append(f'  variable: "{config["variable"]}",')
                fallback = ", ".join(f'"{f}"' for f in config["fallback"])
                lines.append(f"  fallback: [{fallback}],")
            else:
                lines.append("  preload: false,")
            lines.append("  adjustFontFallback: false,")
            lines.append("  declarations: [")
            lines.append(f'    {{ prop: "font-family", value: "{config["family"]}" }},')
            lines.append("    {")
            lines.append('      prop: "unicode-range",')
            lines.append("      value:")
            lines.append(f'        "{item["range"]}",')
            lines.append("    },")
            lines.append("  ],")
            lines.append("})")
            lines.append("")
    lines.append("export {")
    lines.extend(f"  {name}," for name in exports)
    lines.append("}")
    return "\n".join(lines) + "\n"


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--out", default=str(ROOT / "out"))
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    out_dir = Path(args.out)
    if not (out_dir / "index.html").exists():
        raise SystemExit(f"{out_dir} has no built site. Run pnpm build first.")
    pages, css_chars, hyphenates = scan_site(out_dir)
    used = set().union(*pages.values()) | css_chars
    source_chars = scan_source()
    entries = []
    stale = []
    for config in FONTS:
        source_data = (SOURCE_DIR / config["source"]).read_bytes()
        names = TTFont(io.BytesIO(source_data))["name"]
        notice = " ".join(str(n) for n in names.names if n.nameID in (0, 13))
        if "reserved font name" in notice.lower():
            raise SystemExit(f"{config['source']} declares a Reserved Font Name. Rename the subset before shipping it.")
        core, extended = plan(config, used, source_chars, hyphenates)
        entry = {"config": config}
        for part, codepoints in [("core", core), ("extended", extended)]:
            file = f"{config['name']}-{part}.woff2"
            entry[part] = {"file": file, "range": format_ranges(codepoints), "codepoints": codepoints}
            if args.check:
                existing = FONT_DIR / file
                if not existing.exists() or set(TTFont(existing).getBestCmap()) != codepoints:
                    stale.append(file)
                continue
            data = build(config, codepoints)
            verify(config, file, data, codepoints, source_data)
            (FONT_DIR / file).write_bytes(data)
            entry[part]["size"] = len(data)
            needed = sum(1 for chars in pages.values() if chars & codepoints)
            print(f"{file}: {len(data):,} bytes, {len(codepoints)} characters, {needed} of {len(pages)} pages contain one")
        source = TTFont(io.BytesIO(source_data))
        weight = next(a for a in source["fvar"].axes if a.axisTag == "wght")
        entry["weight"] = f"{int(config['minimum'].get('wght', weight.minValue))} {int(weight.maxValue)}"
        entries.append(entry)
    module = module_source(entries)
    if args.check:
        if not MODULE.exists() or MODULE.read_text() != module:
            stale.append(str(MODULE.relative_to(ROOT)))
        if stale:
            print("Fonts are out of date with the built site: " + ", ".join(stale), file=sys.stderr)
            print("Run pnpm fonts:subset and commit the result.", file=sys.stderr)
            sys.exit(1)
        print("Fonts match the built site.")
        return
    MODULE.write_text(module)
    print(f"wrote {MODULE.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
