import { IDataObject, IExecuteFunctions, IHttpRequestOptions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';
import { commonOptions, ICommonOptionsValue } from '../../../help/utils/sharedOptions';

const GetAppPrintTemplateOperate: ResourceOperations = {
	name: '获取应用Word打印模版信息',
	value: 'getAppPrintTemplate',
	action: '获取应用Word打印模版信息',
	order: 30,
	options: [
		{
			displayName: 'App Key',
			name: 'appKey',
			type: 'string',
			required: true,
			default: '',
			description: '应用Key',
		},
		commonOptions,
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
		const appKey = this.getNodeParameter('appKey', index) as string;
		const options = this.getNodeParameter('options', index, {}) as ICommonOptionsValue;

		if (!appKey) {
			throw new Error('App Key 不能为空');
		}

		const requestOptions: IHttpRequestOptions = {
			method: 'GET',
			url: `/app/${appKey}/print`,
		};

		if (options.timeout) {
			requestOptions.timeout = options.timeout;
		}

		const response = await RequestUtils.request.call(this, requestOptions);

		return response as IDataObject;
	},
};

export default GetAppPrintTemplateOperate;

