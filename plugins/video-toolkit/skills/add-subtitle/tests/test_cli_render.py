import subprocess
import sys
from pathlib import Path

SCRIPT = Path(__file__).resolve().parent.parent / "skill_main.py"


def _write_srt(path: Path) -> None:
    path.write_text(
        "1\n00:00:01,000 --> 00:00:02,500\n测试字幕\n",
        encoding="utf-8",
    )


def test_video_is_required(tmp_path: Path):
    srt = tmp_path / "a.srt"
    _write_srt(srt)
    result = subprocess.run(
        [sys.executable, str(SCRIPT), str(srt)],
        capture_output=True,
        text=True,
    )
    # 不传 --video 应非零退出
    assert result.returncode != 0


def test_render_outputs_subtitle_html_with_spec_css(tmp_path: Path):
    srt = tmp_path / "a.srt"
    _write_srt(srt)
    video = tmp_path / "v.mp4"
    video.write_text("dummy")  # 渲染只取路径，不校验视频有效性

    result = subprocess.run(
        [
            sys.executable, str(SCRIPT), str(srt),
            "--video", str(video),
            "-o", str(tmp_path),
        ],
        capture_output=True,
        text=True,
    )
    assert result.returncode == 0, result.stderr

    out = tmp_path / "a_subtitle.html"
    assert out.exists(), f"输出文件未生成: {out}"
    html = out.read_text(encoding="utf-8")

    # spec 规定的固定样式参数
    assert "border: 1.3px solid #000" in html
    assert "border-radius: 9px" in html
    assert "padding: 6px 20px" in html
    assert "box-shadow: 0 5px 16px rgba(0,0,0,0.28)" in html
    assert "font-size: clamp(12px, 2.4cqw, 28px)" in html
    # 同步用 timeupdate，不再有逐帧动画
    assert "timeupdate" in html
    assert "requestAnimationFrame" not in html
    # 字幕文本被渲染
    assert "测试字幕" in html


def test_no_palette_or_style_params_in_help(tmp_path: Path):
    result = subprocess.run(
        [sys.executable, str(SCRIPT), "--help"],
        capture_output=True,
        text=True,
    )
    assert result.returncode == 0
    help_text = result.stdout
    for removed in ["--palette", "--style", "--srt2", "--lyric", "--highlight-color"]:
        assert removed not in help_text, f"已废弃参数仍出现在 --help: {removed}"
    assert "--video" in help_text


def test_presentation_mode_injects_subtitle(tmp_path: Path):
    # 构造最小 presentation（复用 fixture App.tsx）
    fixture_app = (
        Path(__file__).resolve().parent / "fixtures" / "sample-presentation" / "src" / "App.tsx"
    ).read_text(encoding="utf-8")
    pres = tmp_path / "presentation"
    (pres / "src").mkdir(parents=True)
    (pres / "src" / "App.tsx").write_text(fixture_app, encoding="utf-8")

    result = subprocess.run(
        [sys.executable, str(SCRIPT), "--presentation", str(pres)],
        capture_output=True, text=True,
    )
    assert result.returncode == 0, result.stderr
    assert (pres / "src" / "components" / "Subtitle.tsx").exists()
    assert (pres / "src" / "components" / "Subtitle.css").exists()
    assert "Subtitle" in (pres / "src" / "App.tsx").read_text(encoding="utf-8")


def test_presentation_and_video_are_mutually_exclusive(tmp_path: Path):
    srt = tmp_path / "a.srt"
    _write_srt(srt)
    result = subprocess.run(
        [sys.executable, str(SCRIPT), str(srt), "--video", "v.mp4", "--presentation", str(tmp_path)],
        capture_output=True, text=True,
    )
    assert result.returncode != 0


def test_help_lists_presentation_flag():
    result = subprocess.run(
        [sys.executable, str(SCRIPT), "--help"], capture_output=True, text=True,
    )
    assert result.returncode == 0
    assert "--presentation" in result.stdout
