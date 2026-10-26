# wazhanggui-code · 原型代码仓库

> 本目录是**唯一上传 GitHub** 的一层。业务 PRD 在上一级 `开发PRD/`（不上库）。

## 一、文档在哪

| 端 | 页面原型 | 页面说明（跟着代码走） |
|---|---|---|
| 运营管理端（PC） | `yunying-PC/*.html` | `yunying-PC/prd/{NN}-{模块}/*.md`（一页一文件） |
| 商户端 App | `shanghu-APP/*.html` | `shanghu-APP/prd/`（规划中：功能族） |
| 买家端 App | `mai-APP/*.html` | `mai-APP/prd/F{NN}-{功能族}.md`（**一族一文件，族内每页一节**） |

- 索引：`{端}/prd/README.md`　｜　机器可读：`mai-APP/prd/manifest.json`
- 规范：`../开发PRD/原型页面产品逻辑说明撰写标准.md` **v1.2**

## 二、怎么看

打开任意原型页面 → **整页右下角**「产品逻辑说明」→ 浏览器**右侧面板**加载本页说明。

- PC：一页一 `.prd.html`
- App：抽屉加载 `prd/_views/{族}-p{N}.prd.html`（单页视图，仅本页 10 节 + 折叠的族通用说明）
- **手机框预览**（`mai-APP/index-app-mai.html`）：按钮与面板挂到浏览器层，**不在 393px 手机框内**；打开面板时左侧手机原型仍可见（无遮罩）
  - 同源 iframe：挂到父文档（`host=parent`）
  - 跨域 iframe（IDE 预览常见）：子页 `postMessage` 通知外壳，由外壳渲染按钮与右侧面板（外壳里 `#ppd-bridge` 一段脚本，可整块删除）
  - 面板打开时**原型整体左移**（空间不足自动隐藏左侧说明栏）；点**外壳空白处 / × / Esc** 收起，**手机内操作不关闭**；在手机里切页时右侧内容**原地刷新**（切到无说明页则自动隐藏并收起）
  - 单页直开：面积极限就是该页视口，说明抽屉只能在页内

## 三、怎么改 / 怎么生成

```powershell
# 改 md 后重新生成（PC 与 App 都跑这一条）
node tools\build-prd.mjs --root . --views

# 一致性检查（交付前 ERROR 必须为 0）
node tools\check-page-prd.mjs --root .

# 「存在但无效」检测（交付前 ERROR 必须为 0）
node tools\check-smoke.mjs --dir yunying-PC
```

> **两个检查不能互替**：`check-page-prd` 查「文档 ↔ 页面」是否一致；`check-smoke` 查「页面自身通不通电」——
> 表单控件有没有接进保存、保存是不是只弹 toast、函数分支是不是死代码、数据字段有没有接进渲染。
> 后者专治"脚本全绿但演示一点就穿帮"。

- `--views`：把移动端族文档按 `## N. 页面名 \`file.html\`` 切成单页视图，输出到 `prd/_views/`（**生成物，勿手改**）
- 校验：断链 / 漏登 / 未挂载 / 页面比文档新 / 统计卡数量 / 提示文案能否在源码命中

## 四、怎么剥离（交付外部时）

```powershell
# ① 删挂载器
Remove-Item shared\page-prd.js
# ② 批量删页面末尾那一行 <script src="../shared/page-prd.js"></script>
# ③ 删各端 prd/ 目录（可选，md 不影响运行）
```

剥离后原型功能与样式完全不变——说明文档是**纯增量**。

## 五、新增一个移动端功能族

1. 定族（4–12 页，同一业务闭环）→ 写 `{端}/prd/F{NN}-{族名}.md`
2. 每页标题写成 `## N. 页面名 \`file.html\``，正文 10 节
3. 页面末尾加 `<script src="../shared/page-prd.js"></script>`
4. `shared/page-prd.js` 的 `PRD_MAP` 加 `'_views/F{NN}-{族名}-p{N}'`
5. 跑 `build-prd --views` + `check-page-prd`
6. 更新 `prd/README.md` 与 `manifest.json`
