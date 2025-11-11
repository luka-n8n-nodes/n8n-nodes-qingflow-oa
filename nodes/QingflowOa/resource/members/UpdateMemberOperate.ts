import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';
import { jsonParse } from 'n8n-workflow';

const defaultBodyJson = JSON.stringify(
	{
		userId: '',
		name: '',
		email: '',
		areaCode: '',
		mobileNum: '',
		headImg: '',
		department: [],
		role: [],
		customRole: [],
		customDepartment: [],
		beingDisabled: false,
		superiorId: '',
	},
	null,
	2,
);

const UpdateMemberOperate: ResourceOperations = {
	name: '更新成员',
	value: 'updateMember',
	action: '更新成员',
	options: [
		{
			displayName: 'User ID',
			name: 'userId',
			type: 'string',
			required: true,
			default: '',
			description: '要更新的用户的userId',
		},
		{
			displayName: 'Body',
			name: 'body',
			type: 'json',
			default: defaultBodyJson,
			required: true,
			description:
				'请求体 JSON 格式。必填参数：userId (string), email (string)。可选参数：name (string), areaCode (string, 传手机号时必填), mobileNum (string), headImg (string), department (array), role (array), customRole (array), customDepartment (array), beingDisabled (boolean), superiorId (string, 不传不会更新，传空值会清空)',
			typeOptions: {
				alwaysOpenEditWindow: true,
			},
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
		const userId = this.getNodeParameter('userId', index) as string;
		const bodyJson = this.getNodeParameter('body', index) as string;

		if (!userId) {
			throw new Error('User ID 不能为空');
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
		if (!body.userId) {
			throw new Error('请求体中的 userId 不能为空');
		}
		if (!body.email) {
			throw new Error('请求体中的 email 不能为空');
		}

		// 验证：如果传了手机号，必须传区号
		if (body.mobileNum && !body.areaCode) {
			throw new Error('传手机号时，areaCode 必填');
		}

		const response = await RequestUtils.request.call(this, {
			method: 'POST',
			url: `/user/${userId}`,
			body,
		});

		return response as IDataObject;
	},
};

export default UpdateMemberOperate;

