import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
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
			type: 'options',
			options: [
				{
					name: '待办事项',
					value: 1,
				},
				{
					name: '我的申请',
					value: 2,
				},
				{
					name: '抄送',
					value: 3,
				},
				{
					name: '草稿',
					value: 4,
				},
				{
					name: '已办事项',
					value: 5,
				},
			],
			default: 1,
			description: '事项类型',
		},
		{
			displayName: 'Status',
			name: 'status',
			type: 'options',
			displayOptions: {
				show: {
					type: [1],
				},
			},
			options: [
				{
					name: '全部',
					value: 1,
				},
				{
					name: '催办',
					value: 4,
				},
				{
					name: '即将超时',
					value: 5,
				},
				{
					name: '已超时',
					value: 6,
				},
			],
			default: 1,
			description: '待办事项状态筛选',
		},
		{
			displayName: 'Status',
			name: 'status',
			type: 'options',
			displayOptions: {
				show: {
					type: [2],
				},
			},
			options: [
				{
					name: '全部',
					value: 1,
				},
				{
					name: '通过',
					value: 2,
				},
				{
					name: '拒绝',
					value: 3,
				},
				{
					name: '待完善',
					value: 4,
				},
				{
					name: '流程中',
					value: 5,
				},
			],
			default: 1,
			description: '我的申请状态筛选',
		},
		{
			displayName: 'Status',
			name: 'status',
			type: 'options',
			displayOptions: {
				show: {
					type: [3],
				},
			},
			options: [
				{
					name: '全部',
					value: 1,
				},
				{
					name: '未读',
					value: 3,
				},
			],
			default: 1,
			description: '抄送状态筛选',
		},
		{
			displayName: 'Status',
			name: 'status',
			type: 'options',
			displayOptions: {
				show: {
					type: [4],
				},
			},
			options: [
				{
					name: '全部',
					value: 1,
				},
			],
			default: 1,
			description: '草稿状态筛选',
		},
		{
			displayName: 'Status',
			name: 'status',
			type: 'options',
			displayOptions: {
				show: {
					type: [5],
				},
			},
			options: [
				{
					name: '全部',
					value: 1,
				},
				{
					name: '通过',
					value: 2,
				},
				{
					name: '拒绝',
					value: 3,
				},
				{
					name: '流程中',
					value: 5,
				},
			],
			default: 1,
			description: '已办事项状态筛选',
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
		const qs: IDataObject = {
			pageSize,
			pageNum,
			userId,
		};
		
		// 只在有值时添加可选参数
		if (type !== undefined && type !== null) {
			qs.type = type;
		}
		if (status !== undefined && status !== null) {
			qs.status = status;
		}

		const response = await RequestUtils.request.call(this, {
			method: 'GET',
			url: '/dynamic/audits',
			qs,
			json: true,
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
				if (allResults.length >= total || pageNum >= 1000 || data.length === 0) {
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

