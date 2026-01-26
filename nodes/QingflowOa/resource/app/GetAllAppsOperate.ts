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
			description: '成员外部ID，可查询指定成员的可见应用。如果为空则使用凭证中配置的userId；若凭证中也未配置，则返回工作区全部应用。',
		},
		{
			displayName: 'Favourite',
			name: 'favourite',
			type: 'options',
			options: [
				{
					name: '获取当前用户所有的可见应用',
					value: 0,
				},
				{
					name: '获取当前用户可见中收藏的应用',
					value: 1,
				},
			],
			default: 0,
			description: 'UserId不传时无效。1-获取当前用户可见中收藏的应用，0-获取当前用户所有的可见应用（默认值）',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
		let userId = this.getNodeParameter('userId', index, '') as string;
		const favourite = this.getNodeParameter('favourite', index) as number | undefined;

		// 如果userId为空，则使用凭证中的userId
		if (!userId) {
			const credentials = await this.getCredentials('qingflowOaApi');
			userId = (credentials.userId as string) || '';
		}

		const requestOptions: IHttpRequestOptions = {
			method: 'GET',
			url: '/app',
		};

		const qs: IDataObject = {};
		if (userId) {
			qs.userId = userId;
			// favourite 只有在 userId 有值时才有效
			if (favourite !== undefined && favourite !== null) {
				qs.favourite = favourite;
			}
		}

		if (Object.keys(qs).length > 0) {
			requestOptions.qs = qs;
		}

		const response = await RequestUtils.request.call(this, requestOptions);

		return response as IDataObject | IDataObject[];
	},
};

export default GetAllAppsOperate;

