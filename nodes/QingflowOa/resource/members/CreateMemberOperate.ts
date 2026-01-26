import { IDataObject, IExecuteFunctions, IHttpRequestOptions, jsonParse } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';
import { commonOptions, ICommonOptionsValue } from '../../../help/utils/sharedOptions';

const defaultBodyJson = JSON.stringify(
	{
		userId: '',
		name: '',
		email: '',
		areaCode: '86',
		mobileNum: '',
		headImg: '',
		department: [],
		role: [],
		customRole: [],
		customDepartment: [],
		beingDisabled: false,
		superiorId: '',
	},
	null,
	2,
);

const CreateMemberOperate: ResourceOperations = {
	name: '创建成员',
	value: 'createMember',
	action: '创建成员',
	order: 10,
	options: [
		{
			displayName: 'Body',
			name: 'body',
			type: 'json',
			default: defaultBodyJson,
			required: true,
			description:
				'请求体 JSON 格式。必填参数：userId (string), name (string), email (string)。可选参数：areaCode (string, 默认86), mobileNum (string), headImg (string), department (array), role (array), customRole (array), customDepartment (array), beingDisabled (boolean), superiorId (string)',
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
		if (!body.userId) {
			throw new Error('userId 不能为空');
		}
		if (!body.name) {
			throw new Error('name 不能为空');
		}
		if (!body.email) {
			throw new Error('email 不能为空');
		}

		const requestOptions: IHttpRequestOptions = {
			method: 'POST',
			url: '/user',
			body,
		};

		if (options.timeout) {
			requestOptions.timeout = options.timeout;
		}

		const response = await RequestUtils.request.call(this, requestOptions);

		return response as IDataObject;
	},
};

export default CreateMemberOperate;

