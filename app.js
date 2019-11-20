import _ from 'lodash'
import moduleLoader from './moduleLoader'

// window.features = ['FeatureA']
window.features = ['FeatureA', 'FeatureB', 'Platform', 'Router']
const SINGLE = 'SINGLE'
const MULTI = 'MULTI'

const sortedDependencyArray = [
    "UI",
    "BI",
    "FeatureA",
    "FeatureA-PlatformHandlers",
    "FeatureB",
    "FeatureB-PlatformHandlers",
    "FeatureB-RouterHandlers",
    "FeatureC",
    "FeatureC-RouterHandlers",
    "FeatureD",
    "Platform",
    "Router"
]

const modulesMetadata = {
    'FeatureA': {
        load: () => import('./modules/featureA/index.ts'),
        name: 'FeatureA',
        deps: [{name: 'UI', type: SINGLE}],
        depsDeep: ['UI'],
        partOf: 'FeatureA'
    },
    'FeatureA-PlatformHandlers': {
        load: () => import('./modules/featureA/PlatformHandlers.ts'),
        name: 'PlatformHandlers',
        deps: [],
        depsDeep: [],
        partOf: 'FeatureA'
    },
    'FeatureB': {
        load: () => import('./modules/featureB/index.ts'),
        name: 'FeatureB',
        deps: [{name: 'UI', type: SINGLE}],
        depsDeep: ['UI'],
        partOf: 'FeatureB'
    },
    'FeatureB-PlatformHandlers': {
        load: () => import('./modules/featureB/PlatformHandlers.ts'),
        name: 'PlatformHandlers',
        deps: [],
        depsDeep: [],
        partOf: 'FeatureB'
    },
    'FeatureB-RouterHandlers': {
        load: () => import('./modules/featureB/RouterHandlers.ts'),
        name: 'RouterHandlers',
        deps: [],
        depsDeep: [],
        partOf: 'FeatureB'
    },
    'FeatureC': {
        load: () => import('./modules/featureC/index.ts'),
        name: 'FeatureC',
        deps: [{name: 'UI', type: SINGLE}],
        depsDeep: ['UI'],
        partOf: 'FeatureC'
    },
    'FeatureC-RouterHandlers': {
        load: () => import('./modules/featureC/RouterHandlers.ts'),
        name: 'RouterHandlers',
        deps: [],
        depsDeep: [],
        partOf: 'FeatureC'
    },
    'FeatureD': {
        load: () => import('./modules/featureD/index.ts'),
        name: 'FeatureD',
        deps: [{name: 'UI', type: SINGLE}],
        depsDeep: ['UI'],
        partOf: 'FeatureD'
    },
    'Platform': {
        load: () => import('./modules/Platform/index.ts'),
        name: 'Platform',
        deps: [{name: 'UI', type: SINGLE}, {name: 'PlatformHandlers', type: MULTI}, {name: 'BI', type: SINGLE}],
        depsDeep: ['UI', 'BI', 'FeatureA-PlatformHandlers', 'FeatureB-PlatformHandlers'],
        partOf: 'Platform'
    },
    'UI': {
        load: () => import('./modules/UI/index.ts'),
        name: 'UI',
        deps: [],
        depsDeep: [],
        partOf: 'UI'
    },
    'BI': {
        load: () => import('./modules/BI/index.ts'),
        name: 'BI',
        deps: [],
        depsDeep: [],
        partOf: 'BI'
    },
    'Router': {
        load: () => import('./modules/router/index.ts'),
        name: 'Router',
        deps: [{name: 'UI', type: SINGLE}, {name: 'RouterHandlers', type: MULTI}],
        depsDeep: ['UI', 'FeatureC-RouterHandlers', 'FeatureB-RouterHandlers'],
        partOf: 'Router'
    },

}

const sortByDependencies = (depA, depB) => sortedDependencyArray.indexOf(depA) - sortedDependencyArray.indexOf(depB)
const filterByFeature = d => !d.includes("-") || window.features.includes(modulesMetadata[d].partOf)
const resolveModulesToLoad = () =>
    _(window.features)
        .map(f => [f, ...modulesMetadata[f].depsDeep.filter(filterByFeature)])
        .flatten()
        .uniq()
        .sort(sortByDependencies)
        .value()

const loader = moduleLoader(modulesMetadata, sortedDependencyArray)

async function start() {
    const modulesToLoad = resolveModulesToLoad()
    const modules = await loader.loadModules(modulesToLoad)
    console.log(features);
    features.forEach(f => modules[f].instances[0].doWork())
}

start()