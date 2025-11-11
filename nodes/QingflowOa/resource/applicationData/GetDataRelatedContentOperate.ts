import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';
import { jsonParse } from 'n8n-workflow';

const defaultBodyJson = JSON.stringify(
	{
		rule: null,
		path: '',
		searchHandle: null,
		searchKey: '',
		keyGuard: null,
		keyOperated: [],
		ordinal: null,
		values: [],
		queryConditions: [],
		guard: null,
	},
	null,
	2,
);

const GetDataRelatedContentOperate: ResourceOperations = {
	name: '获取数据关联的内容',
	value: 'getDataRelatedContent',
	action: '获取数据关联的内容',
	options: [
		{
			displayName: 'Apply ID',
			name: 'applyId',
			type: 'string',
			required: true,
			default: '',
			description: '应用ID',
		},
		{
			displayName: 'Body',
			name: 'body',
			type: 'json',
			default: defaultBodyJson,
			required: true,
			description:
				'请求体 JSON 格式。必填参数：rule (int), path (string), searchHandle (int), searchKey (string), keyGuard (int), keyOperated (array), ordinal (int), values (array), queryConditions (array), guard (int)',
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

		const response = await RequestUtils.request.call(this, {
			method: 'POST',
			url: `/data/${applyId}`,
			body,
		});

		return response as IDataObject | IDataObject[];
	},
};

export default GetDataRelatedContentOperate;

