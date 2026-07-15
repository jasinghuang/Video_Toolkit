"""presentation 注入模式：给 web-video-presentation 产出的 Vite+React
presentation 注入一个字幕层（显示当前 step 的 narration）。"""

from pathlib import Path


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
