// const parser = require('@babel/parser')
// const fs = require('fs')
// const _ = require('lodash')
// const folders = fs.readdirSync('./modules')
// const tsort = require('../tsort')
// const files = _.flatten(folders.map(folder => fs.readdirSync('./modules/' + folder).map(file => folder + '/' + file))).filter(f => !f.includes('.js'))
// const options = {sourceType: "module",  plugins: ['typescript']}
//
// function getDeps(ast) {
//     const body = ast.program.body;
//     const ExportDefaultDeclaration = body.find(t => t.type === 'ExportDefaultDeclaration')
//     const params = ExportDefaultDeclaration.declaration.params
//     if (!params) {
//         return []
//     }
//     return params.map(param => {
//         const typeAnnotation = param.typeAnnotation.typeAnnotation
//         return typeAnnotation.typeName.name === "Array" ? {name: typeAnnotation.typeParameters.params[0].typeName.name, type: "MULTI"} : {name: typeAnnotation.typeName.name, type: "SINGLE"}
//     })
// }
// const deps = files.map(f => {
//     const fileContent = fs.readFileSync(`./modules/${f}`, {encoding: 'UTF8'})
//     const ast = parser.parse(fileContent, options)
//     return {
//         deps: getDeps(ast),
//         file: f.replace('/', '-').replace('-index', '').replace('.ts', '')
//     }
// })
//
// const modules = _(deps).keyBy('file').mapValues(v => v.deps).value()
// function resolveAllDeepDependencies(deps) {
//     const allDeps = [...deps]
//     let modulesToLoad = deps
//     let innerDeps
//     while (!_.isEmpty(modulesToLoad)) {
//         innerDeps = _(modulesToLoad).map(m => modules[m] ? modules[m] : _.keys(modules).filter(mod => mod.includes(m))).flatten().uniq().filter(m => modules[m]).value()
//         modulesToLoad = [...innerDeps]
//         allDeps.push(...innerDeps)
//     }
//     return _(allDeps).flatten().uniq().filter(m => modules[m]).value()
// }
//
// // console.log(modules);
// // console.log(resolveAllModules([ 'UI', 'platformHandlers' ]))
// const modulesMetadata = _.mapValues(modules, (v, k) => ({deps: modules[k], allDeps: resolveAllDeepDependencies(v.map(v => v.name))}))
// console.log(modulesMetadata);
// // console.log(modulesAllDeps)
// const modulesAllDeps = _.mapValues(modulesMetadata, v => v.allDeps)
// const r = tsort(modulesAllDeps)
// console.log(r);
// // console.log(tsort(modules));
//
//
//
//
