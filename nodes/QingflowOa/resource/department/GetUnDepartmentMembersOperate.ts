import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const GetUnDepartmentMembersOperate: ResourceOperations = {
	name: '获取不在部门的成员',
	value: 'getUnDepartmentMembers',
	action: '获取不在部门的成员',
	options: [],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
		const response = await RequestUtils.request.call(this, {
			method: 'GET',
			url: '/unDepartment',
		});

		return response as IDataObject | IDataObject[];
	},
};

export default GetUnDepartmentMembersOperate;

