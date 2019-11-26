export const modulesMetadata = {
    "BI": {
        "moduleName": "BI",
        "path": "./modules/BI/index.module.ts",
        "load": () => import('../modules/BI/index.module.ts'),
        "shouldFilterByFeature": false,
        "partOf": "BI",
        "deps": [],
        "name": "BI",
        "depsDeep": [],
        "dependencyOf": ["Platform"]
    },
    "FeatureA-PlatformHandlers": {
        "moduleName": "FeatureA-PlatformHandlers",
        "path": "./modules/FeatureA/PlatformHandlers.module.ts",
        "load": () => import('../modules/FeatureA/PlatformHandlers.module.ts'),
        "shouldFilterByFeature": true,
        "partOf": "FeatureA",
        "deps": [],
        "name": "PlatformHandlers",
        "depsDeep": [],
        "dependencyOf": ["Platform"]
    },
    "FeatureA": {
        "moduleName": "FeatureA",
        "path": "./modules/FeatureA/index.module.ts",
        "load": () => import('../modules/FeatureA/index.module.ts'),
        "shouldFilterByFeature": false,
        "partOf": "FeatureA",
        "deps": [{"name": "UI", "isArray": false}],
        "name": "FeatureA",
        "depsDeep": ["UI"],
        "dependencyOf": []
    },
    "FeatureB-PlatformHandlers": {
        "moduleName": "FeatureB-PlatformHandlers",
        "path": "./modules/FeatureB/PlatformHandlers.module.ts",
        "load": () => import('../modules/FeatureB/PlatformHandlers.module.ts'),
        "shouldFilterByFeature": true,
        "partOf": "FeatureB",
        "deps": [],
        "name": "PlatformHandlers",
        "depsDeep": [],
        "dependencyOf": ["Platform"]
    },
    "FeatureB-RouterHandlers": {
        "moduleName": "FeatureB-RouterHandlers",
        "path": "./modules/FeatureB/RouterHandlers.module.ts",
        "load": () => import('../modules/FeatureB/RouterHandlers.module.ts'),
        "shouldFilterByFeature": true,
        "partOf": "FeatureB",
        "deps": [],
        "name": "RouterHandlers",
        "depsDeep": [],
        "dependencyOf": ["Router"]
    },
    "FeatureB": {
        "moduleName": "FeatureB",
        "path": "./modules/FeatureB/index.module.ts",
        "load": () => import('../modules/FeatureB/index.module.ts'),
        "shouldFilterByFeature": false,
        "partOf": "FeatureB",
        "deps": [{"name": "UI", "isArray": false}],
        "name": "FeatureB",
        "depsDeep": ["UI"],
        "dependencyOf": []
    },
    "FeatureC-RouterHandlers": {
        "moduleName": "FeatureC-RouterHandlers",
        "path": "./modules/FeatureC/RouterHandlers.module.ts",
        "load": () => import('../modules/FeatureC/RouterHandlers.module.ts'),
        "shouldFilterByFeature": true,
        "partOf": "FeatureC",
        "deps": [],
        "name": "RouterHandlers",
        "depsDeep": [],
        "dependencyOf": ["Router"]
    },
    "FeatureC": {
        "moduleName": "FeatureC",
        "path": "./modules/FeatureC/index.module.ts",
        "load": () => import('../modules/FeatureC/index.module.ts'),
        "shouldFilterByFeature": false,
        "partOf": "FeatureC",
        "deps": [{"name": "UI", "isArray": false}],
        "name": "FeatureC",
        "depsDeep": ["UI"],
        "dependencyOf": []
    },
    "FeatureD": {
        "moduleName": "FeatureD",
        "path": "./modules/FeatureD/index.module.ts",
        "load": () => import('../modules/FeatureD/index.module.ts'),
        "shouldFilterByFeature": false,
        "partOf": "FeatureD",
        "deps": [{"name": "UI", "isArray": false}],
        "name": "FeatureD",
        "depsDeep": ["UI"],
        "dependencyOf": []
    },
    "Platform": {
        "moduleName": "Platform",
        "path": "./modules/Platform/index.module.ts",
        "load": () => import('../modules/Platform/index.module.ts'),
        "shouldFilterByFeature": false,
        "partOf": "Platform",
        "deps": [{"name": "UI", "isArray": false}, {"name": "PlatformHandlers", "isArray": true}, {
            "name": "BI",
            "isArray": false
        }],
        "name": "Platform",
        "depsDeep": ["UI", "BI", "FeatureA-PlatformHandlers", "FeatureB-PlatformHandlers"],
        "dependencyOf": []
    },
    "Router": {
        "moduleName": "Router",
        "path": "./modules/Router/index.module.ts",
        "load": () => import('../modules/Router/index.module.ts'),
        "shouldFilterByFeature": false,
        "partOf": "Router",
        "deps": [{"name": "UI", "isArray": false}, {"name": "RouterHandlers", "isArray": true}],
        "name": "Router",
        "depsDeep": ["UI", "FeatureB-RouterHandlers", "FeatureC-RouterHandlers"],
        "dependencyOf": []
    },
    "UI": {
        "moduleName": "UI",
        "path": "./modules/UI/index.module.ts",
        "load": () => import('../modules/UI/index.module.ts'),
        "shouldFilterByFeature": false,
        "partOf": "UI",
        "deps": [],
        "name": "UI",
        "depsDeep": [],
        "dependencyOf": ["FeatureA", "FeatureB", "FeatureC", "FeatureD", "Platform", "Router"]
    }
}