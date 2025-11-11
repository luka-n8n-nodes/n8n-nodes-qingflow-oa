import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';
import { jsonParse } from 'n8n-workflow';

const defaultBodyJson = JSON.stringify(
	{
		count: '',
		workFlow: '',
		workType: '',
		values: [],
		referrals: '',
	},
	null,
	2,
);

const GetApplicationDataOperate: ResourceOperations = {
	name: '获取应用数据',
	value: 'getApplicationData',
	action: '获取应用数据',
	options: [
		{
			displayName: 'Apply ID',
			name: 'applyId',
			type: 'string',
			required: true,
			default: '',
			description: '应用ID，可通过获取应用列表获取，获得完整项目',
		},
		{
			displayName: 'Body',
			name: 'body',
			type: 'json',
			default: defaultBodyJson,
			required: true,
			description:
				'请求体 JSON 格式。必填参数：count (string), workFlow (string), workType (string), values (array), referrals (string)',
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
			url: `/apply/${applyId}`,
			body,
		});

		return response as IDataObject | IDataObject[];
	},
};

export default GetApplicationDataOperate;

