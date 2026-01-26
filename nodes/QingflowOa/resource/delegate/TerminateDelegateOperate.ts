import { IDataObject, IExecuteFunctions, IHttpRequestOptions, jsonParse } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';
import { commonOptions, ICommonOptionsValue } from '../../../help/utils/sharedOptions';

const defaultBodyJson = JSON.stringify(
	{
		delegateId: null,
		userId: '',
	},
	null,
	2,
);

const TerminateDelegateOperate: ResourceOperations = {
	name: '结束委托',
	value: 'terminateDelegate',
	action: '结束委托',
	order: 30,
	options: [
		{
			displayName: 'Body',
			name: 'body',
			type: 'json',
			default: defaultBodyJson,
			required: true,
			description: '请求体 JSON 格式。必填参数：delegateId (int), userId (string)',
			typeOptions: {
				alwaysOpenEditWindow: true,
			},
		},
		commonOptions,
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
		const bodyJson = this.getNodeParameter('body', index) as string;
		const options = this.getNodeParameter('options', index, {}) as ICommonOptionsValue;

		if (!bodyJson) {
			throw new Error('请求体不能为空');
		}

		let body: IDataObject;
		try {
			body = jsonParse(bodyJson);
		} catch (error) {
			throw new Error('请求体 JSON 格式无效: ' + error.message);
		}

		// 验证必填参数
		if (!body.delegateId || body.delegateId === null) {
			throw new Error('delegateId 不能为空');
		}
		if (!body.userId) {
			throw new Error('userId 不能为空');
		}

		const requestOptions: IHttpRequestOptions = {
			method: 'POST',
			url: '/delegate/terminate',
			body,
		};

		if (options.timeout) {
			requestOptions.timeout = options.timeout;
		}

		const response = await RequestUtils.request.call(this, requestOptions);

		return response as IDataObject;
	},
};

export default TerminateDelegateOperate;

