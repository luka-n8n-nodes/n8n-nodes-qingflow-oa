import { IDataObject, IExecuteFunctions, IHttpRequestOptions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';
import { commonOptions, ICommonOptionsValue } from '../../../help/utils/sharedOptions';

const DeleteMemberOperate: ResourceOperations = {
	name: '删除成员',
	value: 'deleteMember',
	action: '删除成员',
	order: 50,
	options: [
		{
			displayName: 'User ID',
			name: 'userId',
			type: 'string',
			required: true,
			default: '',
			description: '要删除的用户的userId',
		},
		commonOptions,
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
		const userId = this.getNodeParameter('userId', index) as string;
		const options = this.getNodeParameter('options', index, {}) as ICommonOptionsValue;

		if (!userId) {
			throw new Error('User ID 不能为空');
		}

		const requestOptions: IHttpRequestOptions = {
			method: 'DELETE',
			url: `/user/${userId}`,
		};

		if (options.timeout) {
			requestOptions.timeout = options.timeout;
		}

		const response = await RequestUtils.request.call(this, requestOptions);

		return response as IDataObject;
	},
};

export default DeleteMemberOperate;

