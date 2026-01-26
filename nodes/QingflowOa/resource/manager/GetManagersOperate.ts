import { IDataObject, IExecuteFunctions, IHttpRequestOptions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';
import { commonOptions, ICommonOptionsValue } from '../../../help/utils/sharedOptions';

const GetManagersOperate: ResourceOperations = {
	name: '获取管理员列表',
	value: 'getManagers',
	action: '获取管理员列表',
	order: 20,
	options: [commonOptions],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
		const options = this.getNodeParameter('options', index, {}) as ICommonOptionsValue;

		const requestOptions: IHttpRequestOptions = {
			method: 'GET',
			url: '/manager/super',
		};

		if (options.timeout) {
			requestOptions.timeout = options.timeout;
		}

		const response = await RequestUtils.request.call(this, requestOptions);

		return response as IDataObject | IDataObject[];
	},
};

export default GetManagersOperate;

