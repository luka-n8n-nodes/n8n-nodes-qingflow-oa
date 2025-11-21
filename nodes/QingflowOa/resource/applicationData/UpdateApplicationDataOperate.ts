import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';
import { jsonParse } from 'n8n-workflow';

const defaultBodyJson = JSON.stringify(
	{
		answers: [],
	},
	null,
	2,
);

const UpdateApplicationDataOperate: ResourceOperations = {
	name: '更新单条数据的信息',
	value: 'updateApplicationData',
	action: '更新单条数据的信息',
	options: [
		{
			displayName: 'Apply ID',
			name: 'applyId',
			type: 'string',
			required: true,
			default: '',
			description: '数据的ID，可在轻流的URL中获取，或通过调用文档接口获取',
		},
		{
			displayName: 'Body',
			name: 'body',
			type: 'json',
			default: defaultBodyJson,
			required: true,
			description: '参考：https://exiao.yuque.com/ixwxsb/bgzs0e/cv986qy3875cvxaf',
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
		if (!body.answers || !Array.isArray(body.answers) || body.answers.length === 0) {
			throw new Error('answers 必须是非空数组');
		}
		// 验证 answers 中的必填字段
		for (const answer of body.answers as any[]) {
			if (answer.queId === undefined || answer.queId === null) {
				throw new Error('answers 中的 queId 不能为空');
			}
			if (answer.queType === undefined || answer.queType === null) {
				throw new Error('answers 中的 queType 不能为空');
			}
			if (!answer.values || !Array.isArray(answer.values)) {
				throw new Error('answers 中的 values 必须是数组（表格字段以外的字段类型必填）');
			}
		}

		const response = await RequestUtils.request.call(this, {
			method: 'POST',
			url: `/apply/${applyId}`,
			body,
		});

		return response as IDataObject;
	},
};

export default UpdateApplicationDataOperate;

