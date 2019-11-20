const parser = require('@babel/parser')
const fs = require('fs')
const _ = require('lodash')
const folders = fs.readdirSync('./modules')
const files = _.flatten(folders.map(folder => fs.readdirSync('./modules/' + folder).map(file => folder + '/' + file))).filter(f => !f.includes('.js'))
const options = {sourceType: "module",  plugins: ['typescript']}

const allContent = files.map(f => {
    const fileContent = fs.readFileSync(`./modules/${f}`, {encoding: 'UTF8'})
    return {
        content : parser.parse(fileContent, options),
        file: f.replace('/', '-').replace('-index', '').replace('.ts', '')
    }
})

// fs.writeFileSync('content.json', JSON.stringify(allContent))
// console.log(allContent);

function getDeps(ast) {
    const body = ast.program.body;
    const ExportDefaultDeclaration = body.find(t => t.type === 'ExportDefaultDeclaration')
    const params = ExportDefaultDeclaration.declaration.params
    if (!params) {
        return []
    }
    return params.map(param => {
        const typeAnnotation = param.typeAnnotation.typeAnnotation
        return typeAnnotation.typeName.name === "Array" ? {name: typeAnnotation.typeParameters.params[0].typeName.name, type: "MULTI"} : {name: typeAnnotation.typeName.name, type: "SINGLE"}
    })
}
const deps = files.map(f => {
    const fileContent = fs.readFileSync(`./modules/${f}`, {encoding: 'UTF8'})
    return {
        deps: getDeps(parser.parse(fileContent, options)),
        file: f.replace('/', '-').replace('-index', '').replace('.ts', '')
    }
})

const modules = _(deps).keyBy('file').mapValues(v => v.deps).value()
function resolveAllModules(deps) {
    const allDeps = [...deps]
    let modulesToLoad = deps
    let innerDeps
    while (!_.isEmpty(modulesToLoad)) {
        innerDeps = _(modulesToLoad).map(m => modules[m] ? modules[m] : _.keys(modules).filter(mod => mod.includes(m))).flatten().uniq().filter(m => modules[m]).value()
        modulesToLoad = [...innerDeps]
        allDeps.push(...innerDeps)
    }
    return _(allDeps).flatten().uniq().filter(m => modules[m]).value()
}

console.log(modules);
// console.log(resolveAllModules([ 'UI', 'platformHandlers' ]))
console.log(_.mapValues(modules, (v, k) => ({deps: modules[k], allDeps: resolveAllModules(v.map(v => v.name))})))

// console.log(tsort(modules));




