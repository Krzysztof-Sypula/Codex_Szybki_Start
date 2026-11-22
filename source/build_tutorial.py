#!/usr/bin/env python3
"""Build Tutorial/quick-manual.{odt,pdf} using Pandoc and XeLaTeX."""
from pathlib import Path
import shutil
import subprocess
import tempfile
import xml.etree.ElementTree as ET
import zipfile

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "Tutorial"
NS = {
    "office": "urn:oasis:names:tc:opendocument:xmlns:office:1.0",
    "style": "urn:oasis:names:tc:opendocument:xmlns:style:1.0",
    "text": "urn:oasis:names:tc:opendocument:xmlns:text:1.0",
    "fo": "urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0",
}
for prefix, uri in NS.items():
    ET.register_namespace(prefix, uri)


def q(prefix, name):
    return f"{{{NS[prefix]}}}{name}"


def paginate(path):
    with zipfile.ZipFile(path) as archive:
        entries = [(info, archive.read(info.filename)) for info in archive.infolist()]
    content = ET.fromstring(dict((info.filename, data) for info, data in entries)["content.xml"])
    styles = content.find("office:automatic-styles", NS)
    if styles is None:
        raise RuntimeError("ODT has no automatic styles")
    # Each top-level section starts a page; title metadata stays on page one.
    for index, heading in enumerate(content.findall(".//text:h", NS)):
        if heading.get(q("text", "outline-level")) != "1":
            continue
        name = f"ManualPage{index}"
        style = ET.SubElement(styles, q("style", "style"), {
            q("style", "name"): name,
            q("style", "family"): "paragraph",
            q("style", "parent-style-name"): heading.get(q("text", "style-name"), "Heading_20_1"),
        })
        ET.SubElement(style, q("style", "paragraph-properties"), {q("fo", "break-before"): "page"})
        heading.set(q("text", "style-name"), name)
    with zipfile.ZipFile(path, "w") as archive:
        for info, data in entries:
            archive.writestr(info, ET.tostring(content, encoding="utf-8", xml_declaration=True)
                             if info.filename == "content.xml" else data)


def main():
    for executable in ("pandoc", "xelatex"):
        if shutil.which(executable) is None:
            raise SystemExit(f"Required executable not found: {executable}")
    with tempfile.TemporaryDirectory(prefix="saper-docs-") as directory:
        work = Path(directory)
        odt = work / "quick-manual.odt"
        subprocess.run(["pandoc", str(DOCS / "quick-manual.md"), "--standalone", "-o", str(odt)], check=True)
        paginate(odt)
        pdf = work / "quick-manual.pdf"
        header = work / "layout.tex"
        header.write_text("\\usepackage{titlesec}\n\\newcommand{\\sectionbreak}{\\clearpage}\n", encoding="utf-8")
        subprocess.run(["pandoc", str(DOCS / "quick-manual.md"), "--standalone",
                        "--pdf-engine=xelatex", "-V", "mainfont=DejaVu Serif",
                        "-V", "monofont=DejaVu Sans Mono", "-V", "geometry:margin=22mm",
                        "-V", "fontsize=11pt", "-V", "papersize=a4",
                        "--include-in-header", str(header), "-o", str(pdf)], check=True)
        if not pdf.is_file() or pdf.stat().st_size == 0:
            raise SystemExit("Pandoc did not produce a PDF")
        for artifact in (odt, pdf):
            shutil.copy2(artifact, DOCS / artifact.name)
            print(DOCS / artifact.name)


if __name__ == "__main__":
    main()
