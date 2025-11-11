import { IDataObject, IExecuteFunctions, IHttpRequestOptions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const GetAppFormOperate: ResourceOperations = {
	name: '获取指定应用表单信息',
	value: 'getAppForm',
	action: '获取指定应用表单信息',
	options: [
		{
			displayName: 'App Key',
			name: 'appKey',
			type: 'string',
			required: true,
			default: '',
			description: '应用标识，数组为安全主数据标识为主——appKey',
		},
		{
			displayName: 'User ID',
			name: 'userId',
			type: 'string',
			required: false,
			default: '',
			description:
				'userId为给定，数据工作区总资格化持续工作权限配置，当前立个数据赋权书',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
		const appKey = this.getNodeParameter('appKey', index) as string;
		const userId = this.getNodeParameter('userId', index) as string | undefined;

		if (!appKey) {
			throw new Error('App Key 不能为空');
		}

		const requestOptions: IHttpRequestOptions = {
			method: 'GET',
			url: `/app/${appKey}/form`,
		};

		if (userId) {
			requestOptions.qs = {
				userId,
			};
		}

		const response = await RequestUtils.request.call(this, requestOptions);

		return response as IDataObject | IDataObject[];
	},
};

export default GetAppFormOperate;

