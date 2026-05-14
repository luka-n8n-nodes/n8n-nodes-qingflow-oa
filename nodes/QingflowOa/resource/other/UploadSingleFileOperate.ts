import { IDataObject, IExecuteFunctions, IHttpRequestOptions, INodeProperties, NodeOperationError } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';
import { ICommonOptionsValue, timeoutOption } from '../../../help/utils/sharedOptions';

/** 轻流「上传单个文件」接口单文件大小上限（与官方文档一致，50MB） */
const UPLOAD_SINGLE_FILE_MAX_BYTES = 50 * 1024 * 1024;

const uploadSingleFileOptions: INodeProperties = {
	displayName: 'Options',
	name: 'options',
	type: 'collection',
	placeholder: 'Add option',
	default: {},
	options: [timeoutOption],
};

const UploadSingleFileOperate: ResourceOperations = {
	name: '上传单个文件',
	value: 'uploadSingleFile',
	action: '上传单个文件',
	order: 10,
	options: [
		{
			displayName: 'Binary Property',
			name: 'binaryProperty',
			type: 'string',
			default: 'data',
			required: true,
			description:
				'要上传的二进制数据字段名（与上游节点输出 Binary 的字段名一致）。单文件，大小需在 50MB 以内',
		},
		{
			displayName: 'File Name',
			name: 'fileName',
			type: 'string',
			default: '',
			placeholder: '例如：test.txt',
			description:
				'文件名（需含扩展名），应与实际上传的文件一致；留空则使用 Binary 中的文件名（若 Binary 也无文件名则使用 file.bin）',
		},
		uploadSingleFileOptions,
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
		const binaryProperty = this.getNodeParameter('binaryProperty', index) as string;
		const fileNameParam = (this.getNodeParameter('fileName', index) as string)?.trim();
		const options = this.getNodeParameter('options', index, {}) as ICommonOptionsValue;

		const binaryData = this.helpers.assertBinaryData(index, binaryProperty);
		const buffer = await this.helpers.getBinaryDataBuffer(index, binaryProperty);

		if (buffer.length > UPLOAD_SINGLE_FILE_MAX_BYTES) {
			const sizeMb = (buffer.length / (1024 * 1024)).toFixed(2);
			throw new NodeOperationError(
				this.getNode(),
				`文件大小 ${sizeMb} MB 已超过轻流单文件上传上限 50 MB，请压缩、拆分或更换文件后再试。`,
			);
		}

		const fileName = fileNameParam ||
			(typeof binaryData.fileName === 'string' && binaryData.fileName ? binaryData.fileName : '') ||
			'file.bin';

		const formData = new FormData();
		const mimeType = binaryData.mimeType || 'application/octet-stream';
		formData.append('file', new Blob([new Uint8Array(buffer)], { type: mimeType }), fileName);
		formData.append('fileName', fileName);

		const requestOptions: IHttpRequestOptions = {
			method: 'POST',
			url: '/upload/file',
			body: formData,
			json: false,
		};

		if (options.timeout) {
			requestOptions.timeout = options.timeout;
		}

		const response = await RequestUtils.request.call(this, requestOptions);
		return response as IDataObject;
	},
};

export default UploadSingleFileOperate;
