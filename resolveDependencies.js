const parser = require('@babel/parser')
const fs = require('fs')
const _ = require('lodash')
const folders = fs.readdirSync('./modules')
const files = _.flatten(folders.map(folder => fs.readdirSync('./modules/' + folder).map(file => folder + '/' + file)))
const deps = files.map(f => {
    const fileContent = fs.readFileSync(`./modules/${f}`, {encoding: 'UTF8'})
    return {
        deps: parser.parse(fileContent, {sourceType: "module"}).program.body[0].declaration.params.map(p => p.name),
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

// console.log(modules);
// console.log(resolveAllModules([ 'UI', 'platformHandlers' ]))
console.log(_.mapValues(modules, v => resolveAllModules(v)));

// console.log(tsort(modules));




