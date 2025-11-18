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
					displayName: 'Return All',
					name: 'returnAll',
					type: 'boolean',
					default: false,
					description: 'Whether to return all results or only up to a given limit',
				},
				{
					displayName: 'Pagination Config',
					name: 'paginationConfig',
					type: 'fixedCollection',
					typeOptions: {
						multipleValues: false,
					},
					displayOptions: {
						show: {
							returnAll: [true],
						},
					},
					default: {
						config: {},
					},
					options: [
						{
							displayName: 'Config',
							name: 'config',
							values: [
								{
									displayName: 'Max Pages',
									name: 'maxPages',
									type: 'number',
									default: 1000,
									typeOptions: {
										minValue: 1,
									},
									description: '最大分页数限制，防止无限循环',
								},
								{
									displayName: 'Page Number Field',
									name: 'pageNumField',
									type: 'string',
									default: 'pageNum',
									description: '页码参数的字段名（如：pageNum, page, offset）',
								},
								{
									displayName: 'Page Number Start',
									name: 'pageNumStart',
									type: 'number',
									default: 1,
									description: '页码起始值（通常是 0 或 1）',
								},
								{
									displayName: 'Page Size Field',
									name: 'pageSizeField',
									type: 'string',
									default: 'pageSize',
									description: '分页大小参数的字段名（如：pageSize, limit, per_page）',
								},
								{
									displayName: 'Pagination Interval (Ms)',
									name: 'paginationInterval',
									type: 'number',
									typeOptions: {
										minValue: 0,
									},
									default: 0,
									description: '每次分页请求之间的时间间隔（毫秒），用于避免触发频控。0 表示不限制。',
								},
								{
									displayName: 'Response Data Path',
									name: 'dataPath',
									type: 'string',
									default: 'result',
									placeholder: 'result 或 data.items',
									description: '响应数据在返回对象中的路径（使用点号分隔，如：result, data.items）',
								},
								{
									displayName: 'Response Total Path',
									name: 'totalPath',
									type: 'string',
									default: 'resultAmount',
									placeholder: 'resultAmount 或 data.total',
									description: '总数据量在返回对象中的路径（使用点号分隔，如：resultAmount, data.total）',
								},
							],
						},
					],
				},
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
			returnAll?: boolean;
			paginationConfig?: {
				config?: {
					pageSizeField?: string;
					pageNumField?: string;
					pageNumStart?: number;
					dataPath?: string;
					totalPath?: string;
					maxPages?: number;
					paginationInterval?: number;
				};
			};
		};

		// 辅助函数：根据路径从对象中获取值
		const getValueByPath = (obj: any, path: string): any => {
			if (!path) return obj;
			return path.split('.').reduce((current, key) => current?.[key], obj);
		};

		// 构建基础请求选项
		const buildRequestOptions = (pageNum?: number): IHttpRequestOptions => {
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

			// 如果指定了页码，更新分页参数
			if (pageNum !== undefined && options.returnAll) {
				const pageNumField =
					options.paginationConfig?.config?.pageNumField || 'pageNum';
				if (requestOptions.qs) {
					(requestOptions.qs as IDataObject)[pageNumField] = pageNum;
				} else if (requestOptions.body) {
					(requestOptions.body as IDataObject)[pageNumField] = pageNum;
				}
			}

			// 处理超时
			if (options.timeout) {
				requestOptions.timeout = options.timeout;
			}

			return requestOptions;
		};

		// 处理批处理
		const batchSize = options.batching?.batch?.batchSize ?? -1;
		const batchInterval = options.batching?.batch?.batchInterval ?? 0;

		// 处理批处理延迟
		if (index > 0 && batchSize >= 0 && batchInterval > 0) {
			if (index % (batchSize > 0 ? batchSize : 1) === 0) {
				await sleep(batchInterval);
			}
		}

		// 判断是否需要分页获取所有数据
		const returnAll = options.returnAll || false;

		if (!returnAll) {
			// 单次请求
			const requestOptions = buildRequestOptions();
			return await RequestUtils.request.call(this, requestOptions);
		}

		// 分页获取所有数据
		const paginationConfig = options.paginationConfig?.config || {};
		const pageNumStart = paginationConfig.pageNumStart ?? 1;
		const dataPath = paginationConfig.dataPath || 'result';
		const totalPath = paginationConfig.totalPath || 'resultAmount';
		const maxPages = paginationConfig.maxPages || 1000;
		const paginationInterval = paginationConfig.paginationInterval ?? 0;

		let allResults: any[] = [];
		let pageNum = pageNumStart;

		while (true) {
			const requestOptions = buildRequestOptions(pageNum);
			const response = await RequestUtils.request.call(this, requestOptions);

			// 从响应中提取数据和总数
			const data = getValueByPath(response, dataPath) || [];
			const total = getValueByPath(response, totalPath) || 0;

			// 合并结果
			if (Array.isArray(data)) {
				allResults = allResults.concat(data);
			} else {
				this.logger.warn(
					`响应数据路径 "${dataPath}" 返回的不是数组，尝试直接使用响应数据`,
				);
				if (Array.isArray(response)) {
					allResults = allResults.concat(response);
				} else {
					allResults.push(response);
				}
				break;
			}

			// 检查是否还有更多数据
			if (allResults.length >= total || pageNum - pageNumStart + 1 >= maxPages) {
				if (pageNum - pageNumStart + 1 >= maxPages) {
					this.logger.warn(`已达到最大分页数限制(${maxPages}页)，停止获取`);
				}
				break;
			}

			// 如果当前页没有数据，停止
			if (data.length === 0) {
				break;
			}

			pageNum++;

			// 分页间隔延迟（使用 paginationInterval，避免触发频控）
			if (paginationInterval > 0) {
				await sleep(paginationInterval);
			}
		}

		return allResults;
	},
};

export default CustomRequestOperate;

