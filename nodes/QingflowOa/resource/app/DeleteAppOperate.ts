import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const DeleteAppOperate: ResourceOperations = {
	name: '删除应用',
	value: 'deleteApp',
	action: '删除应用',
	options: [
		{
			displayName: 'App Key',
			name: 'appKey',
			type: 'string',
			required: true,
			default: '',
			description: '应用标识，数组为安全主数据标识为主——appKey',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
		const appKey = this.getNodeParameter('appKey', index) as string;

		if (!appKey) {
			throw new Error('App Key 不能为空');
		}

		const response = await RequestUtils.request.call(this, {
			method: 'DELETE',
			url: `/app/${appKey}`,
		});

		return response as IDataObject;
	},
};

export default DeleteAppOperate;

