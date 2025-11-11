import {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	INodeProperties,
} from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';
import { jsonParse } from 'n8n-workflow';
import { sleep } from 'n8n-workflow';

const CustomRequestOperate: ResourceOperations = {
	name: '自定义请求',
	value: 'customRequest',
	action: '自定义请求',
	options: [
		{
			displayName: 'Method',
			name: 'method',
			type: 'options',
			options: [
				{
					name: 'DELETE',
					value: 'DELETE',
				},
				{
					name: 'GET',
					value: 'GET',
				},
				{
					name: 'PATCH',
					value: 'PATCH',
				},
				{
					name: 'POST',
					value: 'POST',
				},
				{
					name: 'PUT',
					value: 'PUT',
				},
			],
			default: 'GET',
			description: 'HTTP 请求方法',
		},
		{
			displayName: 'URL',
			name: 'url',
			type: 'string',
			default: '',
			placeholder: '/api/endpoint',
			description: 'API 端点路径（基础URL从凭证中获取）',
			required: true,
		},
		{
			displayName: 'Send Query Parameters',
			name: 'sendQuery',
			type: 'boolean',
			default: false,
			noDataExpression: true,
			description: 'Whether to send query parameters',
		},
		{
			displayName: 'Specify Query Parameters',
			name: 'specifyQuery',
			type: 'options',
			displayOptions: {
				show: {
					sendQuery: [true],
				},
			},
			options: [
				{
					name: 'Using Fields Below',
					value: 'keypair',
				},
				{
					name: 'Using JSON',
					value: 'json',
				},
			],
			default: 'keypair',
		},
		{
			displayName: 'Query Parameters',
			name: 'queryParameters',
			type: 'fixedCollection',
			displayOptions: {
				show: {
					sendQuery: [true],
					specifyQuery: ['keypair'],
				},
			},
			typeOptions: {
				multipleValues: true,
			},
			placeholder: 'Add Parameter',
			default: {
				parameters: [
					{
						name: '',
						value: '',
					},
				],
			},
			options: [
				{
					name: 'parameters',
					displayName: 'Parameter',
					values: [
						{
							displayName: 'Name',
							name: 'name',
							type: 'string',
							default: '',
						},
						{
							displayName: 'Value',
							name: 'value',
							type: 'string',
							default: '',
						},
					],
				},
			],
		},
		{
			displayName: 'JSON',
			name: 'jsonQuery',
			type: 'json',
			displayOptions: {
				show: {
					sendQuery: [true],
					specifyQuery: ['json'],
				},
			},
			default: '',
		},
		{
			displayName: 'Send Body',
			name: 'sendBody',
			type: 'boolean',
			default: false,
			noDataExpression: true,
			description: 'Whether to send request body',
		},
		{
			displayName: 'Specify Body',
			name: 'specifyBody',
			type: 'options',
			displayOptions: {
				show: {
					sendBody: [true],
				},
			},
			options: [
				{
					name: 'Using Fields Below',
					value: 'keypair',
				},
				{
					name: 'Using JSON',
					value: 'json',
				},
			],
			default: 'keypair',
		},
		{
			displayName: 'Body Parameters',
			name: 'bodyParameters',
			type: 'fixedCollection',
			displayOptions: {
				show: {
					sendBody: [true],
					specifyBody: ['keypair'],
				},
			},
			typeOptions: {
				multipleValues: true,
			},
			placeholder: 'Add Parameter',
			default: {
				parameters: [
					{
						name: '',
						value: '',
					},
				],
			},
			options: [
				{
					name: 'parameters',
					displayName: 'Parameter',
					values: [
						{
							displayName: 'Name',
							name: 'name',
							type: 'string',
							default: '',
						},
						{
							displayName: 'Value',
							name: 'value',
							type: 'string',
							default: '',
						},
					],
				},
			],
		},
		{
			displayName: 'JSON',
			name: 'jsonBody',
			type: 'json',
			displayOptions: {
				show: {
					sendBody: [true],
					specifyBody: ['json'],
				},
			},
			default: '',
		},
		{
			displayName: 'Options',
			name: 'options',
			type: 'collection',
			placeholder: 'Add option',
			default: {},
			options: [
				{
					displayName: 'Batching',
					name: 'batching',
					placeholder: 'Add Batching',
					type: 'fixedCollection',
					typeOptions: {
						multipleValues: false,
					},
					default: {
						batch: {},
					},
					options: [
						{
							displayName: 'Batching',
							name: 'batch',
							values: [
								{
									displayName: 'Items per Batch',
									name: 'batchSize',
									type: 'number',
									typeOptions: {
										minValue: -1,
									},
									default: 50,
									description:
										'输入将被分批处理以限制请求。 -1 表示禁用。0 将被视为 1。',
								},
								{
									displayName: 'Batch Interval (Ms)',
									name: 'batchInterval',
									type: 'number',
									typeOptions: {
										minValue: 0,
									},
									default: 1000,
									description: '每批请求之间的时间（毫秒）。0 表示禁用。',
								},
							],
						},
					],
				},
				{
					displayName: 'Timeout',
					name: 'timeout',
					type: 'number',
					typeOptions: {
						minValue: 1,
					},
					default: 300000,
					description:
						'等待服务器发送响应头（并开始响应体）的时间（毫秒），超过此时间将中止请求',
				},
			],
		},
	] as INodeProperties[],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
		const method = this.getNodeParameter('method', index) as IHttpRequestMethods;
		const url = this.getNodeParameter('url', index) as string;
		const sendQuery = this.getNodeParameter('sendQuery', index, false) as boolean;
		const sendBody = this.getNodeParameter('sendBody', index, false) as boolean;
		const options = this.getNodeParameter('options', index, {}) as {
			batching?: { batch?: { batchSize?: number; batchInterval?: number } };
			timeout?: number;
		};

		// 构建请求选项
		const requestOptions: IHttpRequestOptions = {
			method,
			url,
			json: true,
		};

		// 处理查询参数
		if (sendQuery) {
			const specifyQuery = this.getNodeParameter('specifyQuery', index, 'keypair') as string;
			if (specifyQuery === 'keypair') {
				const queryParameters = this.getNodeParameter(
					'queryParameters.parameters',
					index,
					[],
				) as Array<{ name: string; value: string }>;
				if (queryParameters && queryParameters.length > 0) {
					requestOptions.qs = {} as IDataObject;
					for (const param of queryParameters) {
						if (param.name) {
							(requestOptions.qs as IDataObject)[param.name] = param.value;
						}
					}
				}
			} else if (specifyQuery === 'json') {
				const jsonQuery = this.getNodeParameter('jsonQuery', index, '') as string;
				if (jsonQuery) {
					try {
						requestOptions.qs = jsonParse(jsonQuery);
					} catch (error) {
						throw new Error('查询参数 JSON 格式无效');
					}
				}
			}
		}

		// 处理请求体
		if (sendBody) {
			const specifyBody = this.getNodeParameter('specifyBody', index, 'keypair') as string;
			if (specifyBody === 'keypair') {
				const bodyParameters = this.getNodeParameter(
					'bodyParameters.parameters',
					index,
					[],
				) as Array<{ name: string; value: string }>;
				if (bodyParameters && bodyParameters.length > 0) {
					requestOptions.body = {} as IDataObject;
					for (const param of bodyParameters) {
						if (param.name) {
							(requestOptions.body as IDataObject)[param.name] = param.value;
						}
					}
				}
			} else if (specifyBody === 'json') {
				const jsonBody = this.getNodeParameter('jsonBody', index, '') as string;
				if (jsonBody) {
					try {
						requestOptions.body = jsonParse(jsonBody);
					} catch (error) {
						throw new Error('请求体 JSON 格式无效');
					}
				}
			}
		}

		// 处理超时
		if (options.timeout) {
			requestOptions.timeout = options.timeout;
		}

		// 处理批处理
		const batchSize = options.batching?.batch?.batchSize ?? -1;
		const batchInterval = options.batching?.batch?.batchInterval ?? 0;

		// 处理批处理延迟
		if (index > 0 && batchSize >= 0 && batchInterval > 0) {
			if (index % (batchSize > 0 ? batchSize : 1) === 0) {
				await sleep(batchInterval);
			}
		}

		// 执行请求
		return await RequestUtils.request.call(this, requestOptions);
	},
};

export default CustomRequestOperate;

