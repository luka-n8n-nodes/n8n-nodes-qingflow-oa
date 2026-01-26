import { IDataObject, IExecuteFunctions, IHttpRequestOptions, jsonParse } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';
import { commonOptions, ICommonOptionsValue } from '../../../help/utils/sharedOptions';

const defaultBodyJson = JSON.stringify(
	{
		deptId: null,
		name: '',
		parentId: null,
		deptLeader: [],
		ordinal: null,
	},
	null,
	2,
);

const CreateDepartmentOperate: ResourceOperations = {
	name: '创建部门',
	value: 'createDepartment',
	action: '创建部门',
	order: 10,
	options: [
		{
			displayName: 'Body',
			name: 'body',
			type: 'json',
			default: defaultBodyJson,
			required: true,
			description:
				'请求体 JSON 格式。必填参数：deptId (int), name (string)。可选参数：parentId (int), deptLeader (array), ordinal (int, 0-2^30)',
			typeOptions: {
				alwaysOpenEditWindow: true,
			},
		},
		commonOptions,
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
		const bodyJson = this.getNodeParameter('body', index) as string;
		const options = this.getNodeParameter('options', index, {}) as ICommonOptionsValue;

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
		if (!body.deptId || body.deptId === 0) {
			throw new Error('deptId 不能为空且必须大于0');
		}
		if (!body.name) {
			throw new Error('name 不能为空');
		}

		const requestOptions: IHttpRequestOptions = {
			method: 'POST',
			url: '/department',
			body,
		};

		if (options.timeout) {
			requestOptions.timeout = options.timeout;
		}

		const response = await RequestUtils.request.call(this, requestOptions);

		return response as IDataObject;
	},
};

export default CreateDepartmentOperate;

