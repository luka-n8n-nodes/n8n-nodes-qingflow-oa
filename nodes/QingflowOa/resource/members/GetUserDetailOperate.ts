import { IDataObject, IExecuteFunctions, IHttpRequestOptions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';
import { commonOptions, ICommonOptionsValue } from '../../../help/utils/sharedOptions';

const GetUserDetailOperate: ResourceOperations = {
	name: '获取用户详情',
	value: 'getUserDetail',
	action: '获取用户详情',
	order: 20,
	options: [
		{
			displayName: '用户ID',
			name: 'userId',
			type: 'string',
			required: true,
			default: '',
			description: '要查询的用户ID',
		},
		commonOptions,
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const userId = this.getNodeParameter('userId', index) as string;
		const options = this.getNodeParameter('options', index, {}) as ICommonOptionsValue;

		const requestOptions: IHttpRequestOptions = {
			method: 'GET',
			url: `/user/${userId}`,
		};

		if (options.timeout) {
			requestOptions.timeout = options.timeout;
		}

		return RequestUtils.request.call(this, requestOptions);
	},
};

export default GetUserDetailOperate;

