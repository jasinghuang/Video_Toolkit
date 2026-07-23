# add-subtitle presentation 同步优化

**日期**: 2026-07-23
**状态**: 已确认

## 目标

优化 `add-subtitle` skill 的 presentation 注入模式，使其能感知 web-video-presentation 项目的变更并相应修复，同时保留视频+SRT 模式不变。

## 场景覆盖

| 场景 | 问题 | 解决 |
|------|------|------|
| App.tsx 被重生成（注入丢失） | Subtitle 组件不再渲染 | `--check` 检测 → 默认模式重新 patch |
| Subtitle 组件版本过旧 | 模板升级后本地文件是旧版 | 总是覆盖写入 Subtitle.tsx/.css |
| narration 文案超 18 字 | 单行溢出 | `--check` 检测告警 + 组件截断兜底 |
| narration 增删 step | `stepText` 动态绑定，自动跟随 | 无需处理 |

## CLI 接口

```
add-subtitle subtitle.srt --video video.mp4          # 视频模式（不变）
add-subtitle --presentation /path/to/pres             # 修复模式：注入/更新
add-subtitle --presentation /path/to/pres --check     # 检测模式：只读诊断
```

- `--check` 只读不写，exit code 0 = 全部通过，1 = 有问题
- 默认模式 = 修复（覆盖组件文件 + 幂等 patch App.tsx + 文案告警）
- `--check` 与 srt/video 互斥

## --check 检测项（4 项）

按严重程度排序：

### 1. 结构兼容（FAIL）
- 检查 App.tsx 是否含 `stepText` + `<Stage`
- 不通过 = 不是标准 web-video-presentation 项目，后续所有操作无意义

### 2. 注入完整性（FAIL）
- 检查 App.tsx 是否已有 `import { Subtitle }` 行 + `<Subtitle text={stepText} />` 挂载
- 不通过 = 注入丢失（可能是 App.tsx 被重生成）

### 3. 组件新鲜度（WARN）
- 检查 Subtitle.tsx / Subtitle.css 是否存在
- 与内置模板做内容 hash 对比，不同则标记过期
- 不通过 = 模板升级后本地文件是旧版，但功能仍可用

### 4. 文案合规（FAIL / WARN）
- 扫描 `src/chapters/*/narrations.ts`，提取所有 narration 字符串
- 数中文字符（含中文标点），> 18 字则报告
- 输出：文件路径、行号、原文片段、字数

## 默认修复模式行为

1. 结构校验（不通过则报错退出，不动文件）
2. 总是覆盖写入 Subtitle.tsx + Subtitle.css
3. 幂等 patch App.tsx（已有 import 则跳过）
4. 扫描文案超长，只 warn 不修

## Subtitle.tsx 组件增强

新增 ≤18 字截断逻辑：

```tsx
const display = text.length > 18 ? text.slice(0, 18) + "…" : text;
```

CSS 增加 `overflow: hidden; text-overflow: ellipsis` 双重兜底。

## 实现清单

### presentation.py
- [ ] 新增 `check_presentation(pres_dir: Path) -> dict` — 执行 4 项检测，返回结果字典
- [ ] 新增 `format_check_report(results: dict) -> str` — 格式化为结构化文本
- [ ] 修改 `inject_presentation` — 步骤 4 加文案扫描告警
- [ ] 新增 `scan_long_narrations(pres_dir: Path) -> list` — 扫描 narrations.ts 中 >18 字的条目
- [ ] 更新 `build_subtitle_tsx()` — 加入截断逻辑
- [ ] 更新 `build_subtitle_css()` — 加入 text-overflow 保护

### skill_main.py
- [ ] 新增 `--check` flag
- [ ] `--check` + `--presentation` 走 check 路径
- [ ] 不加 `--check` 的 `--presentation` 走修复路径（兼容现有行为）
- [ ] `--check` 与 srt/video 互斥校验

### SKILL.md
- [ ] 更新文档：`--check` 用法、检测项说明、输出示例

### tests/
- [ ] `test_check_passes_clean_presentation` — 干净项目全 PASS
- [ ] `test_check_catches_missing_injection` — 未注入的 App.tsx → FAIL
- [ ] `test_check_catches_long_narration` — 超长文案 → FAIL
- [ ] `test_scan_long_narrations` — narrations.ts 扫描逻辑
- [ ] `test_subtitle_truncation` — 组件截断逻辑
- [ ] `test_check_rejects_srt_with_check` — --check + srt 互斥报错

## 不做

- 字幕样式自适应主题（保持硬编码黑字白底）
- 自动断句（引导用户拆分 step）
- watch 模式
- --fix 显式 flag（默认就是修复，保持简洁）
