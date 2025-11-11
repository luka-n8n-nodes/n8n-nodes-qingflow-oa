import { IDataObject, IExecuteFunctions, IHttpRequestOptions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const GetDelegatesOperate: ResourceOperations = {
	name: '获取委托列表',
	value: 'getDelegates',
	action: '获取委托列表',
	options: [
		{
			displayName: 'Page Num',
			name: 'pageNum',
			type: 'number',
			required: false,
			default: 0,
			description: '页码',
		},
		{
			displayName: 'Page First',
			name: 'pageFirst',
			type: 'number',
			required: false,
			default: 0,
			description: '查询数量',
		},
		{
			displayName: 'Type',
			name: 'type',
			type: 'number',
			required: false,
			default: 0,
			description: '委托类型，1委托他人，2被他人委托',
		},
		{
			displayName: 'Status',
			name: 'status',
			type: 'string',
			required: false,
			default: '',
			description: '委托状态',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
		const pageNum = this.getNodeParameter('pageNum', index) as number | undefined;
		const pageFirst = this.getNodeParameter('pageFirst', index) as number | undefined;
		const type = this.getNodeParameter('type', index) as number | undefined;
		const status = this.getNodeParameter('status', index) as string | undefined;

		const requestOptions: IHttpRequestOptions = {
			method: 'GET',
			url: '/delegate',
		};

		const qs: IDataObject = {};
		if (pageNum !== undefined && pageNum !== null) {
			qs.pageNum = pageNum;
		}
		if (pageFirst !== undefined && pageFirst !== null) {
			qs.pageFirst = pageFirst;
		}
		if (type !== undefined && type !== null) {
			qs.type = type;
		}
		if (status) {
			qs.status = status;
		}

		if (Object.keys(qs).length > 0) {
			requestOptions.qs = qs;
		}

		const response = await RequestUtils.request.call(this, requestOptions);

		return response as IDataObject | IDataObject[];
	},
};

export default GetDelegatesOperate;

