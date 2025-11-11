import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const GetDepartmentsOperate: ResourceOperations = {
	name: '获取部门列表',
	value: 'getDepartments',
	action: '获取部门列表',
	options: [
		{
			displayName: 'Dept ID',
			name: 'deptId',
			type: 'string',

			default: '',
			description: '部门ID，可获取指定部门子部门列表（可选参数）',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
		const deptId = this.getNodeParameter('deptId', index) as string | undefined;

		const requestOptions: any = {
			method: 'GET',
			url: '/department',
		};

		if (deptId) {
			const deptIdNum = parseInt(deptId, 10);
			if (!isNaN(deptIdNum) && deptIdNum > 0) {
				requestOptions.qs = {
					deptId: deptIdNum,
				};
			}
		}

		const response = await RequestUtils.request.call(this, requestOptions);

		return response as IDataObject | IDataObject[];
	},
};

export default GetDepartmentsOperate;

