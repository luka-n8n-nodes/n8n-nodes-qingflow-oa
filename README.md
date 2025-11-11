# 轻流OA N8N 集成插件

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![N8N](https://img.shields.io/badge/platform-N8N-brightgreen.svg)
![TypeScript](https://img.shields.io/badge/language-TypeScript-blue.svg)
![Node.js](https://img.shields.io/badge/node-%3E%3D20.15-green.svg)

一个功能完整的 N8N 自定义节点，用于集成轻流OA API，支持通讯录管理、应用管理、数据操作、流程管理等全方位功能。

## 🚀 特性

- ✅ **10个功能模块**，覆盖轻流OA的主要API功能
- ✅ **58个操作**，支持完整的工作流自动化
- ✅ **安全认证**，自动管理Access Token和凭证刷新
- ✅ **统一参数**，采用JSON格式的一致性参数设计
- ✅ **错误处理**，完善的异常处理和用户提示
- ✅ **TypeScript支持**，完整的类型定义和智能提示
- ✅ **自动发现**，基于文件系统的模块自动加载机制

## 📦 安装

### 方式一：NPM 安装 (推荐)

```bash
npm install @luka-n8n-nodes/n8n-nodes-qingflow-oa
```

### 方式二：手动安装

1. 下载项目到本地
2. 编译项目

```bash
npm install
npm run build
```

3. 将编译后的文件复制到 N8N 的 `custom` 目录

## ⚙️ 配置

### 1. 创建凭据

在 N8N 中创建新的 "轻流OA API" 凭据，填入以下信息：

| 字段 | 说明 | 示例 |
|------|------|------|
| **Base URL** | 轻流OA的API基础地址 | `https://api.singleflow.com` |
| **API Key** | 轻流OA的API密钥 | `your_api_key` |

### 2. 获取凭据信息

#### Base URL

根据部署环境选择对应的地址：
- **公有云**：`https://api.singleflow.com`
- **内网地址**：`https://api.singleflow.com`
- **专有云**：`https://xxx.xxx.com/openApi`

#### API Key

1. 登录轻流OA管理后台
2. 进入API管理页面
3. 创建或查看API密钥

## 📊 功能模块

### 核心功能

| 模块 | 操作数 | 主要功能 |
|------|--------|----------|
| 👥 **通讯录 - 成员** | 7 | 创建成员、批量创建、更新成员、删除成员、获取用户列表、获取用户详情、根据条件获取用户ID |
| 🏢 **通讯录 - 部门** | 9 | 创建部门、更新部门、删除部门、获取部门列表、获取部门详情、获取部门成员、增加/移除部门成员、获取未分配部门成员 |
| 🎭 **通讯录 - 角色** | 7 | 创建角色、更新角色、删除角色、获取角色列表、获取角色成员、增加/移除角色成员 |
| 👑 **通讯录 - 管理员** | 3 | 增加管理员、删除管理员、获取管理员列表 |
| 🔐 **通讯录 - 子管理员** | 4 | 创建子管理员、更新子管理员、删除子管理员、获取子管理员配置 |

### 应用管理

| 模块 | 操作数 | 主要功能 |
|------|--------|----------|
| 📱 **轻流应用接口 - 应用管理** | 7 | 创建应用、删除应用、更新应用基本信息、获取应用基本信息、获取工作区所有应用信息、获取指定应用表单信息、获取应用Word打印模版信息 |

### 数据操作

| 模块 | 操作数 | 主要功能 |
|------|--------|----------|
| 📝 **数据内容 - 应用数据** | 12 | 添加应用数据、删除应用数据、获取应用数据、获取单条数据详细信息、更新单条数据信息、获取数据关联内容、获取报表数据、获取报表数据表列表数据、获取打印模版文件、获取个人事项信息、添加留言、获取留言信息 |
| 🔄 **数据流程接口 - 流程操作** | 5 | 处理某条数据、催办某条数据、单条数据流程回退、单条数据重新指派、获取某条数据的流程日志 |

### 协作功能

| 模块 | 操作数 | 主要功能 |
|------|--------|----------|
| 📋 **任务委托接口 - 委托管理** | 3 | 新增委托、结束委托、获取委托列表 |
| ⚙️ **高级设置 - 自定义请求** | 1 | 自定义HTTP请求，支持任意API端点调用 |

## 🛠️ 使用示例

### 基础用法

1. **添加轻流OA节点**到工作流
2. **选择资源类型**（如"通讯录 - 成员"）
3. **选择具体操作**（如"创建成员"）
4. **配置参数**：
   - 路径参数：直接填入（如User ID）
   - 请求体参数：JSON格式，有默认值模板

### 创建成员示例

```json
{
  "userId": "user123",
  "name": "张三",
  "email": "zhangsan@example.com",
  "areaCode": "86",
  "mobileNum": "13800138000",
  "department": [],
  "role": [],
  "beingDisabled": false
}
```

### 获取应用数据示例

```json
{
  "count": "1000000",
  "workFlow": "",
  "workType": "",
  "values": [],
  "referrals": ""
}
```

### 处理数据流程示例

```json
{
  "auditResult": "yes",
  "auditNodeId": 12345,
  "auditFeedback": "审核通过"
}
```

## 🔧 高级设置 - 自定义请求

### 为什么需要自定义请求而不是Http节点？

轻流OA API 有一个特殊的设计：**即使请求失败，服务器也会返回 HTTP 200 状态码**，错误信息通过响应体中的 `errCode` 字段返回。例如，当 Access Token 过期时，API 会返回：

```json
{
  "errCode": 49300,
  "errMsg": "Token已过期"
}
```

**N8N 的标准 Http 节点只能处理服务端的 401/403 状态码来自动刷新凭证**，无法处理这种"200状态码但包含错误信息"的情况。

### 自定义请求的优势

1. **智能Token刷新**：自动检测 `errCode: 49300`，自动刷新 Access Token 并重试请求
2. **统一错误处理**：统一处理轻流OA的业务错误码，提供友好的错误提示
3. **响应体标准化**：自动提取响应中的 `result` 字段，统一返回格式
4. **批处理支持**：支持批量请求和请求间隔控制
5. **超时控制**：可配置请求超时时间

### 使用场景

- 调用轻流OA尚未封装的操作
- 需要自定义请求参数和响应处理
- 需要批量处理多个API请求

### 使用示例

1. 选择资源：**高级设置**
2. 选择操作：**自定义请求**
3. 配置参数：
   - **Method**: `POST`
   - **URL**: `/api/custom/endpoint`
   - **Send Body**: 启用
   - **Body**: JSON格式的请求体
   - **Options**: 配置批处理和超时

## 🔧 开发

### 项目结构

```text
n8n-nodes-qingflow-oa/
├── credentials/                 # 凭据定义
│   └── QingflowOaApi.credentials.ts
├── nodes/                      # 节点定义
│   ├── help/                   # 工具类和类型定义
│   │   ├── builder/           # 资源构建器
│   │   ├── type/              # 类型定义
│   │   └── utils/             # 工具函数
│   └── QingflowOa/
│       ├── QingflowOa.node.ts
│       └── resource/           # 资源模块
│           ├── members/        # 成员管理
│           ├── department/     # 部门管理
│           ├── role/           # 角色管理
│           ├── app/            # 应用管理
│           ├── applicationData/# 应用数据
│           ├── workflow/       # 流程操作
│           ├── delegate/       # 任务委托
│           └── customRequest/  # 自定义请求
└── package.json
```

### 构建命令

```bash
# 开发模式
npm run dev

# 构建
npm run build

# 代码检查
npm run lint

# 格式化代码
npm run format
```

### 添加新功能

1. 在 `nodes/QingflowOa/resource/` 下创建新模块文件夹
2. 创建资源定义文件 `ModuleResource.ts`
3. 在模块文件夹下创建操作文件 `OperateFile.ts`
4. 使用统一的参数模式：路径参数 + JSON请求体

**示例：添加新资源**

```typescript
// NewResource.ts
import { ResourceOptions } from '../../help/type/IResource';

const NewResource: ResourceOptions = {
	name: '新资源',
	value: 'newResource',
};

export default NewResource;
```

**示例：添加新操作**

```typescript
// newResource/NewOperate.ts
import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';
import { jsonParse } from 'n8n-workflow';

const defaultBodyJson = JSON.stringify(
	{
		param1: '',
		param2: [],
	},
	null,
	2,
);

const NewOperate: ResourceOperations = {
	name: '新操作',
	value: 'newOperation',
	action: '新操作',
	options: [
		{
			displayName: 'Body',
			name: 'body',
			type: 'json',
			default: defaultBodyJson,
			required: true,
			description: '请求体 JSON 格式',
			typeOptions: {
				alwaysOpenEditWindow: true,
			},
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
		const bodyJson = this.getNodeParameter('body', index) as string;

		if (!bodyJson) {
			throw new Error('请求体不能为空');
		}

		let body: IDataObject;
		try {
			body = jsonParse(bodyJson);
		} catch (error) {
			throw new Error('请求体 JSON 格式无效: ' + error.message);
		}

		const response = await RequestUtils.request.call(this, {
			method: 'POST',
			url: '/api/endpoint',
			body,
		});

		return response as IDataObject;
	},
};

export default NewOperate;
```

**就这样！** 无需修改其他任何代码，新功能会被自动发现和加载。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📝 许可证

本项目采用 MIT 许可证。详情请参见 [LICENSE.md](./LICENSE.md) 文件。

## 🆘 支持

- 📧 邮箱：**luka.cat.mimi@gmail.com**
- 🐛 问题反馈：[GitHub Issues](https://github.com/luka-n8n-nodes/n8n-nodes-qingflow-oa/issues)
- 📖 轻流OA API文档：[官方文档](https://exiao.yuque.com/ixwxsb/cqfg2y/xl9r0hpg3dyxstcy)

## ⭐ 致谢

感谢 [N8N](https://n8n.io/) 提供的强大自动化平台

---

如果这个项目对你有帮助，请给它一个 ⭐️！
