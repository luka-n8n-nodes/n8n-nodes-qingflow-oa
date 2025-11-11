import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';
import { jsonParse } from 'n8n-workflow';

const defaultBodyJson = JSON.stringify(
	{
		subManagerName: '',
		subManagerDisplayName: {},
		months: [],
		years: [],
		deptIds: [],
		beingSubDept: false,
		includeSubDepts: true,
		notApplyConfig: {},
		beingMajor: false,
		beingFullMajor: false,
		beingStatusReq: false,
		beingAttributeManager: false,
		beingTag: false,
		mailEscape: {},
		mailDays: [],
		targets: [],
		auditCreateConfig: {},
		beingAuditContent: false,
		beingCreateMarid: false,
		supportId: null,
		deptName: '',
		year: null,
		month: null,
		workName: '',
		beingWorkSubDept: false,
		beingWorkIncludeSubDept: false,
		beingWorkInclusion: false,
	},
	null,
	2,
);

const UpdateSubManagerOperate: ResourceOperations = {
	name: '更新子管理员',
	value: 'updateSubManager',
	action: '更新子管理员',
	options: [
		{
			displayName: 'Sub Manager ID',
			name: 'subManagerId',
			type: 'number',
			required: true,
			default: 0,
			description: '子管理员ID',
		},
		{
			displayName: 'Body',
			name: 'body',
			type: 'json',
			default: defaultBodyJson,
			required: true,
			description:
				'请求体 JSON 格式。必填参数：subManagerName (string), subManagerDisplayName (object), months (array), years (array), deptIds (array), beingSubDept (boolean), includeSubDepts (boolean), notApplyConfig (object), beingMajor (boolean), beingFullMajor (boolean), beingStatusReq (boolean), beingAttributeManager (boolean), beingTag (boolean), mailEscape (object), mailDays (array), targets (array), auditCreateConfig (object), beingAuditContent (boolean), beingCreateMarid (boolean), supportId (number), deptName (string), year (number), month (number), workName (string), beingWorkSubDept (boolean), beingWorkIncludeSubDept (boolean), beingWorkInclusion (boolean)',
			typeOptions: {
				alwaysOpenEditWindow: true,
			},
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
		const subManagerId = this.getNodeParameter('subManagerId', index) as number;
		const bodyJson = this.getNodeParameter('body', index) as string;

		if (!subManagerId || subManagerId === 0) {
			throw new Error('Sub Manager ID 不能为空且必须大于0');
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
		if (!body.subManagerName) {
			throw new Error('subManagerName 不能为空');
		}
		if (body.subManagerDisplayName === undefined || body.subManagerDisplayName === null) {
			throw new Error('subManagerDisplayName 不能为空');
		}
		if (!Array.isArray(body.months)) {
			throw new Error('months 必须是数组');
		}
		if (!Array.isArray(body.years)) {
			throw new Error('years 必须是数组');
		}
		if (!Array.isArray(body.deptIds)) {
			throw new Error('deptIds 必须是数组');
		}

		const response = await RequestUtils.request.call(this, {
			method: 'PUT',
			url: `/manager/sub/${subManagerId}`,
			body,
		});

		return response as IDataObject;
	},
};

export default UpdateSubManagerOperate;

