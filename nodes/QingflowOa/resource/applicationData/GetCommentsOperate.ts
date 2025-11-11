import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const GetCommentsOperate: ResourceOperations = {
	name: '获取单条数据的留言信息',
	value: 'getComments',
	action: '获取单条数据的留言信息',
	options: [
		{
			displayName: 'Apply ID',
			name: 'applyId',
			type: 'string',
			required: true,
			default: '',
			description: '应用ID，可获得完整的产品调用数据，获得完整项目',
		},
		{
			displayName: 'Page Size',
			name: 'pageSize',
			type: 'number',
			required: true,
			default: 10,
			description: '每页数量',
		},
		{
			displayName: 'Page Num',
			name: 'pageNum',
			type: 'number',
			required: true,
			default: 1,
			description: '页码，从1开始',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
		const applyId = this.getNodeParameter('applyId', index) as string;
		const pageSize = this.getNodeParameter('pageSize', index) as number;
		const pageNum = this.getNodeParameter('pageNum', index) as number;

		if (!applyId) {
			throw new Error('Apply ID 不能为空');
		}

		if (!pageSize || pageSize <= 0) {
			throw new Error('Page Size 必须大于0');
		}

		if (!pageNum || pageNum <= 0) {
			throw new Error('Page Num 必须大于0');
		}

		const response = await RequestUtils.request.call(this, {
			method: 'GET',
			url: `/apply/${applyId}/comment/${pageSize}/${pageNum}`,
		});

		return response as IDataObject | IDataObject[];
	},
};

export default GetCommentsOperate;

