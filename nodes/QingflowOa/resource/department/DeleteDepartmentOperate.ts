import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const DeleteDepartmentOperate: ResourceOperations = {
	name: '删除部门',
	value: 'deleteDepartment',
	action: '删除部门',
	options: [
		{
			displayName: 'Dept ID',
			name: 'deptId',
			type: 'string',
			required: true,
			default: '',
			description: '部门ID，可通过获取部门列表获取',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
		const deptId = this.getNodeParameter('deptId', index) as string;

		if (!deptId) {
			throw new Error('Dept ID 不能为空');
		}

		const deptIdNum = parseInt(deptId, 10);
		if (isNaN(deptIdNum) || deptIdNum <= 0) {
			throw new Error('Dept ID 必须是大于0的数字');
		}

		const response = await RequestUtils.request.call(this, {
			method: 'DELETE',
			url: `/department/${deptIdNum}`,
		});

		return response as IDataObject;
	},
};

export default DeleteDepartmentOperate;

