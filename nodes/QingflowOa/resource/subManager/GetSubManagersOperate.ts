import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const GetSubManagersOperate: ResourceOperations = {
	name: '获取工作区子管理员配置',
	value: 'getSubManagers',
	action: '获取工作区子管理员配置',
	options: [
		{
			displayName: 'Sub Manager ID',
			name: 'subManagerId',
			type: 'number',

			default: 0,
			description: '子管理员ID，获取某个子管理员详情（可选参数）',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
		const subManagerId = this.getNodeParameter('subManagerId', index) as number | undefined;

		const requestOptions: any = {
			method: 'GET',
			url: '/manager/sub',
		};

		if (subManagerId && subManagerId > 0) {
			requestOptions.qs = {
				subManagerId,
			};
		}

		const response = await RequestUtils.request.call(this, requestOptions);

		return response as IDataObject | IDataObject[];
	},
};

export default GetSubManagersOperate;

