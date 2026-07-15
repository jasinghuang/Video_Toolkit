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
