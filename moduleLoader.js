export default function (modulesMetadata) {
    let modules = {}

    // dynamically load a single module
    async function loadModule(moduleName, multiInject = false) {
    //     const modulesToLoad = [moduleName, ...modulesMetadata[moduleName].depsDeep]
    // const loadedModules = await loadModules(modulesToLoad)
    //     return multiInject ? loadedModules[moduleName].instances : loadedModules[moduleName].instances[0]
    }

    function loadModules(modulesToLoad) {
        const isAllDepsLoaded = deps => deps.every(d => modules[d.name] && modules[d.name].instances && modules[d.name].instances.length === modules[d.name].length)
        const resolveDeps = deps => deps.map(d => d.type === "SINGLE" ? modules[d.name].instances[0] : modules[d.name].instances)
        const allModulesLoaded = () => Object.keys(modulesMetadata).filter(m => modulesToLoad.includes(m)).every(m => modulesMetadata[m] && modulesMetadata[m].instance)

        return new Promise(resolve => {
            modulesToLoad.forEach(moduleName => {
                const {name, deps, load, factory} = modulesMetadata[moduleName]
                if (factory) return //module is already loaded

                load().then(module => {

                    //saving factory function for later use (if cant initiate module right now)
                    modulesMetadata[moduleName].factory = module.default

                    //registering the module (not the instance, just the module)
                    if (!modules[name]) {
                        modules[name] = {
                            instances: [],
                            //tracking the length to know when the dependency is ready to be injected to other modules (multiple modules might implement a single dependency)
                            length: Object.keys(modulesMetadata).filter(m => modulesToLoad.includes(m) && modulesMetadata[m].name === name).length
                        }
                    }

                    if (isAllDepsLoaded(deps)) {
                        const instance = modulesMetadata[moduleName].factory(...resolveDeps(deps))
                        modules[name].instances.push(instance)
                        modulesMetadata[moduleName].instance = true
                        //after creating an instance, trying to create instances of other modules (that are either dependent on this module or dependent on some module that depends on it)
                        modulesToLoad
                            .filter(mod => modulesMetadata[mod].factory && !modulesMetadata[mod].instance && modulesMetadata[mod].depsDeep.includes(moduleName))
                            .forEach(moduleName => {
                                const {factory, deps, name} = modulesMetadata[moduleName]
                                if (isAllDepsLoaded(deps)) {
                                    modules[name].instances.push(factory(...resolveDeps(deps)))
                                    modulesMetadata[moduleName].instance = true
                                }
                            })
                    }
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