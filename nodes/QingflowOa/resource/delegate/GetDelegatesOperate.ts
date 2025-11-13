import { IDataObject, IExecuteFunctions, IHttpRequestOptions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const GetDelegatesOperate: ResourceOperations = {
	name: '获取委托列表',
	value: 'getDelegates',
	action: '获取委托列表',
	options: [
		{
			displayName: 'Type',
			name: 'type',
			type: 'number',
			default: 0,
			description: '委托类型，1委托他人，2被他人委托',
		},
		{
			displayName: 'Status',
			name: 'status',
			type: 'string',
			default: '',
			description: '委托状态',
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
		const returnAll = this.getNodeParameter('returnAll', index, false) as boolean;
		let limit = this.getNodeParameter('limit', index, 50) as number;
		const type = this.getNodeParameter('type', index) as number | undefined;
		const status = this.getNodeParameter('status', index) as string | undefined;

		// 限制最大值
		if (limit > 200) {
			limit = 200;
			this.logger.warn('Limit 超过最大值 200，已自动调整为 200');
		}

		// 统一的请求函数
		const fetchPage = async (pageNum: number, pageSize: number) => {
			const requestOptions: IHttpRequestOptions = {
				method: 'GET',
				url: '/delegate',
			};

			const qs: IDataObject = {};
			qs.pageNum = pageNum;
			qs.pageSize = pageSize;
			if (type !== undefined && type !== null) {
				qs.type = type;
			}
			if (status) {
				qs.status = status;
			}

			if (Object.keys(qs).length > 0) {
				requestOptions.qs = qs;
			}

			const response = await RequestUtils.request.call(this, requestOptions);
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

export default GetDelegatesOperate;

