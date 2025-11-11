import { IDataObject, IExecuteFunctions, IHttpRequestOptions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const GetAllAppsOperate: ResourceOperations = {
	name: '获取工作区所有应用信息',
	value: 'getAllApps',
	action: '获取工作区所有应用信息',
	options: [
		{
			displayName: 'User ID',
			name: 'userId',
			type: 'string',

			default: '',
			description: '优选方案，可添加当前连接的的程序访问，userId为给定，欢迎工作区全员访问',
		},
		{
			displayName: 'Favourite',
			name: 'favourite',
			type: 'number',

			default: 0,
			description: 'UserId不满足当前，数据展现下：1，工作管理员的可访问数据机器端数据，管理端时（数据权限）',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
		const userId = this.getNodeParameter('userId', index) as string | undefined;
		const favourite = this.getNodeParameter('favourite', index) as number | undefined;

		const requestOptions: IHttpRequestOptions = {
			method: 'GET',
			url: '/app',
		};

		const qs: IDataObject = {};
		if (userId) {
			qs.userId = userId;
		}
		if (favourite !== undefined && favourite !== null) {
			qs.favourite = favourite;
		}

		if (Object.keys(qs).length > 0) {
			requestOptions.qs = qs;
		}

		const response = await RequestUtils.request.call(this, requestOptions);

		return response as IDataObject | IDataObject[];
	},
};

export default GetAllAppsOperate;

