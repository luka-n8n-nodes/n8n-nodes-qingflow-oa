import { IDataObject, IExecuteFunctions, jsonParse  } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';


const defaultBodyJson = JSON.stringify(
	{
		roleId: null,
		userIds: [],
	},
	null,
	2,
);

const RemoveRoleMembersOperate: ResourceOperations = {
	name: '移除角色成员',
	value: 'removeRoleMembers',
	action: '移除角色成员',
	options: [
		{
			displayName: 'Role ID',
			name: 'roleId',
			type: 'string',
			required: true,
			default: '',
			description: '角色ID，可通过获取角色列表获取',
		},
		{
			displayName: 'Body',
			name: 'body',
			type: 'json',
			default: defaultBodyJson,
			required: true,
			description: '请求体 JSON 格式。必填参数：roleId (int), userIds (array)',
			typeOptions: {
				alwaysOpenEditWindow: true,
			},
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
		const roleId = this.getNodeParameter('roleId', index) as string;
		const bodyJson = this.getNodeParameter('body', index) as string;

		if (!roleId) {
			throw new Error('Role ID 不能为空');
		}

		const roleIdNum = parseInt(roleId, 10);
		if (isNaN(roleIdNum) || roleIdNum <= 0) {
			throw new Error('Role ID 必须是大于0的数字');
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

		// 验证必填参数
		if (!body.roleId || body.roleId === 0) {
			throw new Error('请求体中的 roleId 不能为空且必须大于0');
		}
		if (!body.userIds || !Array.isArray(body.userIds) || body.userIds.length === 0) {
			throw new Error('请求体中的 userIds 必须是非空数组');
		}

		const response = await RequestUtils.request.call(this, {
			method: 'DELETE',
			url: `/role/${roleIdNum}/user`,
			body,
		});

		return response as IDataObject;
	},
};

export default RemoveRoleMembersOperate;

