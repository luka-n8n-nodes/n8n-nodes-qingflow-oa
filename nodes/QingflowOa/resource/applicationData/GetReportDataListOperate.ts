import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';
import { jsonParse } from 'n8n-workflow';

const defaultBodyJson = JSON.stringify(
	{
		pageSize: null,
		pageNum: null,
	},
	null,
	2,
);

const GetReportDataListOperate: ResourceOperations = {
	name: '获取报表数据表列表数据',
	value: 'getReportDataList',
	action: '获取报表数据表列表数据',
	options: [
		{
			displayName: 'Report ID',
			name: 'reportId',
			type: 'string',
			required: true,
			default: '',
			description: '报表ID',
		},
		{
			displayName: 'Chart Key',
			name: 'chartKey',
			type: 'string',
			required: true,
			default: '',
			description: '报表数据库，可通过数据库配置，获得多级投影配置',
		},
		{
			displayName: 'Body',
			name: 'body',
			type: 'json',
			default: defaultBodyJson,
			required: true,
			description: '请求体 JSON 格式。必填参数：pageSize (int), pageNum (int)',
			typeOptions: {
				alwaysOpenEditWindow: true,
			},
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
		const reportId = this.getNodeParameter('reportId', index) as string;
		const chartKey = this.getNodeParameter('chartKey', index) as string;
		const bodyJson = this.getNodeParameter('body', index) as string;

		if (!reportId) {
			throw new Error('Report ID 不能为空');
		}

		if (!chartKey) {
			throw new Error('Chart Key 不能为空');
		}

		if (!bodyJson) {
			throw new Error('请求体不能为空');
		}

		let body: IDataObject;
		try {
			body = jsonParse(bodyJson);
		} catch (error) {
			throw new Error('请求体 JSON 格式无效: ' + error.message);
		}

		const response = await RequestUtils.request.call(this, {
			method: 'POST',
			url: `/report/data/${reportId}/filter`,
			qs: {
				chartKey,
			},
			body,
		});

		return response as IDataObject | IDataObject[];
	},
};

export default GetReportDataListOperate;

