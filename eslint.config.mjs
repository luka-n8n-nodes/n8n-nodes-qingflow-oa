import { config } from '@n8n/node-cli/eslint';

export default [
	...(Array.isArray(config) ? config : [config]),
	{
		rules: {
			// 禁用 n8n 社区节点限制规则，本插件需要这些依赖才能正常运行
			'@n8n/community-nodes/no-restricted-imports': 'off',
			'@n8n/community-nodes/no-restricted-globals': 'off',
			'@n8n/community-nodes/credential-test-required': 'off',
			'@n8n/community-nodes/credential-password-field': 'off',
			'@n8n/community-nodes/no-deprecated-workflow-functions': 'off',
			// 与历史实现兼容：后续可改为 NodeApiError / continueOnFail 规范
			'@n8n/community-nodes/require-node-api-error': 'off',
			'@n8n/community-nodes/require-continue-on-fail': 'off',
			// 暂时禁用一些严格规则，后续可逐步修复
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/ban-ts-comment': 'off',
			'@typescript-eslint/no-unused-vars': 'off',
			'@typescript-eslint/no-require-imports': 'off',
			'@typescript-eslint/no-unsafe-function-type': 'off',
			'@typescript-eslint/no-duplicate-enum-values': 'off',
			'n8n-nodes-base/node-param-collection-type-unsorted-items': 'off',
			'n8n-nodes-base/node-param-fixed-collection-type-unsorted-items': 'off',
			'no-useless-catch': 'off',
			'prefer-const': 'warn',
		},
	},
];

