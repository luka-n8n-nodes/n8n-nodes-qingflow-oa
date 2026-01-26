import { IDataObject, IExecuteFunctions, IHttpRequestOptions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';
import { commonOptions, ICommonOptionsValue } from '../../../help/utils/sharedOptions';

const GetUnDepartmentMembersOperate: ResourceOperations = {
	name: '获取不在部门的成员',
	value: 'getUnDepartmentMembers',
	action: '获取不在部门的成员',
	order: 24,
	options: [commonOptions],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
		const options = this.getNodeParameter('options', index, {}) as ICommonOptionsValue;

		const requestOptions: IHttpRequestOptions = {
			method: 'GET',
			url: '/unDepartment',
		};

		if (options.timeout) {
			requestOptions.timeout = options.timeout;
		}

		const response = await RequestUtils.request.call(this, requestOptions);

		return response as IDataObject | IDataObject[];
	},
};

export default GetUnDepartmentMembersOperate;

