import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const GetAppPrintTemplateOperate: ResourceOperations = {
	name: '获取应用Word打印模版信息',
	value: 'getAppPrintTemplate',
	action: '获取应用Word打印模版信息',
	options: [
		{
			displayName: 'App Key',
			name: 'appKey',
			type: 'string',
			required: true,
			default: '',
			description: '应用Key',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
		const appKey = this.getNodeParameter('appKey', index) as string;

		if (!appKey) {
			throw new Error('App Key 不能为空');
		}

		const response = await RequestUtils.request.call(this, {
			method: 'GET',
			url: `/app/${appKey}/print`,
		});

		return response as IDataObject;
	},
};

export default GetAppPrintTemplateOperate;

