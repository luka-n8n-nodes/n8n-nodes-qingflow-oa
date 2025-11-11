import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';
import { jsonParse } from 'n8n-workflow';

const defaultBodyJson = JSON.stringify(
	{
		auditResult: null,
		auditNodeId: null,
		auditFeedback: '',
	},
	null,
	2,
);

const ProcessDataOperate: ResourceOperations = {
	name: '处理某条数据',
	value: 'processData',
	action: '处理某条数据',
	options: [
		{
			displayName: 'Apply ID',
			name: 'applyId',
			type: 'string',
			required: true,
			default: '',
			description: '数据ID，可通过获取数据列表获取',
		},
		{
			displayName: 'Body',
			name: 'body',
			type: 'json',
			default: defaultBodyJson,
			required: true,
			description:
				'请求体 JSON 格式。必填参数：auditResult (string), auditNodeId (number)。可选参数：auditFeedback (string)。auditResult 可传值：null(提交处理), no(驳回), yes(通过), end(结束)',
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
		if (body.auditResult === undefined) {
			throw new Error('auditResult 不能为空（可以为 null 表示提交处理）');
		}
		if (body.auditNodeId === undefined || body.auditNodeId === null) {
			throw new Error('auditNodeId 不能为空');
		}

		const response = await RequestUtils.request.call(this, {
			method: 'POST',
			url: `/apply/${applyId}/audit`,
			body,
		});

		return response as IDataObject;
	},
};

export default ProcessDataOperate;

