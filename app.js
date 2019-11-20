import _ from 'lodash'
import moduleLoader from './moduleLoader'
import {modulesMetadata} from './build-time/modulesMetaData'
import {sortedDependencyArray} from './build-time/sortedDependencyArray'

// window.features = ['FeatureA']
window.features = ['FeatureA', 'FeatureB', 'Platform', 'Router']

const sortByDependencies = (depA, depB) => sortedDependencyArray.indexOf(depA) - sortedDependencyArray.indexOf(depB)
const filterByFeature = d => !d.includes("-") || window.features.includes(modulesMetadata[d].partOf)
const modulesToLoad = _(window.features)
        .map(f => [f, ...modulesMetadata[f].depsDeep.filter(filterByFeature)])
        .flatten()
        .uniq()
        .sort(sortByDependencies)
        .value()

const loader = moduleLoader(modulesMetadata)

async function start() {
    const modules = await loader.loadModules(modulesToLoad)
    console.log(features);
    features.forEach(f => modules[f].instances[0].doWork())
}

start()