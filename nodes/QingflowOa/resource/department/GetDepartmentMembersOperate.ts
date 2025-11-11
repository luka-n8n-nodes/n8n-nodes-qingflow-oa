import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const GetDepartmentMembersOperate: ResourceOperations = {
	name: '获取部门成员列表',
	value: 'getDepartmentMembers',
	action: '获取部门成员列表',
	options: [
		{
			displayName: 'Dept ID',
			name: 'deptId',
			type: 'string',
			required: true,
			default: '',
			description: '部门ID',
		},
		{
			displayName: 'Include Child',
			name: 'includeChild',
			type: 'boolean',
			required: false,
			default: false,
			description: '是否包含子部门下的成员',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
		const deptId = this.getNodeParameter('deptId', index) as string;
		const includeChild = this.getNodeParameter('includeChild', index, false) as boolean;

		if (!deptId) {
			throw new Error('Dept ID 不能为空');
		}

		const deptIdNum = parseInt(deptId, 10);
		if (isNaN(deptIdNum) || deptIdNum <= 0) {
			throw new Error('Dept ID 必须是大于0的数字');
		}

		const requestOptions: any = {
			method: 'GET',
			url: `/department/${deptIdNum}/user`,
		};

		if (includeChild !== undefined) {
			requestOptions.qs = {
				includeChild,
			};
		}

		const response = await RequestUtils.request.call(this, requestOptions);

		return response as IDataObject | IDataObject[];
	},
};

export default GetDepartmentMembersOperate;

