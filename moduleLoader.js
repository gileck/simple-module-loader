export default function (modulesMetadata, sortedDependencyArray) {
    let modules = {}

    function loadModule() {
        //
    }

    function loadModules(modulesToLoad) {

        const sortByDependencies = (depA, depB) => sortedDependencyArray.indexOf(depA) - sortedDependencyArray.indexOf(depB)
        const isAllDepsLoaded = deps => deps.every(d => modules[d.name] && modules[d.name].instances && modules[d.name].instances.length === modules[d.name].length)
        const resolveDeps = deps => deps.map(d => d.type === "SINGLE" ? modules[d.name].instances[0] : modules[d.name].instances)
        const allModulesLoaded = () => Object.keys(modulesMetadata).filter(m => modulesToLoad.includes(m)).every(m => modulesMetadata[m] && modulesMetadata[m].instance)

        return new Promise(resolve => {
            modulesToLoad.forEach(moduleName => {
                const {name, deps, load} = modulesMetadata[moduleName]
                load().then(module => {
                    // console.log(moduleName);
                    // console.log(modulesMetadata[moduleName]);
                    modulesMetadata[moduleName].factory = module.default

                    if (!modules[name]) {
                        modules[name] = {
                            instances: [],
                            length: Object.keys(modulesMetadata).filter(m => modulesToLoad.includes(m) && modulesMetadata[m].name === name).length
                        }
                    }

                    if (isAllDepsLoaded(deps)) {
                        const instance = modulesMetadata[moduleName].factory(...resolveDeps(deps))
                        modules[name].instances.push(instance)
                        modulesMetadata[moduleName].instance = true

                        // console.log('try', Object.keys(modulesMetadata).filter(mod => modulesMetadata[mod].factory && !modulesMetadata[mod].instance));

                        Object.keys(modulesMetadata)
                            .filter(mod => modulesMetadata[mod].factory && !modulesMetadata[mod].instance)
                            .sort(sortByDependencies)
                            .forEach(moduleName => {
                                const {factory, deps, name} = modulesMetadata[moduleName]
                                // console.log('try', moduleName, isAllDepsLoaded(deps));
                                if (isAllDepsLoaded(deps)) {
                                    modules[name].instances.push(factory(...resolveDeps(deps)))
                                    modulesMetadata[moduleName].instance = true
                                }
                            })
                    }


                    // if (allModulesLoaded()) {
                    // console.log(Object.keys(modulesMetadata).filter(m => modulesToLoad.includes(m)).map(m => ({m, i: modulesMetadata[m] && modulesMetadata[m].instance})));
                    if (allModulesLoaded()) {
                        resolve(modules)
                    }
                })
            })
        })
    }

    return {
        loadModule,
        loadModules
    }
}