import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';
import { jsonParse } from 'n8n-workflow';

const defaultBodyJson = JSON.stringify(
	{
		appName: '',
		tagIds: [],
		appIcon: '',
		appId: '',
		appAuth: null,
		authMembers: {},
		userIds: [],
		deptIds: [],
		roleIds: [],
		includedSubDepts: false,
	},
	null,
	2,
);

const CreateAppOperate: ResourceOperations = {
	name: '创建应用',
	value: 'createApp',
	action: '创建应用',
	options: [
		{
			displayName: 'Body',
			name: 'body',
			type: 'json',
			default: defaultBodyJson,
			required: true,
			description:
				'请求体 JSON 格式。必填参数：appName (string), tagIds (array)。可选参数：appIcon (string), appId (string), appAuth (int), authMembers (object), userIds (array), deptIds (array), roleIds (array), includedSubDepts (boolean)',
			typeOptions: {
				alwaysOpenEditWindow: true,
			},
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
		const bodyJson = this.getNodeParameter('body', index) as string;

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
		if (!body.appName) {
			throw new Error('appName 不能为空');
		}
		if (!body.tagIds || !Array.isArray(body.tagIds)) {
			throw new Error('tagIds 必须是数组');
		}

		const response = await RequestUtils.request.call(this, {
			method: 'POST',
			url: '/app',
			body,
		});

		return response as IDataObject;
	},
};

export default CreateAppOperate;

