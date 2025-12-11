import { IDataObject, IExecuteFunctions, jsonParse  } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';


const defaultBodyJson = JSON.stringify(
	{
		managerUserIds: [],
	},
	null,
	2,
);

const AddManagerOperate: ResourceOperations = {
	name: '增加管理员',
	value: 'addManager',
	action: '增加管理员',
	options: [
		{
			displayName: 'Body',
			name: 'body',
			type: 'json',
			default: defaultBodyJson,
			required: true,
			description: '请求体 JSON 格式。必填参数：managerUserIds (array) - 位置管理员的userIds',
			typeOptions: {
				alwaysOpenEditWindow: true,
			},
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
		const bodyJson = this.getNodeParameter('body', index) as string;

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
		if (!body.managerUserIds || !Array.isArray(body.managerUserIds) || body.managerUserIds.length === 0) {
			throw new Error('managerUserIds 必须是非空数组');
		}

		const response = await RequestUtils.request.call(this, {
			method: 'POST',
			url: '/manager/super',
			body,
		});

		return response as IDataObject;
	},
};

export default AddManagerOperate;

