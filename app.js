import _ from 'lodash'
import moduleLoader from './moduleLoader'

// window.features = ['FeatureA']
window.features = ['FeatureA', 'FeatureB', 'Platform', 'Router']
const mergedModules = ['PlatformHandlers', 'RouterHandlers']

const loadModules = {
    'FeatureA': () => import('./modules/featureA/index.ts'),
    'FeatureA-PlatformHandlers': () => import('./modules/featureA/PlatformHandlers.ts'),
    'FeatureB': () => import('./modules/featureB/index.ts'),
    'FeatureB-PlatformHandlers': () => import('./modules/featureB/PlatformHandlers.ts'),
    'FeatureB-RouterHandlers': () => import('./modules/featureB/RouterHandlers.ts'),
    'FeatureC': () => import('./modules/featureC/index.ts'),
    'FeatureC-RouterHandlers': () => import('./modules/featureC/RouterHandlers.ts'),
    'FeatureD': () => import('./modules/featureD/index.ts'),
    'Platform': () => import('./modules/Platform/index.ts'),
    'UI': () => import('./modules/UI/index.ts'),
    'BI': () => import('./modules/BI/index.ts'),
    'Router': () => import('./modules/router/index.ts'),
}
const moduleDeps = {
    'FeatureA-PlatformHandlers': [],
    'FeatureA': ['UI'],
    'FeatureB-PlatformHandlers': [],
    'FeatureB-RouterHandlers': [],
    'FeatureB': ['UI'],
    'FeatureC-RouterHandlers': [],
    'FeatureC': ['UI'],
    'FeatureD': ['UI'],
    'Platform': ['BI', 'UI', 'FeatureA-PlatformHandlers', 'FeatureB-PlatformHandlers'],
    'Router': ['UI', 'FeatureB-RouterHandlers', 'FeatureC-RouterHandlers'],
    'UI': [],
    'BI': [],
}

const filterByFeature = d => d.includes("-") ? window.features.some(f => d.includes(f)) : true
const resolveModulesToLoad = () => _(window.features).map(f => [f, ...moduleDeps[f].filter(filterByFeature)]).flatten().uniq().value()

const loader = moduleLoader(loadModules, mergedModules)

async function start() {
    const modulesToLoad = resolveModulesToLoad()
    const modules = await loader.loadModules(modulesToLoad)
    console.log({modules})
    console.log({features});
    features.forEach(f => modules[f].doWork())
}

start()