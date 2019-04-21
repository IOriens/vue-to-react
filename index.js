const vueCompiler = require('vue-template-compiler')
const babel = require('@babel/core')
const types = require('@babel/types')
const parse = require('@babel/parser').parse
const generate = require('@babel/generator').default
const prettier = require('prettier')

const vueScriptParse = require('./lib/parse')
const genData = require('./lib/genData')

module.exports = (source, options) => {
  try {
    let sfc = vueCompiler.parseComponent(source)
    let scriptAst = parse(sfc.script.content, { sourceType: 'module' })
    let res = vueScriptParse(scriptAst)
    let state = generate(genData(res)).code

    return prettier.format(
      `import { createElement, Component, PropTypes } from 'React';
    import './index.css';

    export default class Mod extends Component {

      ${state}


      render() {

      }
    }`,
      { semi: false, parser: 'babel' }
    )
  } catch (e) {
    console.error(e)
  }
}
