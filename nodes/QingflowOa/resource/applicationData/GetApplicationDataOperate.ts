import { IDataObject, IExecuteFunctions, jsonParse  } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';


const defaultBodyJson = JSON.stringify(
	{
		type: null,
		sorts: [],
		queriesRel: 'and',
		queries: [],
		queryKey: '',
		applyIds: [],
	},
	null,
	2,
);

const GetApplicationDataOperate: ResourceOperations = {
	name: '获取应用数据',
	value: 'getApplicationData',
	action: '获取应用数据',
	options: [
		{
			displayName: 'App Key',
			name: 'appKey',
			type: 'string',
			required: true,
			default: '',
			description: '应用的appKey,可在轻流中应用的URL查询,或通过【获取工作区所有应用】接口获取',
		},
		{
			displayName: 'Body',
			name: 'body',
			type: 'json',
			default: defaultBodyJson,
			required: true,
			description: '参考：https://exiao.yuque.com/ixwxsb/bgzs0e/nkrtwkdwxgxsx73e',
			typeOptions: {
				alwaysOpenEditWindow: true,
			},
		},
		{
			displayName: 'Return All',
			name: 'returnAll',
			type: 'boolean',
			default: false,
			description: 'Whether to return all results or only up to a given limit',
		},
		{
			displayName: 'Limit',
			name: 'limit',
			type: 'number',
			typeOptions: {
				minValue: 1,
			},
			default: 50,
			displayOptions: {
				show: {
					returnAll: [false],
				},
			},
			description: 'Max number of results to return',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
		const appKey = this.getNodeParameter('appKey', index) as string;
		const bodyJson = this.getNodeParameter('body', index) as string;
		const returnAll = this.getNodeParameter('returnAll', index, false) as boolean;
		let limit = this.getNodeParameter('limit', index, 50) as number;

		if (!appKey) {
			throw new Error('App Key 不能为空');
		}

		if (!bodyJson) {
			throw new Error('请求体不能为空');
		}

		// 限制最大值
		if (limit > 200) {
			limit = 200;
			this.logger.warn('Limit 超过最大值 200，已自动调整为 200');
		}

		// 解析请求体
		let body: IDataObject;
		try {
			body = jsonParse(bodyJson);
		} catch (error) {
			throw new Error('请求体 JSON 格式无效: ' + error.message);
		}

		// 统一的请求函数
		const fetchPage = async (pageNum: number, pageSize: number) => {
			const requestBody: IDataObject = {
				...body,
				pageSize,
				pageNum,
			};

			const response = await RequestUtils.request.call(this, {
				method: 'POST',
				url: `/app/${appKey}/apply/filter`,
				body: requestBody,
			});

			return {
				data: response?.result || [],
				total: response?.resultAmount || 0,
			};
		};

		// 处理分页逻辑
		if (returnAll) {
			let allResults: any[] = [];
			let pageNum = 1;
			const pageSize = limit;

			while (true) {
				const { data, total } = await fetchPage(pageNum, pageSize);
				allResults = allResults.concat(data);

				// 检查是否还有更多数据
				if (allResults.length >= total || pageNum >= 1000) {
					if (pageNum >= 1000) {
						this.logger.warn('已达到最大分页数限制(1000页)，停止获取');
					}
					break;
				}

				pageNum++;
			}

			return allResults;
		} else {
			// 单次请求，返回第一页数据
			const { data } = await fetchPage(1, limit);
			return data;
		}
	},
};

export default GetApplicationDataOperate;

