import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const GetApplicationDataDetailOperate: ResourceOperations = {
	name: '获取单条数据的详细信息',
	value: 'getApplicationDataDetail',
	action: '获取单条数据的详细信息',
	options: [
		{
			displayName: 'Apply ID',
			name: 'applyId',
			type: 'string',
			required: true,
			default: '',
			description: '应用数据ID',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
		const applyId = this.getNodeParameter('applyId', index) as string;

		if (!applyId) {
			throw new Error('Apply ID 不能为空');
		}

		const response = await RequestUtils.request.call(this, {
			method: 'GET',
			url: `/apply/${applyId}`,
		});

		return response as IDataObject;
	},
};

export default GetApplicationDataDetailOperate;

