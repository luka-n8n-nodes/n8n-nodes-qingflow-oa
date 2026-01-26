import { IDataObject, IExecuteFunctions, IHttpRequestOptions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';
import { commonOptions, ICommonOptionsValue } from '../../../help/utils/sharedOptions';

const GetApplicationDataDetailOperate: ResourceOperations = {
	name: '获取单条数据的详细信息',
	value: 'getApplicationDataDetail',
	action: '获取单条数据的详细信息',
	order: 20,
	options: [
		{
			displayName: 'Apply ID',
			name: 'applyId',
			type: 'string',
			required: true,
			default: '',
			description: '数据ID，获取方式参考：基本概念介绍',
		},
		commonOptions,
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
		const applyId = this.getNodeParameter('applyId', index) as string;
		const options = this.getNodeParameter('options', index, {}) as ICommonOptionsValue;

		if (!applyId) {
			throw new Error('Apply ID 不能为空');
		}

		const requestOptions: IHttpRequestOptions = {
			method: 'GET',
			url: `/apply/${applyId}`,
		};

		if (options.timeout) {
			requestOptions.timeout = options.timeout;
		}

		const response = await RequestUtils.request.call(this, requestOptions);

		return response as IDataObject;
	},
};

export default GetApplicationDataDetailOperate;

