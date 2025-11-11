import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';
import { jsonParse } from 'n8n-workflow';

const defaultBodyJson = JSON.stringify(
	{
		roleName: '',
		roleId: null,
	},
	null,
	2,
);

const CreateRoleOperate: ResourceOperations = {
	name: '创建角色',
	value: 'createRole',
	action: '创建角色',
	options: [
		{
			displayName: 'Body',
			name: 'body',
			type: 'json',
			default: defaultBodyJson,
			required: true,
			description: '请求体 JSON 格式。必填参数：roleName (string), roleId (int)',
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
		if (!body.roleName) {
			throw new Error('roleName 不能为空');
		}
		if (!body.roleId || body.roleId === 0) {
			throw new Error('roleId 不能为空且必须大于0');
		}

		const response = await RequestUtils.request.call(this, {
			method: 'POST',
			url: '/role',
			body,
		});

		return response as IDataObject;
	},
};

export default CreateRoleOperate;

