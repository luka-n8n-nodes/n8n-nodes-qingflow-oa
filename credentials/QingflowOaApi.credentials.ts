import {
    IAuthenticateGeneric,
    ICredentialTestRequest,
    ICredentialType,
    INodeProperties,
    IHttpRequestHelper,
    ICredentialDataDecryptedObject
} from 'n8n-workflow';

export class QingflowOaApi implements ICredentialType {
    name = 'qingflowOaApi';
    displayName = '轻流 OA API';
    documentationUrl = 'https://exiao.yuque.com/ixwxsb/cqfg2y/aec4bgwwblaol97b';
    // @ts-ignore
    icon = 'file:icon.png';
    properties: INodeProperties[] = [
        {
            displayName: '请求地址',
            name: 'baseUrl',
            type: 'string',
            default: 'https://api.qingflow.com',
            required: true,
            description: '轻流 API 基础地址（默认：https://api.qingflow.com，专有服务：http(s)://xxx.xx(自有域名)/openApi）',
        },
        {
            displayName: '凭证类型',
            name: 'credentialType',
            type: 'options',
            options: [
                {
                    name: '超级管理员',
                    value: 'superAdmin',
                },
                {
                    name: '子管理员',
                    value: 'permissionGroup',
                },
            ],
            default: 'superAdmin',
            required: true,
            description: '选择凭证类型：超级管理员或子管理员',
        },
        {
            displayName: '工作区ID',
            name: 'wsId',
            type: 'string',
            default: '',
            required: true,
            displayOptions: {
                show: {
                    credentialType: ['permissionGroup'],
                },
            },
            description: '工作区ID（wsId），凭证类型为子管理员时必填，获取方式参考轻流文档：基本概念介绍——wsId',
        },
        {
            displayName: '工作区凭证密钥',
            name: 'wsSecret',
            type: 'string',
            typeOptions: {
                password: true
            },
            default: '',
            required: true,
            description: '工作区权限组的凭证密钥（wsSecret），获取方式参考轻流文档：基本概念介绍-wsSecret',
        },
        {
            displayName: 'AccessToken',
            name: 'accessToken',
            type: 'hidden',
            default: '',
            typeOptions: {
                expirable: true,
            },
        },
    ];

    // 认证配置 - 在实际请求中自动添加必要的头部信息
    authenticate: IAuthenticateGeneric = {
        type: 'generic',
        properties: {
            headers: {
                'accessToken': '={{$credentials.accessToken}}',
            }
        },
    };

	// 在认证前处理 token
	async preAuthentication(this: IHttpRequestHelper, credentials: ICredentialDataDecryptedObject) {
		const credentialType = credentials.credentialType as string;

		// 超级管理员：直接使用凭证密钥作为 accessToken
		if (credentialType === 'superAdmin') {
			return {
				accessToken: credentials.wsSecret,
			};
		}

		// 子管理员（权限组）：需要调用接口获取 accessToken
		if (credentialType === 'permissionGroup') {
			if (!credentials.wsId) {
				throw new Error('凭证类型为子管理员时，工作区ID为必填项');
			}

			// ✅ 智能处理 wsId：如果已经被单引号包裹则不处理，否则添加单引号
			const wsIdStr = credentials.wsId as string;
			const formattedWsId = (wsIdStr.startsWith("'") && wsIdStr.endsWith("'")) 
				? wsIdStr 
				: `'${wsIdStr}'`;
			
			const res = (await this.helpers.httpRequest({
				method: 'GET',
				baseURL: `${credentials.baseUrl}`,
				url: '/accessToken',
				qs: {
					wsId: formattedWsId, 
					wsSecret: credentials.wsSecret,
				},
			})) as any;

			if (res?.errCode !== 0 || !res?.result?.accessToken) {
				const errorMsg = `获取 accessToken 失败：errCode=${res?.errCode || 'UNKNOWN'}, errMsg=${res?.errMsg || '未知错误'}`;
				throw new Error(errorMsg);
			}

			return {
				accessToken: res.result.accessToken
			};
		}

		throw new Error('未知的凭证类型');
	}

    // 测试连接配置
    test: ICredentialTestRequest = {
        request: {
            baseURL: '={{$credentials.baseUrl}}',
            url: '/resignUrl',
            method: 'POST',
            body: {
                url: '={{$credentials.baseUrl}}',
            }
        },
        rules: [
            {
                type: 'responseSuccessBody',
                properties: {
                    key: 'errCode',
                    value: 49300,
                    message: '无效的accessToken',
                },
            },
        ],
    };
}


