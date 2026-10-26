# 买家端 · 页面说明索引（功能族）

> 更新：2026-10-23　｜　规范：`开发PRD/原型页面产品逻辑说明撰写标准.md` **v1.2**（移动端功能族）
> 结构：**一个功能族一篇源文档（`FNN-族名.md`），族内每页一节（`## N. 页面名 \`file.html\``）**；抽屉加载 `_views/` 下的单页视图，只看本页。
> 覆盖：**52 / 86** 页（F01 6 + F02 6 + F03 6 + F04 3 + F07 9 + F08 7 + F10 8 + F11 7）。

## 一、Tab → 功能族 → 页面

| Tab | 功能族 | 源文档 | 页面数 | 状态 |
|---|---|---|---|---|
| 首页 | **F01 首页与导航** | [F01-首页与导航.md](./F01-首页与导航.md) | 6 | 🟡 页全；首页 6 个 B 入口待写 |
| 首页 | **F02 市场与找货** | [F02-市场与找货.md](./F02-市场与找货.md) | 7 | 🟡 6/7（缺 `shop-detail`；另 3 个复杂入口待 F08） |
| 首页 | **F03 榜单与品牌** | [F03-榜单与品牌.md](./F03-榜单与品牌.md) | 6 | ✅ 完整 |
| 首页 | **F04 拼单集采**（商品详情已归 F02） | [F04-拼单集采.md](./F04-拼单集采.md) | 3 | ✅ 完整（依据 M01 §8，OQ 已关闭） |
| 首页 | F05 原料市场 | — | 7 | ⚪ 未建 |
| 首页 | F06 原料拼单与袜机物流 | — | 5 | ⚪ 未建 |
| 进货单 | **F07 交易与订单** | [F07-交易与订单.md](./F07-交易与订单.md) | 9 | 🟡 页全；2 处 B 入口待写 |
| 首页 | **F08 采购询价与定制** | [F08-采购询价与定制.md](./F08-采购询价与定制.md) | 7 | ✅ 完整 |
| 首页 | F09 产业链服务 | — | 11 | ⚪ 未建 |
| 首页 | **F10 文旅研学** | [F10-文旅研学.md](./F10-文旅研学.md) | 8 | ✅ 完整 |
| 首页 | **F11 袜博会** | [F11-袜博会.md](./F11-袜博会.md) | 7 | ✅ 完整 |
| 我的 | F12 我的与服务 | — | 10 | ⚪ 未建 |

> F12 含 `checkin.html`（每日签到积分，非研学签到）。

## 二、已完成族的页面清单

### F01 首页与导航

| # | 页面 | 原型文件 | 节 | 单页视图 | 状态 |
|---|---|---|---|---|---|
| 1 | 首页 | `home.html` | §1 | `_views/F01-首页与导航-p1.prd.html` | ✅ |
| 2 | 搜索 | `search.html` | §2 | `_views/F01-首页与导航-p2.prd.html` | 🟡 结果页缺 |
| 3 | 视频看货 | `video.html` | §3 | `_views/F01-首页与导航-p3.prd.html` | ✅ |
| 4 | AI 工具 | `ai.html` | §4 | `_views/F01-首页与导航-p4.prd.html` | 🟡 多入口未接 |
| 5 | 消息中心 | `messages.html` | §5 | `_views/F01-首页与导航-p5.prd.html` | ✅ |
| 6 | 资讯详情 | `news-detail.html` | §6 | `_views/F01-首页与导航-p6.prd.html` | ✅ |

### F02 市场与找货

| # | 页面 | 原型文件 | 节 | 单页视图 | 状态 |
|---|---|---|---|---|---|
| 1 | 商品列表 | `product-filter.html` | §1 | `_views/F02-市场与找货-p1.prd.html` | ✅ |
| 2 | 商品详情 | `product-detail.html` | §2 | `_views/F02-市场与找货-p2.prd.html` | ✅ |
| 3 | 拍照找货 | `photo-search.html` | §3 | `_views/F02-市场与找货-p3.prd.html` | ✅ |
| 4 | AI 找货 | `ai-search.html` | §4 | `_views/F02-市场与找货-p4.prd.html` | ✅ |
| 5 | 袜子市场 | `market-socks.html` | §5 | `_views/F02-市场与找货-p5.prd.html` | ✅ |
| 6 | 市场导览 | `market-map.html` | §6 | `_views/F02-市场与找货-p6.prd.html` | ✅ |
| 7 | 店铺详情 | `shop-detail.html` | §7 | — | ⬜ 待补 |

### F03 榜单与品牌

| # | 页面 | 原型文件 | 节 | 单页视图 | 状态 |
|---|---|---|---|---|---|
| 1 | 终端热销榜 | `ranking-terminal.html` | §1 | `_views/F03-榜单与品牌-p1.prd.html` | ✅ |
| 2 | 平台热搜榜 | `ranking-search.html` | §2 | `_views/F03-榜单与品牌-p2.prd.html` | ✅ |
| 3 | 新品关注榜 | `ranking-new.html` | §3 | `_views/F03-榜单与品牌-p3.prd.html` | ✅ |
| 4 | 跨境热销榜 | `ranking-cross.html` | §4 | `_views/F03-榜单与品牌-p4.prd.html` | ✅ |
| 5 | 品牌馆 | `brand.html` | §5 | `_views/F03-榜单与品牌-p5.prd.html` | ✅ |
| 6 | 品牌详情 | `brand-detail.html` | §6 | `_views/F03-榜单与品牌-p6.prd.html` | ✅ |

### F04 拼单集采

| # | 页面 | 原型文件 | 节 | 单页视图 | 状态 |
|---|---|---|---|---|---|
| 1 | 拼单集采 | `group-buy.html` | §1 | `_views/F04-拼单集采-p1.prd.html` | ✅ |
| 2 | 拼单详情 | `group-buy-join.html` | §2 | `_views/F04-拼单集采-p2.prd.html` | ✅ |
| 3 | 拼单记录 | `group-records.html` | §3 | `_views/F04-拼单集采-p3.prd.html` | ✅ |

### F07 交易与订单

| # | 页面 | 原型文件 | 节 | 单页视图 | 状态 |
|---|---|---|---|---|---|
| 1 | 进货单 | `purchase-order.html` | §1 | `_views/F07-交易与订单-p1.prd.html` | ✅ |
| 2 | 确认订单 | `order-checkout.html` | §2 | `_views/F07-交易与订单-p2.prd.html` | ✅ |
| 3 | 我的订单 | `orders.html` | §3 | `_views/F07-交易与订单-p3.prd.html` | ✅ |
| 4 | 订单详情 | `order-detail.html` | §4 | `_views/F07-交易与订单-p4.prd.html` | ✅ |
| 5 | 询价订单详情 | `order-detail-inquiry.html` | §5 | `_views/F07-交易与订单-p5.prd.html` | ✅ |
| 6 | 已评价订单 | `order-reviewed.html` | §6 | `_views/F07-交易与订单-p6.prd.html` | ✅ |
| 7 | 采购记录 | `purchase-records.html` | §7 | `_views/F07-交易与订单-p7.prd.html` | ✅ |
| 8 | 收货地址 | `address.html` | §8 | `_views/F07-交易与订单-p8.prd.html` | ✅ |
| 9 | 投诉建议 | `complaint.html` | §9 | `_views/F07-交易与订单-p9.prd.html` | ✅ |

### F08 采购询价与定制

| # | 页面 | 原型文件 | 节 | 单页视图 | 状态 |
|---|---|---|---|---|---|
| 1 | 采购询价 | `inquiry.html` | §1 | `_views/F08-采购询价与定制-p1.prd.html` | ✅ |
| 2 | 发布采购询价 | `inquiry-publish.html` | §2 | `_views/F08-采购询价与定制-p2.prd.html` | ✅ |
| 3 | 我的发布详情 | `inquiry-mypublish.html` | §3 | `_views/F08-采购询价与定制-p3.prd.html` | ✅ |
| 4 | 公开需求详情 | `inquiry-demand.html` | §4 | `_views/F08-采购询价与定制-p4.prd.html` | ✅ |
| 5 | 个性定制 | `custom-design.html` | §5 | `_views/F08-采购询价与定制-p5.prd.html` | ✅ |
| 6 | 批量定制 | `bulk-custom.html` | §6 | `_views/F08-采购询价与定制-p6.prd.html` | ✅ |
| 7 | AI 穿搭 | `ai-outfit.html` | §7 | `_views/F08-采购询价与定制-p7.prd.html` | ✅ |

### F10 文旅研学

| # | 页面 | 原型文件 | 节 | 单页视图 | 状态 |
|---|---|---|---|---|---|
| 1 | 研学首页 | `study-tour.html` | §1 | `_views/F10-文旅研学-p1.prd.html` | ✅ |
| 2 | 路线详情 | `study-route.html` | §2 | `_views/F10-文旅研学-p2.prd.html` | ✅ |
| 3 | 个人报名 | `study-personal.html` | §3 | `_views/F10-文旅研学-p3.prd.html` | ✅ |
| 4 | 团体申请 | `study-apply.html` | §4 | `_views/F10-文旅研学-p4.prd.html` | ✅ |
| 5 | 报名详情 | `study-my.html` | §5 | `_views/F10-文旅研学-p5.prd.html` | ✅ |
| 6 | 文旅活动 | `tourism.html` | §6 | `_views/F10-文旅研学-p6.prd.html` | ✅ |
| 7 | 活动详情 | `tourism-detail.html` | §7 | `_views/F10-文旅研学-p7.prd.html` | ✅ |
| 8 | 文旅资源详情 | `tourism-resource.html` | §8 | `_views/F10-文旅研学-p8.prd.html` | ✅ |

### F11 袜博会

| # | 页面 | 原型文件 | 节 | 单页视图 | 状态 |
|---|---|---|---|---|---|
| 1 | 展会首页 | `expo.html` | §1 | `_views/F11-袜博会-p1.prd.html` | ✅ |
| 2 | 展会介绍 | `expo-info.html` | §2 | `_views/F11-袜博会-p2.prd.html` | ✅ |
| 3 | 展会日程 | `expo-schedule.html` | §3 | `_views/F11-袜博会-p3.prd.html` | ✅ |
| 4 | 日程详情 | `expo-session-detail.html` | §4 | `_views/F11-袜博会-p4.prd.html` | ✅ |
| 5 | 参观登记 | `expo-visitor-apply.html` | §5 | `_views/F11-袜博会-p5.prd.html` | ✅ |
| 6 | 资料下载 | `expo-materials.html` | §6 | `_views/F11-袜博会-p6.prd.html` | ✅ |
| 7 | 展位申请 | `expo-booth-apply.html` | §7 | `_views/F11-袜博会-p7.prd.html` | ✅ |

## 三、新增一个功能族的步骤

1. 按 4–12 页的粒度确定族边界，写 `prd/FNN-族名.md`：§0 族通用说明 + 每页 `## N. 页面名 \`file.html\``
2. 页面末尾加 `<script src="../shared/page-prd.js"></script>`
3. `shared/page-prd.js` 的 `PRD_MAP` 加 `'mai-APP/xxx.html': ['_views/FNN-族名-pN', '', '页面名']`
4. 跑 `node tools/build-prd.mjs --root . --views`（生成族文档 + 单页视图）
5. 本 README 与 `manifest.json` 各加一行
6. 跑 `node tools/check-page-prd.mjs --root .`，ERROR 必须为 0

## 四、工具

```powershell
node tools\build-prd.mjs --root . --views        # md → 族 .prd.html + _views/单页视图
node tools\check-page-prd.mjs --root .           # 断链 / 漏登 / 未挂载 / 数字与文案核对
node tools\check-entry-coverage.mjs --root .     # 入口覆盖：本页出链的目标页是否有说明
```

## 五、入口覆盖（族是"写"的单位，入口是"读"的单位）

> 开发按入口点，不按族读。所以**每页必须列出全部出链**（标准 §5.2.4），目标页没说明的也要登记并标 `⬜`。

| 指标 | 当前（2026-10-23） |
|---|---|
| 原型页 | 86 |
| 已写说明 | 45 |
| **指向"无独立说明"页面的入口** | **125**（不等于漏：A 类允许父页内联，需逐条判定） |
| 最集中的缺口 | `home.html` 8、`market-material.html` 8、`material-intro.html` 7、`mine.html` 7、`market-socks.html` 5 |

**判定口径（标准 §5.2.4）**

| 类型 | 处理 | 是否算欠账 |
|---|---|---|
| A 内联 | 父页写清入口/内容/交互/空态 | 否 |
| B 独立 | 独立成节或成族 | 有说明前算欠账 |
| C 待写 | 已判定 B 但未写，父页状态必须 🟡 | **是** |

已知 A 类示例：`merchant-join.html`（入驻广告位，写在 F02 §5.12）、`news-detail.html`（资讯详情，写在 F01 §6）。

**端级框架出口**（底部 4 Tab，各页不计欠账，统一跟踪）

| 出口 | 目标 | 说明 | 状态 |
|---|---|---|---|
| Tab 首页 | `home.html` | F01 §1 | ✅ |
| Tab 视频看货 | `video.html` | F01 §3 | ✅ |
| Tab 进货单 | `purchase-order.html` | F07 §1 | ✅ |
| Tab 我的 | `mine.html` | F12（未写） | ⬜ |

架构外遗留（不写说明）：`services.html`、`market-logistics/market-machine/material-warehouse`。
