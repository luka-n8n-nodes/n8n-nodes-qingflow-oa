import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const GetAuditRecordOperate: ResourceOperations = {
	name: '获取某条流程日志的详细信息',
	value: 'getAuditRecord',
	action: '获取某条流程日志的详细信息',
	options: [
		{
			displayName: 'Apply ID',
			name: 'applyId',
			type: 'string',
			required: true,
			default: '',
			description: '数据ID，可获取数据指定中间写ID，无需话回应对应同的ID',
		},
		{
			displayName: 'Audit Rec ID',
			name: 'auditRecId',
			type: 'string',
			required: true,
			default: '',
			description: '日志纪录ID，可通过施工日志【获取者的销数据操作日志】可带储蓄日志化',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
		const applyId = this.getNodeParameter('applyId', index) as string;
		const auditRecId = this.getNodeParameter('auditRecId', index) as string;

		if (!applyId) {
			throw new Error('Apply ID 不能为空');
		}

		if (!auditRecId) {
			throw new Error('Audit Rec ID 不能为空');
		}

		const response = await RequestUtils.request.call(this, {
			method: 'GET',
			url: `/apply/${applyId}/auditRecord/${auditRecId}`,
		});

		return response as IDataObject;
	},
};

export default GetAuditRecordOperate;

