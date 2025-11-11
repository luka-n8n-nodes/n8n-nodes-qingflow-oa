import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const GetUserDetailOperate: ResourceOperations = {
	name: '获取用户详情',
	value: 'getUserDetail',
	action: '获取用户详情',
	options: [
		{
			displayName: '用户ID',
			name: 'userId',
			type: 'string',
			required: true,
			default: '',
			description: '要查询的用户ID',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const userId = this.getNodeParameter('userId', index) as string;

		return RequestUtils.request.call(this, {
			method: 'GET',
			url: `/user/${userId}`,
		});
	},
};

export default GetUserDetailOperate;

