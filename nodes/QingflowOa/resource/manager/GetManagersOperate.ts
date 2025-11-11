import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const GetManagersOperate: ResourceOperations = {
	name: '获取管理员列表',
	value: 'getManagers',
	action: '获取管理员列表',
	options: [],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
		const response = await RequestUtils.request.call(this, {
			method: 'GET',
			url: '/manager/super',
		});

		return response as IDataObject | IDataObject[];
	},
};

export default GetManagersOperate;

