# add-subtitle: 去掉 presentation 注入模式字数限制

2026-07-27 · 重构 · scope: presentation 注入模式 only

## 目标

重构 `add-subtitle` skill 的 presentation 注入模式：

1. 字幕文字保留从 `narrations.ts` 读取（不变）
2. 样式保留黑字白底圆角描边（不变）
3. Subtitle 组件渲染时 strip 句末标点符号（新增）
4. 取消 18 字硬截断，字数跟随 `narrations.ts` 原始文本（变更）
5. 单行字幕（不变，CSS `white-space: nowrap` 兜底）

## 不在 scope

- 视频模式（SRT + 视频）—— 完全不动
- `Subtitle.css` 样式 —— 完全不动
- `narrations.ts` 源文件 —— 不修改，标点 strip 仅在组件渲染时生效

## 改动清单（6 个文件）

### 1. `presentation.py`

| 位置 | 改动 | 说明 |
|------|------|------|
| `build_subtitle_tsx()` | 删除 `MAX_CHARS` 常量；`display` 改为 `text.replace(/[，。！？、；：,.!?;:]+$/, "")` | 去掉截断 + 句末去标点 |
| `build_subtitle_css()` | **不动** | 样式不变 |
| `scan_long_narrations()` | **整段删除**（L17-41） | 字数限制已取消 |
| `check_presentation()` | 删除第 4 项 narrations 检测；删除 `max_chars` 参数 | 签名变 `def check_presentation(pres_dir: Path) -> dict` |
| `format_check_report()` | 遍历 key 列表去掉 `"narrations"`；删除 `labels` 中对应条目；删除 `long_lines` 详情打印段；docstring `4 checks` → `3 checks` | 与 check 结果结构对齐 |

### 2. `skill_main.py`

| 位置 | 改动 |
|------|------|
| L118 import | `from presentation import check_presentation, format_check_report, inject_presentation`（去掉 `, scan_long_narrations`） |
| L149-157 | 删除注入成功后调用 `scan_long_narrations` 的整段告警代码块 |

### 3. `SKILL.md`

| 位置 | 改动 |
|------|------|
| description frontmatter | 去掉 `≤18 字` / `文案合规` 描述 |
| `--check` 检测项表格 | 从 4 项变 3 项（删「文案合规」行） |
| `--check` 输出示例 | 删 `[FAIL] 文案合规` 行，Summary `4` → `3` |
| L77-78 | 删 `（文案超长除外，需手动拆分 step）` |
| L92-97 | 整个段落（presentation 注入模式 ≤18 字说明）重写为"字幕文本跟随 narrations.ts，不做字数限制" |

### 4. `tests/test_presentation.py`

| 测试 | 操作 |
|------|------|
| `test_build_subtitle_tsx_contains_component_and_hide_key` | 删除 `MAX_CHARS` 断言；新增 `text.replace` 断言 |
| **新增** `test_build_subtitle_tsx_strips_trailing_punctuation` | 覆盖：中文尾缀标点、英文尾缀句号、无尾缀文字、仅标点输入 |
| `test_scan_long_narrations_finds_overlong` | 删除 |
| `test_scan_long_narrations_empty_when_no_narrations_dir` | 删除 |
| `test_scan_long_narrations_empty_when_all_short` | 删除 |
| `test_check_catches_long_narrations` | 删除 |
| `test_check_passes_clean_presentation` | 删除 `max_chars=100` 实参 |
| `test_check_catches_missing_injection` | 删除 `max_chars=100` 实参 |
| `test_check_rejects_non_standard_structure` | 删除 `max_chars=18` 实参 |
| `test_format_check_report_all_pass` | results 字典删除 `"narrations"` key |
| `test_format_check_report_with_failures` | results 字典删除 `"narrations"` key；相应调整预期输出 |

### 5. `tests/test_cli_render.py`

| 测试 | 操作 |
|------|------|
| `test_check_mode_reports_fail_on_long_narrations` | 删除（依赖已不存在的 narrations check） |

### 6. `tests/conftest.py`

检查是否有 `scan_long_narrations` 或 `max_chars` 引用，有则同步清理。

## 设计决策

### 句末标点 strip 放在组件渲染时（不改源文件）

理由：`narrations.ts` 是 TTS 合成的输入源，保留标点有助于 TTS 引擎做自然停顿。字幕显示不需要尾缀标点，在渲染层 strip 即可。

正则 `/[，。！？、；：,.!?;:]+$/` 覆盖中英文常见句末标点，不做句中处理。

### CSS `text-overflow: ellipsis` 保留作为兜底

在 1920×1080 舞台、40px 字号、`max-width: 90%`、左右各 40px padding 条件下，单行约容纳 38 个中文字后触发省略号。这不是主动截断，而是 CSS 的渲染安全网——防止极端长文本撑破布局。用户正常使用不会触发（narrations 通常 3~40 字/step）。

### 删除而不是降级 `scan_long_narrations`

不再有字数限制，函数无存在意义。改为 warn（如 >50 字告警）会在无限制的前提下引入新的主观阈值，反而模糊了"不做限制"的语义。

### `check_presentation()` 的 `max_chars` 参数一并删除

narrations check 删除后该参数成为死参数，保留会造成 API 误导。

## 风险与缓解

| 风险 | 缓解 |
|------|------|
| 超长 narration（60+ 字）会被 CSS 静默截断，用户无感知 | CSS `text-overflow: ellipsis` 截断阈值约 38 字，正常 step 口播不会超。极端情况由 TTS 时长（60 字 ≈ 15s）和 Auto 模式体验间接提醒用户拆 step |
| 丢失了 `--check` 对 narration 长度的预防机制 | 替代机制：`CHAPTER-CRAFT.md` 完工自检已包含"动画时长 ≤ 口播时长"约束，间接控制单 step 口播长度 |
