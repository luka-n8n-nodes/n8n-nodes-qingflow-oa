import { IDataObject, IExecuteFunctions, jsonParse  } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';


const defaultBodyJson = JSON.stringify(
	{
		auditNodeId: null,
		keepAuditRecords: null,
		auditFeedback: '',
	},
	null,
	2,
);

const RollbackDataOperate: ResourceOperations = {
	name: '单条数据流程回退',
	value: 'rollbackData',
	action: '单条数据流程回退',
	options: [
		{
			displayName: 'Apply ID',
			name: 'applyId',
			type: 'string',
			required: true,
			default: '',
			description: '数据ID，可从数据管理中接获取',
		},
		{
			displayName: 'Body',
			name: 'body',
			type: 'json',
			default: defaultBodyJson,
			required: true,
			description:
				'请求体 JSON 格式。必填参数：auditNodeId (int), keepAuditRecords (int), auditFeedback (string)',
			typeOptions: {
				alwaysOpenEditWindow: true,
			},
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
		const applyId = this.getNodeParameter('applyId', index) as string;
		const bodyJson = this.getNodeParameter('body', index) as string;

		if (!applyId) {
			throw new Error('Apply ID 不能为空');
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

		// 验证必填参数
		if (!body.auditNodeId || body.auditNodeId === null) {
			throw new Error('auditNodeId 不能为空');
		}
		if (!body.keepAuditRecords || body.keepAuditRecords === null) {
			throw new Error('keepAuditRecords 不能为空');
		}
		if (!body.auditFeedback) {
			throw new Error('auditFeedback 不能为空');
		}

		const response = await RequestUtils.request.call(this, {
			method: 'POST',
			url: `/apply/${applyId}/auditCallBack`,
			body,
		});

		return response as IDataObject;
	},
};

export default RollbackDataOperate;

