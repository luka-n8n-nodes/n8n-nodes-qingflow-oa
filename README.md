# @luka-cat-mimi/n8n-nodes-qingflow-oa

轻流 OA 的 n8n 社区节点，提供轻流开放平台 API 的集成支持。

## 安装

参考：https://docs.n8n.io/integrations/community-nodes/installation/

节点名称：`@luka-cat-mimi/n8n-nodes-qingflow-oa`

## 功能列表

### 通讯录 - 成员 (7)

- 创建成员
- 批量创建成员
- 获取用户详情
- 通过邮箱或手机号获取成员 userId
- 获取工作区全部成员 ✨ 支持 Return All
- 更新成员
- 删除成员

### 通讯录 - 部门 (9)

- 创建部门
- 获取部门列表
- 获取部门成员列表
- 获取不在部门的成员
- 查询单个部门详情
- 增加部门成员
- 移除部门成员
- 更新部门
- 删除部门

### 通讯录 - 角色 (7)

- 创建角色
- 获取角色列表
- 获取角色成员
- 增加角色成员
- 移除角色成员
- 更新角色
- 删除角色

### 通讯录 - 管理员 (3)

- 增加管理员
- 获取管理员列表
- 删除管理员

### 通讯录 - 子管理员 (4)

- 创建子管理员
- 获取工作区子管理员配置
- 更新子管理员
- 删除子管理员

### 轻流应用接口 - 应用管理 (7)

- 创建应用
- 获取工作区所有应用信息
- 获取应用基本信息 ✨ 支持 Return All
- 获取指定应用表单信息
- 获取应用 Word 打印模版信息
- 更新应用基本信息
- 删除应用

### 数据内容 - 应用数据 (6)

- 获取应用数据 ✨ 支持 Return All
- 获取个人在当前工作区全部事项信息 ✨ 支持 Return All
- 获取单条数据的详细信息
- 获取单条数据的留言信息 ✨ 支持 Return All
- 获取数据关联的内容
- 更新单条数据的信息

### 数据流程接口 - 流程操作 (6)

- 获取单条数据的流程日志
- 获取某条流程日志的详细信息
- 处理某条数据
- 催办某条数据
- 单条数据重新指派
- 单条数据流程回退

### 任务委托 (3)

- 新增委托
- 获取委托列表 ✨ 支持 Return All
- 结束委托

### 其他 (1)

- 上传单个文件（multipart，单文件 ≤ 50MB；Binary Property 填输入项中 `binary` 的键名）

### 高级设置 (1)

- 自定义请求（支持任意 API 端点调用，含批次处理和超时控制）

## ✨ 特别之处

### 🔄 Return All 自动分页

以下接口支持 **Return All** 功能，自动处理分页获取全部数据：

| 模块                | 接口名称                         |
| ------------------- | -------------------------------- |
| 通讯录 - 成员       | 获取工作区全部成员               |
| 轻流应用接口        | 获取应用基本信息                 |
| 数据内容 - 应用数据 | 获取应用数据                     |
| 数据内容 - 应用数据 | 获取个人在当前工作区全部事项信息 |
| 数据内容 - 应用数据 | 获取单条数据的留言信息           |
| 任务委托            | 获取委托列表                     |

### ⏱️ 超时与批次管理

大部分接口在 **Options** 中支持：

- **Timeout（超时时间）**：请求超时（毫秒），`0` 表示不限制
- **Batching（批次管理）**（部分操作不提供，例如 **其他 → 上传单个文件** 仅支持 Timeout）：
  - **Items per Batch**：每批并发数量
  - **Batch Interval (ms)**：批次间隔，减轻限流压力

### 🔐 智能 Token 刷新

轻流 OA API 在部分错误场景仍返回 HTTP 200，错误通过响应体 `errCode` 表示。本节点在检测到 `errCode: 49300`（Token 过期）时会刷新 Access Token 并重试请求。

## 凭证配置

凭证名称：**轻流 OA API** (`qingflowOaApi`)

| 字段           | 必填 | 说明                                                                 |
| -------------- | ---- | -------------------------------------------------------------------- |
| 请求地址       | 是   | 默认 `https://api.qingflow.com`；专有云一般为 `https://…/openApi` 根 |
| 凭证类型       | 是   | 超级管理员 / 子管理员（权限组）                                    |
| 工作区 ID      | 条件 | 子管理员时必填（wsId）                                               |
| 工作区凭证密钥 | 是   | 超级管理员下作为 accessToken；子管理员下为 wsSecret                 |
| 用户 ID        | 否   | 填写后自动加入请求头 `userId`                                      |

## 本地开发与发布

- 环境：**Node.js ≥ 20.15**（CI 使用当前 Node LTS）
- 安装依赖：`npm ci`
- 构建：`npm run build`（`n8n-node build`，含静态资源复制）
- 代码检查：`npm run lint`（`n8n-node lint`）
- 本地调试节点：`npm run dev`
- **发版**：仓库根目录执行 `npm run release`，按提示选择版本并推送 **semver 标签**（形如 `v1.2.3`），由 GitHub Actions `publish.yml` 完成 npm provenance 发布与 Release。详见工作流文件内注释。

## 注意事项

1. API / 凭证说明见轻流文档：[语雀文档链接见凭证配置页](https://exiao.yuque.com/ixwxsb/cqfg2y/aec4bgwwblaol97b)
2. 错误码参考：[轻流 API 文档](https://exiao.yuque.com/ixwxsb/cqfg2y/xl9r0hpg3dyxstcy)

## 📝 许可证

MIT License

## 🆘 支持

- 📧 邮箱：luka.cat.mimi@gmail.com
- 🐛 [问题反馈](https://github.com/luka-n8n-nodes/n8n-nodes-qingflow-oa/issues)
