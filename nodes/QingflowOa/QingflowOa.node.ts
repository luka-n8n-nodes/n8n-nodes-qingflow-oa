import {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';
import ResourceFactory from '../help/builder/ResourceFactory';

const resourceBuilder = ResourceFactory.build(__dirname);

export class QingflowOa implements INodeType {
	description: INodeTypeDescription = {
		displayName: '轻流OA',
		subtitle: '={{ $parameter.resource }}:{{ $parameter.operation }}',
		name: 'qingflowOa',
		// eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
		icon: 'file:icon.png',
		group: ['transform'],
		version: 1,
		description: '轻流OA API集成，支持通讯录、任务委托、应用管理、数据操作等功能',
		defaults: {
			name: '轻流OA',
		},
		usableAsTool: true,
		// @ts-ignore
		inputs: ['main'],
		// @ts-ignore
		outputs: ['main'],
		credentials: [
			{
				name: 'qingflowOaApi',
				required: true,
			},
		],
		properties: [...resourceBuilder.build()],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();

		let responseData: IDataObject = {};
		let returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0);
		const operation = this.getNodeParameter('operation', 0);

		const callFunc = resourceBuilder.getCall(resource, operation);

		if (!callFunc) {
			throw new NodeOperationError(
				this.getNode(),
				'未实现方法: ' + resource + '.' + operation,
			);
		}

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				this.logger.debug('call function', {
					resource,
					operation,
					itemIndex,
				});

				responseData = await callFunc.call(this, itemIndex);
			} catch (error) {
				this.logger.error('call function error', {
					resource,
					operation,
					itemIndex,
					errorMessage: error.message,
					stack: error.stack,
				});

				if (this.continueOnFail()) {
					let errorJson = {
						error: error.message,
					};
					if (error.name === 'NodeApiError') {
						errorJson.error = error?.cause?.error;
					}

					returnData.push({
						json: errorJson,
						pairedItem: itemIndex,
					});
					continue;
				} else if (error.name === 'NodeApiError') {
					throw error;
				} else {
					throw new NodeOperationError(this.getNode(), error, {
						message: error.message,
						itemIndex,
					});
				}
			}
			const executionData = this.helpers.constructExecutionMetaData(
				this.helpers.returnJsonArray(responseData as IDataObject),
				{ itemData: { item: itemIndex } },
			);
			returnData.push(...executionData);
		}

		return [returnData];
	}
}
