export const loadModules = modulesToLoad => {
  const registry = {
    instances: {},
    waitingInitializers: {}
  }

  return new Promise(resolve => {
    const registerInitializerToStartWhenDepsResolved = (moduleName, initializer) => {
      modulesToLoad[moduleName].deps.forEach(dep => {
        if (!registry.waitingInitializers[dep]) {
          registry.waitingInitializers[dep] = []
        }
        registry.waitingInitializers[dep].push(initializer)
      })
    }

    const createInitializer = (module, moduleName, numberOfDepsNotInitialized) => {
      return () => {
        if (numberOfDepsNotInitialized > 0) {
          numberOfDepsNotInitialized -= 1
          return
        }
        const depsInstances = modulesToLoad[moduleName].deps.map(dep => registry.instances[dep])
        registry.instances[moduleName] = module && module.default(...depsInstances)
        registry.waitingInitializers[moduleName] && registry.waitingInitializers[moduleName]
          .forEach(initializer => initializer())
      }
    }

    Object.keys(modulesToLoad).forEach(async moduleName => {
      const module = await modulesToLoad[moduleName].load()
      const numberOfDepsNotInitialized = modulesToLoad[moduleName].deps
        .filter(d => !registry.instances[d]).length
      const initializer = createInitializer(module, moduleName, numberOfDepsNotInitialized)
      registerInitializerToStartWhenDepsResolved(moduleName, initializer)
      initializer()

      if (Object.keys(registry.instances).length === Object.keys(modulesToLoad).length) {
        resolve(registry.instances)
      }
    })
  })
}

