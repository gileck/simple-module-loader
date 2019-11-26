import {someFunc} from "./modules/common/common";

export default function (modulesMetadata) {
    let modules = {}

    function loadModules(modulesToLoad) {
        //can be improved with deps counter
        const isAllDepsLoaded = deps => deps.every(d => modules[d.name] && modules[d.name].instances && modules[d.name].instances.length === modules[d.name].length)
        const resolveDeps = deps => deps.map(d => d.isArray ? modules[d.name].instances : modules[d.name].instances[0])
        const allModulesLoaded = () => Object.keys(modulesMetadata).filter(m => modulesToLoad.includes(m)).every(m => modulesMetadata[m] && modulesMetadata[m].instance)
        const isModuleWaitingForThisModule = (thisModule, moduleName) => modulesMetadata[moduleName].factory && !modulesMetadata[moduleName].instance && modulesMetadata[moduleName].depsDeep.includes(thisModule)

        function initModule(moduleName, name) {
            const instance = modulesMetadata[moduleName].factory(...resolveDeps(modulesMetadata[moduleName].deps))
            modules[name].instances.push(instance)
            modulesMetadata[moduleName].instance = true
        }

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
                        initModule(moduleName, name)
                        modulesToLoad.filter(mod => isModuleWaitingForThisModule(moduleName, mod)).forEach(mod => {
                            if (isAllDepsLoaded(modulesMetadata[mod].deps)) initModule(mod, modulesMetadata[mod].name)
                        })
                    }
                    if (allModulesLoaded()) {
                        resolve(modules)
                        console.log(modules);
                    }
                })
            })
        })
    }

    // dynamically load a single module
    async function loadModule(moduleName, multiInject = false) {
        const modulesToLoad = [moduleName, ...modulesMetadata[moduleName].depsDeep]
        const loadedModules = await loadModules(modulesToLoad)
        return multiInject ? loadedModules[moduleName].instances : loadedModules[moduleName].instances[0]
    }

    return {
        loadModules,
        loadModule
    }
}