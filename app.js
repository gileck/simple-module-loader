import _ from 'lodash'
import {loadModules} from './moduleLoader'
import {modulesMetadata} from './build-time/modulesMetaData'
import {sortedDependencyArray} from './build-time/sortedDependencyArray'
// console.log(modulesMetadata);
// console.log(sortedDependencyArray);

// window.features = ['FeatureA']
window.features = ['FeatureA', 'FeatureB', 'Platform', 'Router']

const allPossibleModulesToLoad = _(window.features)
        .map(f => [f, ...modulesMetadata[f].depsDeep])
        .flatten()
        .uniq()
        .keyBy(x => x)
        .value()

const onlyModulesWeNeedToLoad =  _(allPossibleModulesToLoad)
        .pickBy(moduleName => _.get(allPossibleModulesToLoad, modulesMetadata[moduleName].partOf))
        .value()

const modulesToLoad = _.mapValues(onlyModulesWeNeedToLoad, key => {
    const module = modulesMetadata[key]

    return {load: module.load, deps: _(module.deps).flatten().filter(d => onlyModulesWeNeedToLoad[d]).value()}
})

async function start() {
    const modules = await loadModules(modulesToLoad)
    // console.log(modules);
    // console.log(features);
    features.forEach(f => modules[f].doWork())
}

start()