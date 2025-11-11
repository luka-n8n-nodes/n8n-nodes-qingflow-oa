import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';
import { jsonParse } from 'n8n-workflow';

const defaultBodyJson = JSON.stringify(
	{
		subManagerIds: [],
	},
	null,
	2,
);

const DeleteSubManagerOperate: ResourceOperations = {
	name: '删除子管理员',
	value: 'deleteSubManager',
	action: '删除子管理员',
	options: [
		{
			displayName: 'Body',
			name: 'body',
			type: 'json',
			default: defaultBodyJson,
			required: true,
			description: '请求体 JSON 格式。必填参数：subManagerIds (array) - subManagerIds列表',
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
		if (!body.subManagerIds || !Array.isArray(body.subManagerIds) || body.subManagerIds.length === 0) {
			throw new Error('subManagerIds 必须是非空数组');
		}

		const response = await RequestUtils.request.call(this, {
			method: 'DELETE',
			url: '/manager/sub',
			body,
		});

		return response as IDataObject;
	},
};

export default DeleteSubManagerOperate;

