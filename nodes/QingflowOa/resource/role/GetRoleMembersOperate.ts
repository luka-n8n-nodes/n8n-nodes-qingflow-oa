import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const GetRoleMembersOperate: ResourceOperations = {
	name: '获取角色成员',
	value: 'getRoleMembers',
	action: '获取角色成员',
	options: [
		{
			displayName: 'Role ID',
			name: 'roleId',
			type: 'string',
			required: true,
			default: '',
			description: '角色ID，可通过获取角色列表获取',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
		const roleId = this.getNodeParameter('roleId', index) as string;

		if (!roleId) {
			throw new Error('Role ID 不能为空');
		}

		const roleIdNum = parseInt(roleId, 10);
		if (isNaN(roleIdNum) || roleIdNum <= 0) {
			throw new Error('Role ID 必须是大于0的数字');
		}

		const response = await RequestUtils.request.call(this, {
			method: 'GET',
			url: `/role/${roleIdNum}/user`,
		});

		return response as IDataObject | IDataObject[];
	},
};

export default GetRoleMembersOperate;

