import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';
import { jsonParse } from 'n8n-workflow';

const defaultBodyJson = JSON.stringify(
	{
		applyNum: null,
		type: null,
		users: [],
		jobGuard: null,
		submited: false,
		queryEngineStatusType: null,
		queryProps: [],
		auths: [],
		submittedDay: '',
		guaranteeKey: '',
		motivate: '',
		coordinator: '',
		maxValue: '',
		scope: null,
		searchOperations: [],
		guard: null,
	},
	null,
	2,
);

const DeleteApplicationDataOperate: ResourceOperations = {
	name: '删除应用数据',
	value: 'deleteApplicationData',
	action: '删除应用数据',
	options: [
		{
			displayName: 'Apply ID',
			name: 'applyId',
			type: 'string',
			required: true,
			default: '',
			description: '应用ID，可通过获取应用列表获取',
		},
		{
			displayName: 'Body',
			name: 'body',
			type: 'json',
			default: defaultBodyJson,
			required: true,
			description:
				'请求体 JSON 格式。必填参数：applyNum (int), type (int), users (array), jobGuard (int), submited (boolean), queryEngineStatusType (int), queryProps (array), auths (array), submittedDay (string), guaranteeKey (string), motivate (string), coordinator (string), maxValue (string), scope (int), searchOperations (array), guard (int)',
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
			method: 'DELETE',
			url: `/apply/${applyId}`,
			body,
		});

		return response as IDataObject;
	},
};

export default DeleteApplicationDataOperate;

