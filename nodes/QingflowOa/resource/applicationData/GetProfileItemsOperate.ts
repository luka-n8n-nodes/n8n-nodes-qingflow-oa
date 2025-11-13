import { IDataObject, IExecuteFunctions, IHttpRequestOptions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const GetProfileItemsOperate: ResourceOperations = {
	name: '获取个人在当前工作区全部事项信息',
	value: 'getProfileItems',
	action: '获取个人在当前工作区全部事项信息',
	options: [
		{
			displayName: 'User ID',
			name: 'userId',
			type: 'string',
			required: true,
			default: '',
			description: '用户ID',
		},
		{
			displayName: 'Type',
			name: 'type',
			type: 'number',
			default: 0,
			description: '1:待办事项；2：我的申请；3：抄送；4：草稿；5：已办事项',
		},
		{
			displayName: 'Status',
			name: 'status',
			type: 'number',
			default: 0,
			description:
				'根据type值进行进一步筛选。type为1时：1:全部,4:催办,5:即将超时,6:已超时；type为2时：1:全部,2:通过,3:拒绝,4:待完善,5:流程中；type为3时：1:全部,3:未读；type为4时：1:全部；type为5时：1:全部,2:通过,3:拒绝,5:流程中',
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
		const userId = this.getNodeParameter('userId', index) as string;
		const returnAll = this.getNodeParameter('returnAll', index, false) as boolean;
		let limit = this.getNodeParameter('limit', index, 50) as number;
		const type = this.getNodeParameter('type', index) as number | undefined;
		const status = this.getNodeParameter('status', index) as number | undefined;

		if (!userId) {
			throw new Error('User ID 不能为空');
		}

		// 限制最大值
		if (limit > 200) {
			limit = 200;
			this.logger.warn('Limit 超过最大值 200，已自动调整为 200');
		}

		// 统一的请求函数
		const fetchPage = async (pageNum: number, pageSize: number) => {
			const requestOptions: IHttpRequestOptions = {
				method: 'GET',
				url: '/dynamic/audits',
			};

			const qs: IDataObject = {};
			qs.pageSize = pageSize;
			qs.pageNum = pageNum;
			qs.userId = userId;
			if (type !== undefined && type !== null) {
				qs.type = type;
			}
			if (status !== undefined && status !== null) {
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

export default GetProfileItemsOperate;

