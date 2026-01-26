import { IDataObject, IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const GetApplicationDataOperate: ResourceOperations = {
	name: '获取应用数据',
	value: 'getApplicationData',
	action: '获取应用数据',
	options: [
		{
			displayName: 'App Key',
			name: 'appKey',
			type: 'string',
			required: true,
			default: '',
			description: '应用的appKey,可在轻流中应用的URL查询,或通过【获取工作区所有应用】接口获取',
		},
		{
			displayName: '数据类型',
			name: 'type',
			type: 'options',
			default: 8,
			description: '获取数据的类型',
			options: [
				{ name: '获取全部数据', value: 8 },
				{ name: '获取个人待办事项', value: 1 },
				{ name: '获取已办事项', value: 2 },
				{ name: '获取我发起的已通过', value: 3 },
				{ name: '获取我发起的待审核', value: 5 },
				{ name: '获取我发起的待完善', value: 6 },
				{ name: '获取我发起的流程中', value: 7 },
				{ name: '获取我发起的已拒绝', value: 10 },
				{ name: '获取抄送事项', value: 12 },
			],
		},
		{
			displayName: 'Return All',
			name: 'returnAll',
			type: 'boolean',
			default: false,
			description: 'Whether to return all results or only up to a given limit',
		},
		{
			displayName: 'Limit',
			name: 'limit',
			type: 'number',
			typeOptions: {
				minValue: 1,
				maxValue: 200,
			},
			default: 50,
			displayOptions: {
				show: {
					returnAll: [false],
				},
			},
			description: 'Max number of results to return',
		},
		{
			displayName: '查询条件逻辑关系',
			name: 'queriesRel',
			type: 'options',
			default: 'and',
			description: '针对字段的查询条件之间逻辑关系，多条件查询时在queries数组中以多个对象形式存在',
			options: [
				{ name: 'AND（且）', value: 'and' },
				{ name: 'OR（或）', value: 'or' },
			],
		},
		{
			displayName: '全局模糊搜索关键字',
			name: 'queryKey',
			type: 'string',
			default: '',
			description: '模糊搜索全部字段数据的key值',
		},
		{
			displayName: '指定申请ID列表',
			name: 'applyIds',
			type: 'string',
			default: '',
			description: '指定申请的applyId，多个用英文逗号分隔，如：1,2,3',
		},
		{
			displayName: '排序配置',
			name: 'sorts',
			type: 'fixedCollection',
			typeOptions: {
				multipleValues: true,
			},
			placeholder: '添加排序条件',
			default: { sortItems: [] },
			description: '排序情况配置',
			options: [
				{
					name: 'sortItems',
					displayName: '排序条件',
					values: [
						{
							displayName: '升序',
							name: 'isAscend',
							type: 'boolean',
							default: true,
							description: 'Whether to sort in ascending order (true: 升序, false: 降序)',
						},
						{
							displayName: '字段 ID (queId)',
							name: 'queId',
							type: 'number',
							default: 0,
							description: '字段ID，specialQueId可见文档，具体queId获取见下方',
						},
					],
				},
			],
		},
		{
			displayName: '字段查询条件',
			name: 'queries',
			type: 'fixedCollection',
			typeOptions: {
				multipleValues: true,
			},
			placeholder: '添加查询条件',
			default: { queryItems: [] },
			description: '针对字段的查询条件',
			options: [
				{
					name: 'queryItems',
					displayName: '查询条件',
					values: [
						{
							displayName: '成员 User ID 列表',
							name: 'searchUserIds',
							type: 'string',
							default: '',
							description: '成员字段中，搜索答案中包含这些userId的申请。多个用英文逗号分隔，如：user1,user2',
						},
						{
							displayName: '或条件搜索关键字列表',
							name: 'searchKeys',
							type: 'string',
							default: '',
							description:
								'数组内的字段为或条件搜索，当searchKey不为null的时候，此字段会被忽略，搜索为模糊搜索。多个用英文逗号分隔，如：aa,bb,cc',
						},
						{
							displayName: '筛选数据范围',
							name: 'scope',
							type: 'options',
							default: 1,
							options: [
								{ name: '全部', value: 1 },
								{ name: '已填写', value: 2 },
								{ name: '未填写', value: 3 },
							],
						},
						{
							displayName: '搜索关键字',
							name: 'searchKey',
							type: 'string',
							default: '',
							description: '搜索关键字，搜索为模糊搜索',
						},
						{
							displayName: '选项 ID 列表',
							name: 'searchOptions',
							type: 'string',
							default: '',
							description: '单选多选中，搜索答案中包含这些选项的申请，由optionId组成。多个用英文逗号分隔，如：100,101,102',
						},
						{
							displayName: '字段 ID (queId)',
							name: 'queId',
							type: 'number',
							required: true,
							default: 0,
							description: '字段ID（必填），如果设置了筛选查询条件，此处为必填项，queId获取见文档',
						},
						{
							displayName: '最大值',
							name: 'maxValue',
							type: 'string',
							default: '',
							description: '数字模块中，是搜索结果中最大值；日期类型，就是最晚日期',
						},
						{
							displayName: '最小值',
							name: 'minValue',
							type: 'string',
							default: '',
							description: '数字模块中，是搜索结果中最小值；日期类型，就是最早日期',
						},
					],
				},
			],
		},
		{
			displayName: '高级选项',
			name: 'advancedOptions',
			type: 'collection',
			placeholder: '添加高级选项',
			default: {},
			options: [
				{
					displayName: '使用原始JSON Body',
					name: 'useRawBody',
					type: 'boolean',
					default: false,
					description: 'Whether to use raw JSON body instead of the fields above (启用后将忽略上面的字段配置，使用下方的原始JSON)',
				},
				{
					displayName: '原始JSON Body',
					name: 'rawBody',
					type: 'json',
					default: JSON.stringify(
						{
							type: 8,
							sorts: [],
							queriesRel: 'and',
							queries: [],
							queryKey: '',
							applyIds: [],
						},
						null,
						2,
					),
					description: '原始请求体JSON格式。参考：https://exiao.yuque.com/ixwxsb/bgzs0e/nkrtwkdwxgxsx73e',
					typeOptions: {
						alwaysOpenEditWindow: true,
					},
					displayOptions: {
						show: {
							useRawBody: [true],
						},
					},
				},
			],
		},
	] as INodeProperties[],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
		const appKey = this.getNodeParameter('appKey', index) as string;
		const returnAll = this.getNodeParameter('returnAll', index, false) as boolean;
		let limit = this.getNodeParameter('limit', index, 50) as number;
		const advancedOptions = this.getNodeParameter('advancedOptions', index, {}) as {
			useRawBody?: boolean;
			rawBody?: string;
		};

		if (!appKey) {
			throw new Error('App Key 不能为空');
		}

		// 限制最大值
		if (limit > 200) {
			limit = 200;
			this.logger.warn('Limit 超过最大值 200，已自动调整为 200');
		}

		// 构建请求体
		let body: IDataObject;

		if (advancedOptions.useRawBody && advancedOptions.rawBody) {
			// 使用原始JSON Body
			try {
				body = JSON.parse(advancedOptions.rawBody);
			} catch (error) {
				throw new Error('原始JSON Body 格式无效: ' + (error as Error).message);
			}
		} else {
			// 从拆分的字段构建请求体
			const type = this.getNodeParameter('type', index, 8) as number;
			const queriesRel = this.getNodeParameter('queriesRel', index, 'and') as string;
			const queryKey = this.getNodeParameter('queryKey', index, '') as string;
			const applyIdsStr = this.getNodeParameter('applyIds', index, '') as string;
			const sortsData = this.getNodeParameter('sorts', index, { sortItems: [] }) as {
				sortItems?: Array<{ queId: number; isAscend: boolean }>;
			};
			const queriesData = this.getNodeParameter('queries', index, { queryItems: [] }) as {
				queryItems?: Array<{
					queId: number;
					searchKey?: string;
					searchKeys?: string;
					minValue?: string;
					maxValue?: string;
					scope?: number;
					searchOptions?: string;
					searchUserIds?: string;
				}>;
			};

			// 解析applyIds
			const applyIds: number[] = applyIdsStr
				? applyIdsStr
						.split(',')
						.map((id) => parseInt(id.trim(), 10))
						.filter((id) => !isNaN(id))
				: [];

			// 解析sorts
			const sorts: Array<{ queId: number; isAscend: boolean }> = sortsData.sortItems || [];

			// 解析queries
			const queries: IDataObject[] = (queriesData.queryItems || []).map((item) => {
				const query: IDataObject = {
					queId: item.queId,
				};

				if (item.searchKey) {
					query.searchKey = item.searchKey;
				}

				if (item.searchKeys) {
					query.searchKeys = item.searchKeys.split(',').map((k) => k.trim());
				}

				if (item.minValue) {
					query.minValue = item.minValue;
				}

				if (item.maxValue) {
					query.maxValue = item.maxValue;
				}

				if (item.scope && item.scope !== 1) {
					query.scope = item.scope;
				}

				if (item.searchOptions) {
					query.searchOptions = item.searchOptions
						.split(',')
						.map((o) => parseInt(o.trim(), 10))
						.filter((o) => !isNaN(o));
				}

				if (item.searchUserIds) {
					query.searchUserIds = item.searchUserIds.split(',').map((u) => u.trim());
				}

				return query;
			});

			body = {
				type,
				queriesRel,
				sorts,
				queries,
			};

			if (queryKey) {
				body.queryKey = queryKey;
			}

			if (applyIds.length > 0) {
				body.applyIds = applyIds;
			}
		}

		// 统一的请求函数
		const fetchPage = async (pageNum: number, pageSize: number) => {
			const requestBody: IDataObject = {
				...body,
				pageSize,
				pageNum,
			};

			const response = await RequestUtils.request.call(this, {
				method: 'POST',
				url: `/app/${appKey}/apply/filter`,
				body: requestBody,
			});

			return {
				data: response?.result || [],
				total: response?.resultAmount || 0,
			};
		};

		// 处理分页逻辑
		if (returnAll) {
			let allResults: any[] = [];
			let pageNum = 1;
			const pageSize = limit;

			while (true) {
				const { data, total } = await fetchPage(pageNum, pageSize);
				allResults = allResults.concat(data);

				// 检查是否还有更多数据
				if (allResults.length >= total || pageNum >= 1000) {
					if (pageNum >= 1000) {
						this.logger.warn('已达到最大分页数限制(1000页)，停止获取');
					}
					break;
				}

				pageNum++;
			}

			return allResults;
		} else {
			// 单次请求，返回第一页数据
			const { data } = await fetchPage(1, limit);
			return data;
		}
	},
};

export default GetApplicationDataOperate;
