"""presentation 注入模式：给 web-video-presentation 产出的 Vite+React
presentation 注入一个字幕层（显示当前 step 的 narration）。"""

import re
from pathlib import Path

# Matches single/double-quoted and template-literal strings with >= 10 chars
_STRING_RE = re.compile(r"""['"`]([^'"`\n]{10,})['"`]""")


def _is_chinese_text(text: str) -> bool:
    """Check if text contains CJK characters (vs code identifiers)."""
    return any('一' <= c <= '鿿' or '　' <= c <= '〿'
               for c in text)


def scan_long_narrations(pres_dir: Path, max_chars: int = 18) -> list[dict]:
    """Scan src/chapters/**/narrations.ts for narration strings > max_chars.

    Returns a list of dicts: {file, line, text, char_count}. Empty if all ok.
    """
    chapters_dir = pres_dir / "src" / "chapters"
    if not chapters_dir.is_dir():
        return []

    long_lines = []
    for narr_file in sorted(chapters_dir.rglob("narrations.ts")):
        for lineno, line in enumerate(narr_file.read_text(encoding="utf-8").splitlines(), 1):
            for m in _STRING_RE.finditer(line):
                text = m.group(1)
                if not _is_chinese_text(text):
                    continue
                char_count = len(text)
                if char_count > max_chars:
                    long_lines.append({
                        "file": str(narr_file),
                        "line": lineno,
                        "text": text,
                        "char_count": char_count,
                    })
    return long_lines


def validate_presentation(content: str) -> None:
    """校验 App.tsx 文本是标准 web-video-presentation 结构。

    必须含 `stepText`（当前 narration 变量）和 `<Stage`（舞台组件）。
    不符合则抛 ValueError——后续 patch 不动文件。
    """
    if "stepText" not in content:
        raise ValueError(
            "App.tsx 未找到 stepText：不是标准 web-video-presentation 结构，"
            "可能模板已变更，拒绝注入"
        )
    if "<Stage" not in content:
        raise ValueError(
            "App.tsx 未找到 <Stage>：不是标准 web-video-presentation 结构，"
            "可能模板已变更，拒绝注入"
        )


from textwrap import dedent


def build_subtitle_tsx() -> str:
    """返回 Subtitle.tsx 文件内容。"""
    return dedent(
        """\
        import { useEffect, useState } from "react";
        import "./Subtitle.css";

        interface SubtitleProps {
          text: string;
        }

        export function Subtitle({ text }: SubtitleProps) {
          const [hidden, setHidden] = useState(false);
          useEffect(() => {
            const onKey = (e: KeyboardEvent) => {
              if (e.key === "h" || e.key === "H") setHidden((v) => !v);
            };
            window.addEventListener("keydown", onKey);
            return () => window.removeEventListener("keydown", onKey);
          }, []);
          if (!text || hidden) return null;
          return (
            <div className="subtitle-layer">
              <span className="subtitle-badge">{text}</span>
            </div>
          );
        }
        """
    )


def build_subtitle_css() -> str:
    """返回 Subtitle.css 文件内容（舞台坐标 1920×1080，参数经真实画面 mockup 标定）。"""
    return dedent(
        """\
        .subtitle-layer {
          position: absolute;
          bottom: 86px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 50;
          pointer-events: none;
        }

        .subtitle-badge {
          display: inline-block;
          font-family: "FZLanTingHei", "PingFang SC", "Microsoft YaHei", sans-serif;
          font-weight: 600;
          font-size: 40px;
          line-height: 1.2;
          letter-spacing: 0.06em;
          color: #000;
          background: #fff;
          border: 2.5px solid #000;
          border-radius: 18px;
          padding: 12px 40px;
          box-shadow: 0 10px 32px rgba(0, 0, 0, 0.28);
          white-space: nowrap;
        }
        """
    )


SUBTITLE_IMPORT = 'import { Subtitle } from "./components/Subtitle";'


def patch_app_tsx(content: str) -> str:
    """给 App.tsx 文本加 Subtitle 的 import 和挂载。幂等。

    - import 加在连续 import 块的末尾。
    - 挂载点：<Stage ...> 块内、</Stage> 之前插入 <Subtitle text={stepText} />。
    - 已含 import 视为已注入，原样返回。
    """
    if SUBTITLE_IMPORT in content:
        return content

    # 1) 在第一段连续 import 行之后插入 Subtitle import
    content = re.sub(
        r"((?:^import[^\n]*\n)+)",
        lambda m: m.group(1) + SUBTITLE_IMPORT + "\n",
        content,
        count=1,
        flags=re.MULTILINE,
    )

    # 2) 在 <Stage ...>...</Stage> 块的 </Stage> 之前挂载 Subtitle
    content = re.sub(
        r"(<Stage[^>]*>[\s\S]*?)(</Stage>)",
        lambda m: m.group(1) + "      <Subtitle text={stepText} />\n    " + m.group(2),
        content,
        count=1,
    )
    return content


def inject_presentation(presentation_dir: Path) -> None:
    """给 presentation 项目注入字幕层：校验 → 生成组件/CSS → patch App.tsx。

    幂等：重复运行不重复 patch。
    """
    app_path = presentation_dir / "src" / "App.tsx"
    if not app_path.exists():
        raise ValueError(f"未找到 {app_path}：不是 web-video-presentation 项目")

    original = app_path.read_text(encoding="utf-8")
    validate_presentation(original)  # 失败抛 ValueError，下面不执行

    components_dir = presentation_dir / "src" / "components"
    components_dir.mkdir(parents=True, exist_ok=True)
    (components_dir / "Subtitle.tsx").write_text(build_subtitle_tsx(), encoding="utf-8")
    (components_dir / "Subtitle.css").write_text(build_subtitle_css(), encoding="utf-8")
    print(f"  Generated: {components_dir / 'Subtitle.tsx'}")
    print(f"  Generated: {components_dir / 'Subtitle.css'}")

    patched = patch_app_tsx(original)
    if patched != original:
        app_path.write_text(patched, encoding="utf-8")
        print(f"  Patched:   {app_path}")
    else:
        print(f"  Already injected: {app_path}")
