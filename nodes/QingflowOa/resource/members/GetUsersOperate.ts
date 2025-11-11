import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const GetUsersOperate: ResourceOperations = {
	name: '获取工作区全部成员',
	value: 'getAllUsers',
	action: '获取工作区全部成员',
	options: [
		{
			displayName: 'Return All',
			name: 'returnAll',
			type: 'boolean',
			default: false,
			description: '是否返回所有结果（递归获取所有分页数据）',
		},
		{
			displayName: 'Limit',
			name: 'limit',
			type: 'number',
			default: 50,
			displayOptions: {
				show: {
					returnAll: [false],
				},
			},
			description: '每页返回的记录数',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
		const returnAll = this.getNodeParameter('returnAll', index, false) as boolean;
		const limit = this.getNodeParameter('limit', index, 50) as number;

		// 统一的请求函数
		const fetchPage = async (pageNum: number, pageSize: number) => {
			const response = await RequestUtils.request.call(this, {
				method: 'GET',
				url: '/user',
				qs: {
					pageSize,
					pageNum,
				},
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
			const pageSize = limit || 50;

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

export default GetUsersOperate;
