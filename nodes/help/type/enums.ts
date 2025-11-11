export declare const enum ResourceType {
	AddressBook = 'addressBook',
	// 可以根据轻流OA的其他资源类型继续添加
}

export declare const enum OperationType {
	// 通讯录相关操作
	GetUserId = 'getUserId',
	GetUsers = 'getUsers',
	GetUserDetail = 'getUserDetail',
	// 可以根据轻流OA的其他操作类型继续添加
}

export declare const enum OutputType {
	Single = 'single',
	Multiple = 'multiple',
	None = 'none',
}

export declare const enum Credentials {
	QingflowOaApi = 'qingflowOaApi',
	Id = '33f755b6-3486-4507-9049-1407c6ddfc91',
	Type = 'qingflow-oa',
}

export declare const enum BaseUrl {
	Default = 'https://openapi.qingflow.com',
}

