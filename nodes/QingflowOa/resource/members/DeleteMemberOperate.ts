import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const DeleteMemberOperate: ResourceOperations = {
	name: '删除成员',
	value: 'deleteMember',
	action: '删除成员',
	options: [
		{
			displayName: 'User ID',
			name: 'userId',
			type: 'string',
			required: true,
			default: '',
			description: '要删除的用户的userId',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
		const userId = this.getNodeParameter('userId', index) as string;

		if (!userId) {
			throw new Error('User ID 不能为空');
		}

		const response = await RequestUtils.request.call(this, {
			method: 'DELETE',
			url: `/user/${userId}`,
		});

		return response as IDataObject;
	},
};

export default DeleteMemberOperate;

