// const {resolve}

const _ = require('lodash')
const fs = require('fs')
const parser = require('@babel/parser')
const tsort = require('./tsort')

const options = {sourceType: "module",  plugins: ['typescript']}

function getModuleNames() {
    const folders = fs.readdirSync('./modules')
    const files = _.flatten(folders.map(folder => fs.readdirSync('./modules/' + folder).filter(f => f.includes('module.ts')).map(file => folder + '/' + file)))
    const metadata = files.map(file => {
        const path = './modules/' + file
        const moduleName = file.replace('/', '-').replace('-index', '').replace('.module.ts', '')
        const load = `**() => import('../modules/${file}')**`
        const deps = resolveDeps(path)
        return {
            moduleName,
            path,
            load: load,
            shouldFilterByFeature: !file.includes('index.module'),
            partOf: file.split('/')[0],
            deps,
            name: resolveImplements(path, moduleName)
        }
    })
    return _.keyBy(metadata, 'moduleName')
}

function resolveImplements(path, name) {
    const fileContent = fs.readFileSync(path, {encoding: 'UTF8'})
    const ast = parser.parse(fileContent, options)
    const body = ast.program.body;
    const ExportDefaultDeclaration = body.find(t => t.type === 'ExportDefaultDeclaration')
    if (!ExportDefaultDeclaration.declaration.returnType) {
        return name
    }
    return ExportDefaultDeclaration.declaration.returnType.typeAnnotation.typeName.name
}

function getDeps(ast) {
    const body = ast.program.body;
    const ExportDefaultDeclaration = body.find(t => t.type === 'ExportDefaultDeclaration')
    const params = ExportDefaultDeclaration.declaration.params
    if (!params) {
        return []
    }
    return params.map(param => {
        const typeAnnotation = param.typeAnnotation.typeAnnotation
        return typeAnnotation.typeName.name === "Array" ? {
            name: typeAnnotation.typeParameters.params[0].typeName.name,
            isArray: true
        } : {name: typeAnnotation.typeName.name, isArray: false}
    })
}

function resolveDeps(path) {
    const fileContent = fs.readFileSync(path, {encoding: 'UTF8'})
    const ast = parser.parse(fileContent, options)
    return getDeps(ast)
}

function resolveAllDeepDependencies(modulesMetadata, deps) {
    const allDeps = [...deps]
    let modulesToLoad = deps
    let innerDeps
    while (!_.isEmpty(modulesToLoad)) {
        innerDeps = _(modulesToLoad).map(m => modulesMetadata[m] ? modulesMetadata[m].deps : _.keys(modulesMetadata).filter(mod => modulesMetadata[mod].name === m)).flatten().uniq().filter(m => modulesMetadata[m]).value()
        modulesToLoad = [...innerDeps]
        allDeps.push(...innerDeps)
    }
    return _(allDeps).flatten().uniq().filter(m => modulesMetadata[m]).value()
}

function findDepsOf(modulesMetadata, module) {
    return Object.keys(modulesMetadata).filter(m => {
        // return modulesMetadata[m].deps.find(d => (d.type === "SINGLE") ? module.moduleName === d.name : Object.keys(modulesMetadata).filter(v => modulesMetadata[v].name === d.name).includes(module.moduleName))
        return modulesMetadata[m].deps.find(d => !d.isArray ? module.moduleName === d.name : Object.keys(modulesMetadata).filter(v => modulesMetadata[v].name === d.name).includes(module.moduleName))
    })
}

function build() {
    const modulesMetadata = getModuleNames()
    _.mapValues(modulesMetadata, m => Object.assign(m, {
        depsDeep: resolveAllDeepDependencies(modulesMetadata, m.deps.map(v => v.name)),
        dependencyOf: findDepsOf(modulesMetadata, m)
    }))
    const modulesAllDeps = _.mapValues(modulesMetadata, v => v.depsDeep)
    const sortedByDepsArray = tsort(modulesAllDeps)
    fs.writeFileSync('build-time/modulesMetaData.js', "export const modulesMetadata = " + JSON.stringify(modulesMetadata).replace(/"\*\*/g, '').replace(/\*\*"/g, ''))
    fs.writeFileSync('build-time/sortedDependencyArray.js', "export const sortedDependencyArray = " + JSON.stringify(sortedByDepsArray))
}

build()
