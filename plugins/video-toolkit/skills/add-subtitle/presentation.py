"""presentation 注入模式：给 web-video-presentation 产出的 Vite+React
presentation 注入一个字幕层（显示当前 step 的 narration）。"""

import re
from pathlib import Path


def check_presentation(pres_dir: Path) -> dict:
    """Run 3 checks on a presentation directory. Read-only, no side effects.

    Returns a dict with keys: structure, injection, components.
    Each value has 'status' ("pass"|"fail"|"warn") and 'msg'.
    """
    app_path = pres_dir / "src" / "App.tsx"
    components_dir = pres_dir / "src" / "components"
    sub_tsx = components_dir / "Subtitle.tsx"
    sub_css = components_dir / "Subtitle.css"

    # 1) 结构兼容
    if not app_path.exists():
        structure = {"status": "fail", "msg": f"App.tsx 不存在: {app_path}"}
    else:
        app_content = app_path.read_text(encoding="utf-8")
        try:
            validate_presentation(app_content)
            structure = {"status": "pass", "msg": "App.tsx 含 stepText + <Stage"}
        except ValueError as e:
            structure = {"status": "fail", "msg": str(e)}

    # 2) 注入完整性
    if not app_path.exists():
        injection = {"status": "fail", "msg": "App.tsx 不存在，无法检查注入"}
    else:
        has_import = SUBTITLE_IMPORT in app_content
        has_mount = "<Subtitle text={stepText} />" in app_content
        if has_import and has_mount:
            injection = {"status": "pass", "msg": "Subtitle import + 挂载完整"}
        elif has_import:
            injection = {"status": "fail", "msg": "import 存在但缺少 <Subtitle> 挂载"}
        elif has_mount:
            injection = {"status": "fail", "msg": "挂载存在但缺少 import 行"}
        else:
            injection = {"status": "fail", "msg": "未注入：缺少 Subtitle import 和挂载"}

    # 3) 组件新鲜度
    if not sub_tsx.exists() or not sub_css.exists():
        missing = []
        if not sub_tsx.exists():
            missing.append("Subtitle.tsx")
        if not sub_css.exists():
            missing.append("Subtitle.css")
        components = {
            "status": "warn",
            "msg": f"组件缺失: {', '.join(missing)}",
            "detail": "missing",
        }
    else:
        current_tsx = sub_tsx.read_text(encoding="utf-8")
        current_css = sub_css.read_text(encoding="utf-8")
        expected_tsx = build_subtitle_tsx()
        expected_css = build_subtitle_css()
        tsx_match = current_tsx == expected_tsx
        css_match = current_css == expected_css
        if tsx_match and css_match:
            components = {
                "status": "pass",
                "msg": "Subtitle.tsx/.css 与模板一致",
                "detail": "ok",
            }
        else:
            stale = []
            if not tsx_match:
                stale.append("Subtitle.tsx")
            if not css_match:
                stale.append("Subtitle.css")
            components = {
                "status": "warn",
                "msg": f"组件过期: {', '.join(stale)}（内容与最新模板不一致）",
                "detail": "stale",
            }

    return {
        "structure": structure,
        "injection": injection,
        "components": components,
    }


def format_check_report(results: dict) -> str:
    """Format check_presentation() results as structured terminal text."""
    labels = {
        "structure": "结构兼容",
        "injection": "注入完整",
        "components": "组件新鲜度",
    }
    status_mark = {"pass": "[PASS]", "warn": "[WARN]", "fail": "[FAIL]"}

    lines = []
    lines.append("=== add-subtitle --check ===")
    for key in ["structure", "injection", "components"]:
        entry = results[key]
        mark = status_mark.get(entry["status"], "[????]")
        label = labels[key]
        lines.append(f"{mark} {label} — {entry['msg']}")

    # 摘要
    statuses = [e["status"] for e in results.values()]
    fail_count = statuses.count("fail")
    warn_count = statuses.count("warn")
    pass_count = statuses.count("pass")
    lines.append("")
    lines.append(f"Summary: {pass_count} PASS, {warn_count} WARN, {fail_count} FAIL")

    return "\n".join(lines)


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
          const display = text.replace(/[，。！？、；：,.!?;:]+$/, "");
          if (!display) return null;
          return (
            <div className="subtitle-layer">
              <span className="subtitle-badge">{display}</span>
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
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 90%;
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
