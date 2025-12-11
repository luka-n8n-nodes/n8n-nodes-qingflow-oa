import { IDataObject, IExecuteFunctions, jsonParse  } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';


const defaultBodyJson = JSON.stringify(
	{
		role: null,
		pass: '',
		auditNodeId: null,
		searchKey: ''
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
			displayName: 'Body',
			name: 'body',
			type: 'json',
			default: defaultBodyJson,
			required: true,
			description: '参考：https://exiao.yuque.com/ixwxsb/bgzs0e/ef76oafn6havixik',
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

		const response = await RequestUtils.request.call(this, {
			method: 'POST',
			url: '/data/queRel',
			body,
		});

		return response as IDataObject | IDataObject[];
	},
};

export default GetDataRelatedContentOperate;

