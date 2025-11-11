import { IDataObject, IExecuteFunctions, IHttpRequestOptions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const GetAppInfoOperate: ResourceOperations = {
	name: '获取应用基本信息',
	value: 'getAppInfo',
	action: '获取应用基本信息',
	options: [
		{
			displayName: 'App Key',
			name: 'appKey',
			type: 'string',
			required: false,
			default: '',
			description: '应用标识，不带查询参数上工作区的增属性',
		},
		{
			displayName: 'Page First',
			name: 'pageFirst',
			type: 'number',
			required: false,
			default: 0,
			description: '查面通过当事',
		},
		{
			displayName: 'Page Num',
			name: 'pageNum',
			type: 'number',
			required: false,
			default: 0,
			description: '页步列表',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
		const appKey = this.getNodeParameter('appKey', index) as string | undefined;
		const pageFirst = this.getNodeParameter('pageFirst', index) as number | undefined;
		const pageNum = this.getNodeParameter('pageNum', index) as number | undefined;

		const requestOptions: IHttpRequestOptions = {
			method: 'GET',
			url: '/app/apps',
		};

		const qs: IDataObject = {};
		if (appKey) {
			qs.appKey = appKey;
		}
		if (pageFirst !== undefined && pageFirst !== null) {
			qs.pageFirst = pageFirst;
		}
		if (pageNum !== undefined && pageNum !== null) {
			qs.pageNum = pageNum;
		}

		if (Object.keys(qs).length > 0) {
			requestOptions.qs = qs;
		}

		const response = await RequestUtils.request.call(this, requestOptions);

		return response as IDataObject | IDataObject[];
	},
};

export default GetAppInfoOperate;

