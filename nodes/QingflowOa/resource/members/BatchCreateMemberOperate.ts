import { IDataObject, IExecuteFunctions, jsonParse  } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';


const defaultBodyJson = JSON.stringify(
	{
		members: [
			{
				userId: '',
				name: '',
				email: '',
				areaCode: '86',
				mobileNum: '',
				headImg: '',
				department: [],
				role: [],
				customRole: [],
				customDepartment: [],
				beingDisabled: false,
				superiorId: '',
			},
		],
	},
	null,
	2,
);

const BatchCreateMemberOperate: ResourceOperations = {
	name: '批量创建成员',
	value: 'batchCreateMember',
	action: '批量创建成员',
	options: [
		{
			displayName: 'Body',
			name: 'body',
			type: 'json',
			default: defaultBodyJson,
			required: true,
			description:
				'请求体 JSON 格式。必须包含 members 数组，数组中每个对象代表一个成员。每个成员的必填参数：userId (string), name (string), email (string)。可选参数：areaCode (string, 默认86), mobileNum (string), headImg (string), department (array), role (array), customRole (array), customDepartment (array), beingDisabled (boolean), superiorId (string)',
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

		// 验证 members 数组
		if (!body.members) {
			throw new Error('请求体必须包含 members 数组');
		}

		if (!Array.isArray(body.members)) {
			throw new Error('members 必须是数组类型');
		}

		if (body.members.length === 0) {
			throw new Error('members 数组不能为空');
		}

		// 验证每个成员的必填参数
		for (let i = 0; i < body.members.length; i++) {
			const member = body.members[i] as IDataObject;
			if (!member.userId) {
				throw new Error(`members[${i}].userId 不能为空`);
			}
			if (!member.name) {
				throw new Error(`members[${i}].name 不能为空`);
			}
			if (!member.email) {
				throw new Error(`members[${i}].email 不能为空`);
			}
		}

		const response = await RequestUtils.request.call(this, {
			method: 'POST',
			url: '/user/batch',
			body,
		});

		return response as IDataObject;
	},
};

export default BatchCreateMemberOperate;

