import { IDataObject, IExecuteFunctions, IHttpRequestOptions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';
import { commonOptions, ICommonOptionsValue } from '../../../help/utils/sharedOptions';

const GetRolesOperate: ResourceOperations = {
	name: '获取角色列表',
	value: 'getRoles',
	action: '获取角色列表',
	order: 20,
	options: [commonOptions],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
		const options = this.getNodeParameter('options', index, {}) as ICommonOptionsValue;

		const requestOptions: IHttpRequestOptions = {
			method: 'GET',
			url: '/role',
		};

		if (options.timeout) {
			requestOptions.timeout = options.timeout;
		}

		const response = await RequestUtils.request.call(this, requestOptions);

		return response as IDataObject | IDataObject[];
	},
};

export default GetRolesOperate;

