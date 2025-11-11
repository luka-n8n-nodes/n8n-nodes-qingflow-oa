import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const GetRolesOperate: ResourceOperations = {
	name: '获取角色列表',
	value: 'getRoles',
	action: '获取角色列表',
	options: [],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
		const response = await RequestUtils.request.call(this, {
			method: 'GET',
			url: '/role',
		});

		return response as IDataObject | IDataObject[];
	},
};

export default GetRolesOperate;

