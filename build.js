// const {resolve}

const _ = require('lodash')
const fs = require('fs')
const parser = require('@babel/parser')
const tsort = require('./tsort')

const options = {sourceType: "module",  plugins: ['typescript']}

const modulesArrays = {}

function getModuleNames() {
    const folders = fs.readdirSync('./modules')
    const files = _.flatten(folders.map(folder => fs.readdirSync('./modules/' + folder).filter(f => f.includes('module.ts')).map(file => folder + '/' + file)))
    const metadata = files.map(file => {
        const path = './modules/' + file
        const moduleName = file.replace('/', '-').replace('-index', '').replace('.module.ts', '')
        const load = `**() => import('../modules/${file}')**`
        const deps = resolveDeps(path, moduleName)
        return {
            moduleName,
            path,
            load: load,
            partOf: file.split('/')[0],
            deps,
            name: moduleName
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

function getDeps(ast, moduleName) {
    const body = ast.program.body;
    const ExportDefaultDeclaration = body.find(t => t.type === 'ExportDefaultDeclaration')
    const returnType = _.get(ExportDefaultDeclaration.declaration, ['returnType', 'typeAnnotation'])
    const returnTypeName = _.get(returnType, ['typeName', 'name'])
    const params = ExportDefaultDeclaration.declaration.params

    if (returnTypeName) {
        if (!modulesArrays[returnTypeName]) {
            modulesArrays[returnTypeName] = []
        }
        modulesArrays[returnTypeName].push(moduleName)
    }

    if (!params) {
        return []
    }

    return params.map(param => {
        const typeAnnotation = param.typeAnnotation.typeAnnotation
        if (typeAnnotation.type === 'TSArrayType') {
            return modulesArrays[typeAnnotation.elementType.typeName.name]
        }

        return typeAnnotation.typeName.name
    })
}

function resolveDeps(path, moduleName) {
    const fileContent = fs.readFileSync(path, {encoding: 'UTF8'})
    const ast = parser.parse(fileContent, options)
    return getDeps(ast, moduleName)
}

function resolveAllDeepDependencies(modulesMetadata, deps) {
    const allDeps = [...deps]
    let modulesToLoad = _.flatten(deps)
    let innerDeps
    while (!_.isEmpty(modulesToLoad)) {
        innerDeps = _(modulesToLoad).map(m => modulesMetadata[m] ? modulesMetadata[m].deps : _.keys(modulesMetadata).filter(mod => modulesMetadata[mod].name === m)).flatten().uniq().filter(m => modulesMetadata[m]).value()
        modulesToLoad = [...innerDeps]
        allDeps.push(...innerDeps)
    }
    return _(allDeps).flatten().uniq().filter(m => modulesMetadata[m]).value()
}

function build() {
    const modulesMetadata = getModuleNames()
    _.mapValues(modulesMetadata, m => Object.assign(m, {
        depsDeep: resolveAllDeepDependencies(modulesMetadata, m.deps)
    }))
    const modulesAllDeps = _.mapValues(modulesMetadata, v => v.depsDeep)
    const sortedByDepsArray = tsort(modulesAllDeps)
    fs.writeFileSync('build-time/modulesMetaData.js', "export const modulesMetadata = " + JSON.stringify(modulesMetadata).replace(/"\*\*/g, '').replace(/\*\*"/g, ''))
    fs.writeFileSync('build-time/sortedDependencyArray.js', "export const sortedDependencyArray = " + JSON.stringify(sortedByDepsArray))
}

build()
