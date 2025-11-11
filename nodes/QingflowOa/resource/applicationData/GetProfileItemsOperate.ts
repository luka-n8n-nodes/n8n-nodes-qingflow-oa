import { IDataObject, IExecuteFunctions, IHttpRequestOptions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const GetProfileItemsOperate: ResourceOperations = {
	name: '获取个人在当前工作区全部事项信息',
	value: 'getProfileItems',
	action: '获取个人在当前工作区全部事项信息',
	options: [
		{
			displayName: 'Page Size',
			name: 'pageSize',
			type: 'number',
			default: 50,
			description: '每页数量',
		},
		{
			displayName: 'Page Num',
			name: 'pageNum',
			type: 'number',
			default: 1,
			description: '页码，从1开始',
		},
		{
			displayName: 'UUID',
			name: 'uuid',
			type: 'string',

			default: '',
			description: '用户数',
		},
		{
			displayName: 'Status',
			name: 'status',
			type: 'number',

			default: 0,
			description:
				'工件内容采集情况，例如：申请、工件、工站、工件、检验批量，action内容关联 applyId (申请ID)',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
		const pageSize = this.getNodeParameter('pageSize', index, 50) as number;
		const pageNum = this.getNodeParameter('pageNum', index, 1) as number;
		const uuid = this.getNodeParameter('uuid', index) as string | undefined;
		const status = this.getNodeParameter('status', index) as number | undefined;

		if (pageSize <= 0) {
			throw new Error('Page Size 必须大于0');
		}
		if (pageNum <= 0) {
			throw new Error('Page Num 必须大于0');
		}

		const requestOptions: IHttpRequestOptions = {
			method: 'GET',
			url: '/dynamic/profile',
		};

		const qs: IDataObject = {};
		qs.pageSize = pageSize;
		qs.pageNum = pageNum;
		if (uuid) {
			qs.uuid = uuid;
		}
		if (status !== undefined && status !== null) {
			qs.status = status;
		}

		if (Object.keys(qs).length > 0) {
			requestOptions.qs = qs;
		}

		const response = await RequestUtils.request.call(this, requestOptions);

		return response as IDataObject | IDataObject[];
	},
};

export default GetProfileItemsOperate;

