import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const GetAuditRecordsOperate: ResourceOperations = {
	name: '获取单条数据的流程日志',
	value: 'getAuditRecords',
	action: '获取单条数据的流程日志',
	options: [
		{
			displayName: 'Apply ID',
			name: 'applyId',
			type: 'string',
			required: true,
			default: '',
			description: '数据ID',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
		const applyId = this.getNodeParameter('applyId', index) as string;

		if (!applyId) {
			throw new Error('Apply ID 不能为空');
		}

		const response = await RequestUtils.request.call(this, {
			method: 'GET',
			url: `/apply/${applyId}/auditRecord`,
		});

		return response as IDataObject;
	},
};

export default GetAuditRecordsOperate;

