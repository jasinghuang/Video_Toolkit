#!/usr/bin/env python3
"""
add-subtitle — 把 SRT 字幕以"黑字白底圆角描边标签"样式叠加到视频上，
输出自包含 HTML 播放页。约定输入 SRT 每条 ≤12 字（超出由上游 text-refine 切分）。
"""

import argparse
import re
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path

TEMPLATES_DIR = Path(__file__).parent / "templates"


def check_jinja2():
    try:
        import jinja2  # noqa: F401
        return True
    except ImportError:
        return False


def install_jinja2():
    print("Installing jinja2...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "jinja2"])


@dataclass
class Subtitle:
    index: int
    start: float
    end: float
    text: str

    def __post_init__(self):
        self.text = self.text.replace("\n", " ")


def parse_timestamp(ts: str) -> float:
    m = re.match(r"(\d+):(\d+):(\d+)[,.](\d+)", ts.strip())
    if not m:
        raise ValueError(f"Invalid timestamp: {ts}")
    h, mi, s, ms = m.groups()
    ms = ms.ljust(3, "0")[:3]
    return int(h) * 3600 + int(mi) * 60 + int(s) + int(ms) / 1000


def parse_srt(srt_path: Path) -> list[Subtitle]:
    content = srt_path.read_text(encoding="utf-8")
    blocks = re.split(r"\n\s*\n", content.strip())
    subtitles = []

    for block in blocks:
        lines = block.strip().split("\n")
        if len(lines) < 3:
            continue
        try:
            index = int(lines[0].strip())
        except ValueError:
            continue
        time_match = re.match(
            r"(\d+:\d+:\d+[,.]\d+)\s*-->\s*(\d+:\d+:\d+[,.]\d+)", lines[1].strip()
        )
        if not time_match:
            continue
        start = parse_timestamp(time_match.group(1))
        end = parse_timestamp(time_match.group(2))
        text = "\n".join(lines[2:]).strip()
        if text:
            subtitles.append(Subtitle(index=index, start=start, end=end, text=text))
    return subtitles


def ensure_relative(video_path: Path, output_dir: Path) -> str:
    try:
        return video_path.relative_to(output_dir).as_posix()
    except ValueError:
        return video_path.name


def render_html(subtitles, output_path: Path, srt_name: str, video_path: str):
    from dataclasses import asdict

    from jinja2 import Environment, FileSystemLoader

    env = Environment(loader=FileSystemLoader(str(TEMPLATES_DIR)), autoescape=True)
    # 让 tojson 直出中文字符（默认 ensure_ascii=True 会转义成 \uXXXX）
    env.policies["json.dumps_kwargs"]["ensure_ascii"] = False
    template = env.get_template("player.html.j2")
    html = template.render(
        subtitles=[asdict(s) for s in subtitles],
        srt_name=srt_name,
        video_path=video_path,
    )
    output_path.write_text(html, encoding="utf-8")
    print(f"  Saved: {output_path}")


def main():
    parser = argparse.ArgumentParser(
        description="Overlay SRT subtitles onto a video as a self-contained HTML page",
    )
    parser.add_argument("srt_file", type=str, help="Input SRT file path")
    parser.add_argument("--video", type=str, required=True, help="Video file path (required)")
    parser.add_argument("--output", "-o", type=str, help="Output directory")
    args = parser.parse_args()

    if not check_jinja2():
        install_jinja2()

    srt_path = Path(args.srt_file).expanduser()
    if not srt_path.exists():
        print(f"Error: SRT file not found: {srt_path}")
        sys.exit(1)

    video_path = Path(args.video).expanduser()
    if not video_path.exists():
        print(f"Error: Video file not found: {video_path}")
        sys.exit(1)

    output_dir = Path(args.output).expanduser() if args.output else srt_path.parent
    output_dir.mkdir(parents=True, exist_ok=True)

    base_name = srt_path.stem
    subtitles = parse_srt(srt_path)
    if not subtitles:
        print("Error: No valid subtitles found in SRT file")
        sys.exit(1)

    video_rel = ensure_relative(video_path, output_dir)

    print(f"\n{'=' * 60}")
    print("add-subtitle — Overlay subtitles onto video")
    print(f"{'=' * 60}")
    print(f"  Input:     {srt_path.name}")
    print(f"  Video:     {video_path.name}")
    print(f"  Subtitles: {len(subtitles)} entries")
    print(f"  Output:    {base_name}_subtitle.html")
    print(f"{'=' * 60}\n")

    render_html(
        subtitles=subtitles,
        srt_name=base_name,
        video_path=video_rel,
        output_path=output_dir / f"{base_name}_subtitle.html",
    )

    print(f"\n{'=' * 60}")
    print("Done!")
    print(f"{'=' * 60}\n")


if __name__ == "__main__":
    main()
