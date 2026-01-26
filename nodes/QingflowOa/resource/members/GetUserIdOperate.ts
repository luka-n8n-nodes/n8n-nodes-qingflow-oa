import { IDataObject, IExecuteFunctions, IHttpRequestOptions, NodeOperationError } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';
import { commonOptions, ICommonOptionsValue } from '../../../help/utils/sharedOptions';

const GetUserIdOperate: ResourceOperations = {
	name: '通过邮箱或手机号获取成员userId',
	value: 'getUserId',
	action: '通过邮箱或手机号获取成员userId',
	order: 25,
	options: [
		{
			displayName: '查询方式',
			name: 'queryType',
			type: 'options',
			options: [
				{
					name: '邮箱',
					value: 'email',
				},
				{
					name: '手机号',
					value: 'phone',
				},
			],
			default: 'email',
			description: '选择使用邮箱还是手机号查询',
		},
		{
			displayName: '邮箱',
			name: 'email',
			type: 'string',
			displayOptions: {
				show: {
					queryType: ['email'],
				},
			},
			required: true,
			default: '',
			placeholder: 'user@example.com',
			description: '邮箱（与手机号同时传入时, 会使用邮箱查询成员信息）',
		},
		{
			displayName: '手机号',
			name: 'phone',
			type: 'string',
			displayOptions: {
				show: {
					queryType: ['phone'],
				},
			},
			required: true,
			default: '',
			placeholder: '13800138000',
			description: '用户手机号',
		},
		commonOptions,
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
		const email = this.getNodeParameter('email', index, '') as string;
		const phone = this.getNodeParameter('phone', index, '') as string;
		const options = this.getNodeParameter('options', index, {}) as ICommonOptionsValue;

		if (!email && !phone) {
			throw new NodeOperationError(this.getNode(), '邮箱或手机号不能同时为空');
		}

		const requestOptions: IHttpRequestOptions = {
			method: 'GET',
			url: '/user/getId',
			qs: {
				email: email || '',
				phone: phone || '',
			},
		};

		if (options.timeout) {
			requestOptions.timeout = options.timeout;
		}

		const response = await RequestUtils.request.call(this, requestOptions);

		return response?.result || response;
	},
};

export default GetUserIdOperate;

