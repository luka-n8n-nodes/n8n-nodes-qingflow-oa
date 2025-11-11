import { IExecuteFunctions, IHttpRequestOptions, JsonObject, NodeApiError } from 'n8n-workflow';
import { Credentials } from '../type/enums';

class RequestUtils {
	/**
	 * 处理响应体数据，统一处理业务逻辑
	 * @param context 执行上下文
	 * @param response 原始响应数据
	 * @param isRetry 是否为重试请求（用于错误提示）
	 * @returns 处理后的响应数据
	 */
	private static handleResponse(
		context: IExecuteFunctions,
		response: any,
		isRetry = false,
	): any {
		// 处理二进制数据（如下载资源操作）
		if (response instanceof Buffer || response instanceof ArrayBuffer || response instanceof Uint8Array) {
			return response;
		}

		const { errCode, errMsg, result } = response || {};

		// 正常响应，返回 result 字段或原始响应
		if (errCode === 0) {
			return result || response;
		}

		// 业务错误（轻流OA返回 200 但 errCode 不为 0）
		const errorPrefix = isRetry ? '刷新凭证后请求轻流OA API仍然失败' : '请求轻流OA API错误';
		const errorMsg = `${errorPrefix}: ${errCode}, ${errMsg || '未知错误'}`;
		
		throw new NodeApiError(context.getNode(), response as JsonObject, {
			message: errorMsg,
			description: response?.troubleshooter || '',
		});
	}

	static async originRequest(
		this: IExecuteFunctions,
		options: IHttpRequestOptions,
		clearAccessToken = false,
	) {
		const authenticationMethod = this.getNodeParameter(
			'authentication',
			0,
			Credentials.QingflowOaApi,
		) as string;

		const credentials = await this.getCredentials(authenticationMethod);
		options.baseURL = credentials.baseUrl as string;

		if (authenticationMethod === Credentials.QingflowOaApi) {
			// 如果 clearAccessToken 为 true，则将 accessToken 替换为空字符串，
			// 这样可以触发 preAuthentication 方法获取新的 access token
			const additionalCredentialOptions = {
				credentialsDecrypted: {
					id: Credentials.Id,
					name: Credentials.QingflowOaApi,
					type: Credentials.Type,
					data: {
						...credentials,
						accessToken: clearAccessToken ? '' : credentials.accessToken,
					},
				},
			};

			return this.helpers.httpRequestWithAuthentication.call(
				this,
				authenticationMethod,
				options,
				additionalCredentialOptions,
			);
		}

		return this.helpers.httpRequestWithAuthentication.call(this, authenticationMethod, options);
	}

	static async request(this: IExecuteFunctions, options: IHttpRequestOptions) {
		if (options.json === undefined) options.json = true;

		return RequestUtils.originRequest
			.call(this, options)
			.then(async (response) => {
				const { errCode } = response || {};

				// 处理 token 过期（轻流OA即使错误也返回 200，所以在 then 中处理）
				if (errCode === 49300) {
					// 重新获取 token 后的请求
					const retryResponse = await RequestUtils.originRequest.call(this, options, true);
					// 使用统一的响应处理函数，标记为重试请求
					return RequestUtils.handleResponse(this, retryResponse, true);
				}

				// 使用统一的响应处理函数
				return RequestUtils.handleResponse(this, response);
			})
			.catch((error) => {
				// 处理真正的网络错误或其他异常（非200响应）
				throw error;
			});
	}
}

export default RequestUtils;

