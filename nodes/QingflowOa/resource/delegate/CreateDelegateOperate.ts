import { IDataObject, IExecuteFunctions, IHttpRequestOptions, jsonParse } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';
import { commonOptions, ICommonOptionsValue } from '../../../help/utils/sharedOptions';

const defaultBodyJson = JSON.stringify(
	{
		delegateUserIds: [],
		delegatedTagIds: [],
		delegateAppKeys: [],
		startTime: '',
		endTime: '',
		userId: '',
	},
	null,
	2,
);

const CreateDelegateOperate: ResourceOperations = {
	name: '新增委托',
	value: 'createDelegate',
	action: '新增委托',
	order: 10,
	options: [
		{
			displayName: 'Body',
			name: 'body',
			type: 'json',
			default: defaultBodyJson,
			required: true,
			description:
				'请求体 JSON 格式。必填参数：delegateUserIds (array), delegatedTagIds (array), delegateAppKeys (array), startTime (datetime), endTime (datetime), userId (string)',
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
		if (!body.delegateUserIds || !Array.isArray(body.delegateUserIds)) {
			throw new Error('delegateUserIds 必须是非空数组');
		}
		if (!body.delegatedTagIds || !Array.isArray(body.delegatedTagIds)) {
			throw new Error('delegatedTagIds 必须是非空数组');
		}
		if (!body.delegateAppKeys || !Array.isArray(body.delegateAppKeys)) {
			throw new Error('delegateAppKeys 必须是非空数组');
		}
		if (!body.startTime) {
			throw new Error('startTime 不能为空');
		}
		if (!body.endTime) {
			throw new Error('endTime 不能为空');
		}
		if (!body.userId) {
			throw new Error('userId 不能为空');
		}

		const requestOptions: IHttpRequestOptions = {
			method: 'POST',
			url: '/delegate',
			body,
		};

		if (options.timeout) {
			requestOptions.timeout = options.timeout;
		}

		const response = await RequestUtils.request.call(this, requestOptions);

		return response as IDataObject;
	},
};

export default CreateDelegateOperate;

