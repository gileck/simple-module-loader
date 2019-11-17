export default function (loadModulesFunctions, mergedModules) {
    let modules = {}

    function loadModule() {
        //
    }

    function loadModules(modulesToLoad) {
        ///////////////////////////////////
        const isAllDepsLoaded = deps => deps.every(d => mergedModules.includes(d) ? modulesToLoad.filter(m => m.includes("-" + d)).every(d => modules[d] && modules[d].instance) : modules[d] && modules[d].instance)
        const resolveDeps = deps => deps.map(d => mergedModules.includes(d) ? modulesToLoad.filter(m => m.includes("-" + d)).map(d => modules[d] && modules[d].instance) : modules[d] && modules[d].instance)
        return new Promise(resolve => {
            modulesToLoad.forEach(moduleName => {
                loadModulesFunctions[moduleName]().then(module => {
                    modules[module.name] = module
                    modules[module.name].instance = isAllDepsLoaded(module.deps) ? module.default(...resolveDeps(module.deps)) : null

                    _.keys(modules)
                        .filter(mod => !modules[mod].instance && (modules[mod].deps.includes(module.name) || modules[mod].deps.some(d => module.name.includes(d))))
                        .forEach(moduleName => modules[moduleName].instance = isAllDepsLoaded(modules[moduleName].deps) ? modules[moduleName].default(...resolveDeps(modules[moduleName].deps)) : null)

                    if (modulesToLoad.length === _.keys(modules).filter(m => modules[m].instance).length) resolve(_.mapValues(modules, v => v.instance))
                })
            })
        })
    }
    return {
        loadModule,
        loadModules
    }
}