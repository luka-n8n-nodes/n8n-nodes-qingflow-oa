import { IDataObject, IExecuteFunctions, IHttpRequestOptions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const UrgeDataOperate: ResourceOperations = {
	name: '催办某条数据',
	value: 'urgeData',
	action: '催办某条数据',
	options: [
		{
			displayName: 'Apply ID',
			name: 'applyId',
			type: 'string',
			required: true,
			default: '',
			description:
				'数据ID，可获取数据指定应用条件信息，数据可获得数据流程当前待处理的步骤，可定期数据更新处理',
		},
		{
			displayName: 'User ID',
			name: 'userId',
			type: 'string',
			required: false,
			default: '',
			description: '需要收入工具表单内容数据的ApplyId，在数据方式基于，基本专业级内司',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
		const applyId = this.getNodeParameter('applyId', index) as string;
		const userId = this.getNodeParameter('userId', index) as string | undefined;

		if (!applyId) {
			throw new Error('Apply ID 不能为空');
		}

		const requestOptions: IHttpRequestOptions = {
			method: 'POST',
			url: `/apply/${applyId}/urge`,
		};

		if (userId) {
			requestOptions.qs = {
				userId,
			};
		}

		const response = await RequestUtils.request.call(this, requestOptions);

		return response as IDataObject;
	},
};

export default UrgeDataOperate;

