const SINGLE = "SINGLE"
const MULTI = "MULTI"


export const modulesMetadata = {
    'FeatureA': {
        load: () => import('../modules/featureA/index.ts'),
        name: 'FeatureA',
        deps: [{name: 'UI', type: SINGLE}],
        depsDeep: ['UI'],
        partOf: 'FeatureA'
    },
    'FeatureA-PlatformHandlers': {
        load: () => import('../modules/featureA/PlatformHandlers.ts'),
        name: 'PlatformHandlers',
        deps: [],
        depsDeep: [],
        partOf: 'FeatureA'
    },
    'FeatureB': {
        load: () => import('../modules/featureB/index.ts'),
        name: 'FeatureB',
        deps: [{name: 'UI', type: SINGLE}],
        depsDeep: ['UI'],
        partOf: 'FeatureB'
    },
    'FeatureB-PlatformHandlers': {
        load: () => import('../modules/featureB/PlatformHandlers.ts'),
        name: 'PlatformHandlers',
        deps: [],
        depsDeep: [],
        partOf: 'FeatureB'
    },
    'FeatureB-RouterHandlers': {
        load: () => import('../modules/featureB/RouterHandlers.ts'),
        name: 'RouterHandlers',
        deps: [],
        depsDeep: [],
        partOf: 'FeatureB'
    },
    'FeatureC': {
        load: () => import('../modules/featureC/index.ts'),
        name: 'FeatureC',
        deps: [{name: 'UI', type: SINGLE}],
        depsDeep: ['UI'],
        partOf: 'FeatureC'
    },
    'FeatureC-RouterHandlers': {
        load: () => import('../modules/featureC/RouterHandlers.ts'),
        name: 'RouterHandlers',
        deps: [],
        depsDeep: [],
        partOf: 'FeatureC'
    },
    'FeatureD': {
        load: () => import('../modules/featureD/index.ts'),
        name: 'FeatureD',
        deps: [{name: 'UI', type: SINGLE}],
        depsDeep: ['UI'],
        partOf: 'FeatureD'
    },
    'Platform': {
        load: () => import('../modules/Platform/index.ts'),
        name: 'Platform',
        deps: [{name: 'UI', type: SINGLE}, {name: 'PlatformHandlers', type: MULTI}, {name: 'BI', type: SINGLE}],
        depsDeep: ['UI', 'BI', 'FeatureA-PlatformHandlers', 'FeatureB-PlatformHandlers'],
        partOf: 'Platform'
    },
    'UI': {
        load: () => import('../modules/UI/index.ts'),
        name: 'UI',
        deps: [],
        depsDeep: [],
        partOf: 'UI'
    },
    'BI': {
        load: () => import('../modules/BI/index.ts'),
        name: 'BI',
        deps: [],
        depsDeep: [],
        partOf: 'BI'
    },
    'Router': {
        load: () => import('../modules/router/index.ts'),
        name: 'Router',
        deps: [{name: 'UI', type: SINGLE}, {name: 'RouterHandlers', type: MULTI}],
        depsDeep: ['UI', 'FeatureC-RouterHandlers', 'FeatureB-RouterHandlers'],
        partOf: 'Router'
    },

}
