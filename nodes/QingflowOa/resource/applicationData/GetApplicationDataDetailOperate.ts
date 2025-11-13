import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const GetApplicationDataDetailOperate: ResourceOperations = {
	name: '获取单条数据的详细信息',
	value: 'getApplicationDataDetail',
	action: '获取单条数据的详细信息',
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
			displayName: 'Apply ID',
			name: 'applyId',
			type: 'string',
			required: true,
			default: '',
			description: '应用数据ID',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
		const appKey = this.getNodeParameter('appKey', index) as string;
		const applyId = this.getNodeParameter('applyId', index) as string;

		if (!appKey) {
			throw new Error('App Key 不能为空');
		}

		if (!applyId) {
			throw new Error('Apply ID 不能为空');
		}

		const response = await RequestUtils.request.call(this, {
			method: 'GET',
			url: `/${appKey}/apply/${applyId}`,
		});

		return response as IDataObject;
	},
};

export default GetApplicationDataDetailOperate;

