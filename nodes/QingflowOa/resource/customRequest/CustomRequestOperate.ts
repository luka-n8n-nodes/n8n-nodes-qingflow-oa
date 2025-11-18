import {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	INodeProperties,
	jsonParse,
	sleep,
} from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const DEFAULT_PAGE_SIZE = 200;
const DEFAULT_MAX_PAGES = 1000;

interface PaginationConfig {
	pageSizeField?: string;
	pageNumField?: string;
	dataPath?: string;
	totalPath?: string;
	maxPages?: number;
	paginationInterval?: number;
}

interface RequestOptions {
	batching?: { batch?: { batchSize?: number; batchInterval?: number } };
	timeout?: number;
	returnAll?: boolean;
	paginationConfig?: { config?: PaginationConfig };
}

interface ParameterItem {
	name: string;
	value: string;
}

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
		const options = this.getNodeParameter('options', index, {}) as RequestOptions;

		const getValueByPath = (obj: any, path: string): any => {
			if (!path) return obj;
			return path.split('.').reduce((current, key) => current?.[key], obj);
		};

		const parseKeyValuePairs = (parameters: ParameterItem[]): IDataObject => {
			const result: IDataObject = {};
			parameters.forEach((param) => {
				if (param.name) {
					result[param.name] = param.value;
				}
			});
			return result;
		};

		const parseParameters = (
			paramName: string,
			specifyName: string,
			jsonParamName: string,
			errorMsg: string,
		): IDataObject | undefined => {
			const specifyType = this.getNodeParameter(specifyName, index, 'keypair') as string;

			if (specifyType === 'keypair') {
				const parameters = this.getNodeParameter(paramName, index, []) as ParameterItem[];
				return parameters.length > 0 ? parseKeyValuePairs(parameters) : undefined;
			}

			if (specifyType === 'json') {
				const jsonString = this.getNodeParameter(jsonParamName, index, '') as string;
				if (jsonString) {
					try {
						return jsonParse(jsonString);
					} catch (error) {
						throw new Error(errorMsg);
					}
				}
			}

			return undefined;
		};

		const applyPaginationParams = (
			params: IDataObject,
			pageNum: number,
			config: PaginationConfig,
		): void => {
			const pageSizeField = config.pageSizeField || 'pageSize';
			const pageNumField = config.pageNumField || 'pageNum';

			params[pageNumField] = pageNum;
			if (!params[pageSizeField]) {
				params[pageSizeField] = DEFAULT_PAGE_SIZE;
			}
		};

		const buildRequestOptions = (pageNum?: number): IHttpRequestOptions => {
			const requestOptions: IHttpRequestOptions = { method, url, json: true };

			if (sendQuery) {
				const qs = parseParameters(
					'queryParameters.parameters',
					'specifyQuery',
					'jsonQuery',
					'查询参数 JSON 格式无效',
				);
				if (qs) requestOptions.qs = qs;
			}

			if (sendBody) {
				const body = parseParameters(
					'bodyParameters.parameters',
					'specifyBody',
					'jsonBody',
					'请求体 JSON 格式无效',
				);
				if (body) requestOptions.body = body;
			}

			if (pageNum !== undefined && options.returnAll) {
				const config = options.paginationConfig?.config || {};

				if (!requestOptions.qs && !requestOptions.body) {
					requestOptions.qs = {};
				}

				const targetParams = (requestOptions.qs || requestOptions.body) as IDataObject;
				applyPaginationParams(targetParams, pageNum, config);
			}

			if (options.timeout) {
				requestOptions.timeout = options.timeout;
			}

			return requestOptions;
		};

		const handleBatchDelay = async (): Promise<void> => {
			const batchSize = options.batching?.batch?.batchSize ?? -1;
			const batchInterval = options.batching?.batch?.batchInterval ?? 0;

			if (index > 0 && batchSize >= 0 && batchInterval > 0) {
				const effectiveBatchSize = batchSize > 0 ? batchSize : 1;
				if (index % effectiveBatchSize === 0) {
					await sleep(batchInterval);
				}
			}
		};

		const fetchAllPages = async (): Promise<any[]> => {
			const config = options.paginationConfig?.config || {};
			const dataPath = config.dataPath || 'result';
			const totalPath = config.totalPath || 'resultAmount';
			const maxPages = config.maxPages || DEFAULT_MAX_PAGES;
			const paginationInterval = config.paginationInterval ?? 0;

			const allResults: any[] = [];
			let pageNum = 1;

			const requestOptions = buildRequestOptions(pageNum);
			const response = await RequestUtils.request.call(this, requestOptions);

			const data = getValueByPath(response, dataPath);
			const total = getValueByPath(response, totalPath);

			const hasPaginationStructure = data !== undefined && total !== undefined;

			if (!hasPaginationStructure) {
				this.logger.info('响应数据不包含分页结构，返回原始响应数据');
				return Array.isArray(response) ? response : [response];
			}

			if (!Array.isArray(data)) {
				this.logger.warn(
					`响应数据路径 "${dataPath}" 返回的不是数组，尝试直接使用响应数据`,
				);
				return Array.isArray(response) ? response : [response];
			}

			allResults.push(...data);

			if (allResults.length >= total || data.length === 0) {
				return allResults;
			}

			pageNum++;

			while (true) {
				if (paginationInterval > 0) {
					await sleep(paginationInterval);
				}

				const nextRequestOptions = buildRequestOptions(pageNum);
				const nextResponse = await RequestUtils.request.call(this, nextRequestOptions);
				const nextData = getValueByPath(nextResponse, dataPath) || [];
				const nextTotal = getValueByPath(nextResponse, totalPath) || 0;

				if (!Array.isArray(nextData)) {
					break;
				}

				allResults.push(...nextData);

				if (allResults.length >= nextTotal || pageNum >= maxPages || nextData.length === 0) {
					if (pageNum >= maxPages) {
						this.logger.warn(`已达到最大分页数限制(${maxPages}页)，停止获取`);
					}
					break;
				}

				pageNum++;
			}

			return allResults;
		};

		await handleBatchDelay();

		if (!options.returnAll) {
			return await RequestUtils.request.call(this, buildRequestOptions());
		}

		return await fetchAllPages();
	},
};

export default CustomRequestOperate;

