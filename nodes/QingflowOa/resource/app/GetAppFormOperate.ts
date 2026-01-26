import { IDataObject, IExecuteFunctions, IHttpRequestOptions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const GetAppFormOperate: ResourceOperations = {
	name: '获取指定应用表单信息',
	value: 'getAppForm',
	action: '获取指定应用表单信息',
	options: [
		{
			displayName: 'App Key',
			name: 'appKey',
			type: 'string',
			required: true,
			default: '',
			description: '应用ID，获取方式参考：基本概念介绍——appKey',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
		const appKey = this.getNodeParameter('appKey', index) as string;

		if (!appKey) {
			throw new Error('App Key 不能为空');
		}

		const requestOptions: IHttpRequestOptions = {
			method: 'GET',
			url: `/app/${appKey}/form`,
		};

		const response = await RequestUtils.request.call(this, requestOptions);

		return response as IDataObject | IDataObject[];
	},
};

export default GetAppFormOperate;

