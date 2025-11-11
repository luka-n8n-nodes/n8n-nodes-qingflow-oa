import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';
import { jsonParse } from 'n8n-workflow';

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

const UpdateDepartmentOperate: ResourceOperations = {
	name: '更新部门',
	value: 'updateDepartment',
	action: '更新部门',
	options: [
		{
			displayName: 'Dept ID',
			name: 'deptId',
			type: 'string',
			required: true,
			default: '',
			description: '部门ID，可通过获取部门列表获取',
		},
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
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
		const deptId = this.getNodeParameter('deptId', index) as string;
		const bodyJson = this.getNodeParameter('body', index) as string;

		if (!deptId) {
			throw new Error('Dept ID 不能为空');
		}

		const deptIdNum = parseInt(deptId, 10);
		if (isNaN(deptIdNum) || deptIdNum <= 0) {
			throw new Error('Dept ID 必须是大于0的数字');
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
		if (!body.deptId || body.deptId === 0) {
			throw new Error('请求体中的 deptId 不能为空且必须大于0');
		}
		if (!body.name) {
			throw new Error('请求体中的 name 不能为空');
		}

		const response = await RequestUtils.request.call(this, {
			method: 'POST',
			url: `/department/${deptIdNum}`,
			body,
		});

		return response as IDataObject;
	},
};

export default UpdateDepartmentOperate;

