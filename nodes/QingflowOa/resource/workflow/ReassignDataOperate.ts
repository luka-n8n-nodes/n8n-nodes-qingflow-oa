import { IDataObject, IExecuteFunctions, jsonParse  } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';


const defaultBodyJson = JSON.stringify(
	{
		reassignmentInfo: [
			{
				auditNodeId: null,
				userIdList: [],
			},
		],
		auditNodeId: null,
		userIdList: [],
	},
	null,
	2,
);

const ReassignDataOperate: ResourceOperations = {
	name: '单条数据重新指派',
	value: 'reassignData',
	action: '单条数据重新指派',
	options: [
		{
			displayName: 'Apply ID',
			name: 'applyId',
			type: 'string',
			required: true,
			default: '',
			description: '数据 ID 对应字段变成数据 ID',
		},
		{
			displayName: 'Body',
			name: 'body',
			type: 'json',
			default: defaultBodyJson,
			required: true,
			description:
				'请求体 JSON 格式。必填参数：reassignmentInfo (array), auditNodeId (int), userIdList (array)',
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
		if (!body.reassignmentInfo || !Array.isArray(body.reassignmentInfo)) {
			throw new Error('reassignmentInfo 必须是非空数组');
		}

		const response = await RequestUtils.request.call(this, {
			method: 'POST',
			url: `/apply/${applyId}/reassign`,
			body,
		});

		return response as IDataObject;
	},
};

export default ReassignDataOperate;

