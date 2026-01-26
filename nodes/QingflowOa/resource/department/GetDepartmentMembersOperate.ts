import { IDataObject, IExecuteFunctions, IHttpRequestOptions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';
import { commonOptions, ICommonOptionsValue } from '../../../help/utils/sharedOptions';

const GetDepartmentMembersOperate: ResourceOperations = {
	name: '获取部门成员列表',
	value: 'getDepartmentMembers',
	action: '获取部门成员列表',
	order: 22,
	options: [
		{
			displayName: 'Dept ID',
			name: 'deptId',
			type: 'string',
			required: true,
			default: '',
			description: '部门ID',
		},
		{
			displayName: 'Include Child',
			name: 'includeChild',
			type: 'boolean',
			default: false,
			description: 'Whether to include members from child departments',
		},
		commonOptions,
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
		const deptId = this.getNodeParameter('deptId', index) as string;
		const includeChild = this.getNodeParameter('includeChild', index, false) as boolean;
		const options = this.getNodeParameter('options', index, {}) as ICommonOptionsValue;

		if (!deptId) {
			throw new Error('Dept ID 不能为空');
		}

		const deptIdNum = parseInt(deptId, 10);
		if (isNaN(deptIdNum) || deptIdNum <= 0) {
			throw new Error('Dept ID 必须是大于0的数字');
		}

		const requestOptions: IHttpRequestOptions = {
			method: 'GET',
			url: `/department/${deptIdNum}/user`,
		};

		if (includeChild !== undefined) {
			requestOptions.qs = {
				includeChild,
			};
		}

		if (options.timeout) {
			requestOptions.timeout = options.timeout;
		}

		const response = await RequestUtils.request.call(this, requestOptions);

		return response as IDataObject | IDataObject[];
	},
};

export default GetDepartmentMembersOperate;

