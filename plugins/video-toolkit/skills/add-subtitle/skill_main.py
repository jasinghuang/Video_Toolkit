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
        description="Overlay SRT subtitles onto a video OR inject subtitle layer into a presentation",
    )
    parser.add_argument("srt_file", nargs="?", type=str, help="Input SRT file (video mode)")
    parser.add_argument("--video", type=str, help="Video file path (video mode, required with srt_file)")
    parser.add_argument("--presentation", type=str, help="Presentation directory (inject subtitle layer)")
    parser.add_argument("--output", "-o", type=str, help="Output directory (video mode)")
    parser.add_argument("--check", action="store_true", help="Check mode: diagnose presentation only, no writes")
    args = parser.parse_args()

    # --check 与 srt_file/--video 互斥
    if args.check and (args.srt_file or args.video):
        parser.error("--check 与 srt_file/--video 互斥")

    # presentation 模式
    if args.presentation:
        from presentation import check_presentation, format_check_report, inject_presentation

        pres_path = Path(args.presentation).expanduser()
        if not pres_path.is_dir():
            print(f"Error: Presentation directory not found: {pres_path}")
            sys.exit(1)

        if args.check:
            # 只读诊断模式
            print(f"\n{'=' * 60}")
            print("add-subtitle --check")
            print(f"{'=' * 60}")
            print(f"  Target: {pres_path}")
            print()
            results = check_presentation(pres_path)
            print(format_check_report(results))
            print(f"\n{'=' * 60}\n")
            # exit 0 if all pass, 1 otherwise
            has_issues = any(
                e["status"] in ("fail", "warn") for e in results.values()
            )
            sys.exit(1 if has_issues else 0)
        else:
            # 修复模式（原逻辑 + 末尾文案扫描告警）
            if args.srt_file or args.video:
                parser.error("--presentation 与 srt_file/--video 互斥")
            print(f"\n{'=' * 60}")
            print("add-subtitle — Inject subtitle layer into presentation")
            print(f"{'=' * 60}")
            print(f"  Target: {pres_path}")
            inject_presentation(pres_path)
            # 文案扫描告警
            from presentation import scan_long_narrations
            long_lines = scan_long_narrations(pres_path)
            if long_lines:
                print(f"\n  ⚠ {len(long_lines)} narration(s) exceed 18 chars:")
                for item in long_lines:
                    text_preview = item["text"][:30] + ("..." if len(item["text"]) > 30 else "")
                    print(f"    {item['file']}  L{item['line']}  \"{text_preview}\" ({item['char_count']}字)")
                print("  → 建议在口播稿中将以上文案拆分为多个 step")
            print(f"{'=' * 60}\nDone!\n{'=' * 60}\n")
        return

    # 视频模式（原有逻辑）
    if not args.srt_file:
        parser.error("需要 srt_file（视频模式）或 --presentation（注入模式）")
    if not args.video:
        parser.error("视频模式需要 --video")

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

    print(f"\n{'=' * 60}\nDone!\n{'=' * 60}\n")


if __name__ == "__main__":
    main()
