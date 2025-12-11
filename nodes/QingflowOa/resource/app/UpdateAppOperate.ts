import { IDataObject, IExecuteFunctions, jsonParse  } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';


const defaultBodyJson = JSON.stringify(
	{
		tagIds: [],
		appIcon: '',
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

const UpdateAppOperate: ResourceOperations = {
	name: '更新应用基本信息',
	value: 'updateApp',
	action: '更新应用基本信息',
	options: [
		{
			displayName: 'App Key',
			name: 'appKey',
			type: 'string',
			required: true,
			default: '',
			description: '应用标识，数组为安全主数据标识为主——appKey',
		},
		{
			displayName: 'Body',
			name: 'body',
			type: 'json',
			default: defaultBodyJson,
			required: true,
			description:
				'请求体 JSON 格式。可选参数：tagIds (array), appIcon (string), appAuth (int), authMembers (object), userIds (array), deptIds (array), roleIds (array), includedSubDepts (boolean)',
			typeOptions: {
				alwaysOpenEditWindow: true,
			},
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
		const appKey = this.getNodeParameter('appKey', index) as string;
		const bodyJson = this.getNodeParameter('body', index) as string;

		if (!appKey) {
			throw new Error('App Key 不能为空');
		}

		if (!bodyJson) {
			throw new Error('请求体不能为空');
		}

		let body: IDataObject;
		try {
			body = jsonParse(bodyJson);
		} catch (error) {
			throw new Error('请求体 JSON 格式无效: ' + error.message);
		}

		const response = await RequestUtils.request.call(this, {
			method: 'POST',
			url: `/app/${appKey}`,
			body,
		});

		return response as IDataObject;
	},
};

export default UpdateAppOperate;

