# _legacy 归档说明

> 归档日期：2026-09-09
> 归档原因：依据《袜掌柜智慧运营平台功能架构（完整版）》对运营管理端菜单做全量重构，
> 以下页面在**新功能架构中无对应位置**，已从侧边栏移除并归档至本目录，仅作备查。
>
> ⚠️ 本目录页面**不参与菜单渲染**，`check-menu.ps1` 不会引用它们。
> 若后续确认某页面需要回捞，请：先在 PRD 中补写该页面 → 再在 `menu-data.js` 中登记 → 最后把文件移回上级目录。

## 归档清单（31 个）

| 原所属模块 | 页面文件 | 原页面名称 |
|---|---|---|
| 招商管理 | `investment.html` | 招商线索 |
| 招商管理 | `investment-follow.html` | 意向跟进 |
| 招商管理 | `investment-vacancy.html` | 空置资源管理 |
| 招商管理 | `investment-policy.html` | 招商政策配置 |
| 渠道管理 | `channel.html` | 买家渠道标签 |
| 渠道管理 | `channel-analysis.html` | 渠道来源分析 |
| 渠道管理 | `channel-promo.html` | 推广活动管理 |
| 集采运营 | `procurement.html` | 集采需求征集 |
| 集采运营 | `procurement-bid.html` | 供应商招标 |
| 集采运营 | `procurement-group.html` | 成团管理 |
| 集采运营 | `procurement-settle.html` | 结算管理 |
| 服务市场管理 | `service-market.html` | 服务商入驻审核 |
| 服务市场管理 | `service-category.html` | 服务分类管理 |
| 服务市场管理 | `service-review.html` | 评价管理 |
| AI内容审核 | `ai-audit.html` | 图文审核 |
| AI内容审核 | `ai-video.html` | 视频审核 |
| AI内容审核 | `ai-violation.html` | 违规内容处理 |
| 内容管理（扩展） | `content-index.html` | 产业指数发布 |
| 内容管理（扩展） | `content-showcase.html` | 精品展示内容管理 |
| 商户管理（扩展） | `merchant-exit.html` | 退租/清退管理 |
| 商户管理（扩展） | `merchant-credit.html` | 资质审核 |
| 商城运营（扩展） | `mall-dispute.html` | 纠纷仲裁 |
| 商城运营（扩展） | `mall-credit.html` | 信用管理 |
| 商城运营（扩展） | `mall-trade.html` | 交易监控 |
| 趋势数据管理（扩展） | `trend-purchase.html` | 平台采购榜 |
| 趋势数据管理（扩展） | `trend-tag.html` | 趋势标签 |
| 活动运营（扩展） | `activity-stats.html` | 效果统计 |
| 数据报表 | `report.html` | 四流指标报表 |
| 数据报表 | `report-operation.html` | 经营报表 |
| 数据报表 | `report-index.html` | 产业指数 |
| 数据报表 | `report-cockpit.html` | 领导驾驶舱数据 |

## 回捞候选（后续评审时优先考虑）

以下归档页面在新架构中有近似位置，若业务确认需要，可回捞并改造：

- `mall-trade.html` 交易监控 → 商城运营 / 订单管理
- `mall-dispute.html` 纠纷仲裁 → 商城运营 / 订单管理（售后）
- `activity-stats.html` 效果统计 → 活动运营 / 活动列表（效果）
- `report-cockpit.html` 领导驾驶舱数据 → 运营总览 / 产业专题分析
- `ai-audit.html` / `ai-video.html` / `ai-violation.html` → 商城运营 / 商品管理（AI 自动审核）、视频管理
- `procurement.html` / `procurement-group.html` → 商城运营 / 订单管理（拼单集采）
- `investment-vacancy.html` 空置资源管理 → 市场资源管理 / 资源状态看板
