import { IDataObject, IExecuteFunctions, IHttpRequestOptions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';
import { commonOptions, ICommonOptionsValue } from '../../../help/utils/sharedOptions';

const DeleteRoleOperate: ResourceOperations = {
	name: '删除角色',
	value: 'deleteRole',
	action: '删除角色',
	order: 50,
	options: [
		{
			displayName: 'Role ID',
			name: 'roleId',
			type: 'string',
			required: true,
			default: '',
			description: '角色ID，可通过获取角色列表获取',
		},
		commonOptions,
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
		const roleId = this.getNodeParameter('roleId', index) as string;
		const options = this.getNodeParameter('options', index, {}) as ICommonOptionsValue;

		if (!roleId) {
			throw new Error('Role ID 不能为空');
		}

		const roleIdNum = parseInt(roleId, 10);
		if (isNaN(roleIdNum) || roleIdNum <= 0) {
			throw new Error('Role ID 必须是大于0的数字');
		}

		const requestOptions: IHttpRequestOptions = {
			method: 'DELETE',
			url: `/role/${roleIdNum}`,
		};

		if (options.timeout) {
			requestOptions.timeout = options.timeout;
		}

		const response = await RequestUtils.request.call(this, requestOptions);

		return response as IDataObject;
	},
};

export default DeleteRoleOperate;

