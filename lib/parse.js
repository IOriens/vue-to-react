const traverse = require('@babel/traverse').default
const t = require('@babel/types')

const analysis = (body, data, isObject) => {
  data._statements = [].concat(body) // 整个表达式的AST值

  let propNodes = []
  if (isObject) {
    propNodes = body
  } else {
    body.forEach(child => {
      if (t.isReturnStatement(child)) {
        // return表达式的时候
        propNodes = child.argument.properties
        data._statements = [].concat(child.argument.properties) // 整个表达式的AST值
      }
    })
  }

  propNodes.forEach(propNode => {
    data[propNode.key.name] = propNode // 对data里的值进行提取，用于后续的属性取值
  })
}

const parse = ast => {
  let data = {}

  traverse(ast, {
    ObjectMethod (path) {
      /*
      对象方法
      data() {return {}}
      */
      const parent = path.parentPath.parent
      const name = path.node.key.name

      if (parent && t.isExportDefaultDeclaration(parent)) {
        if (name === 'data') {
          const body = path.node.body.body

          analysis(body, data)

          path.stop()
        }
      }
    },
    ObjectProperty (path) {
      /*
      对象属性，箭头函数
      data: () => {return {}}
      data: () => ({})
      */
      const parent = path.parentPath.parent
      const name = path.node.key.name

      if (parent && t.isExportDefaultDeclaration(parent)) {
        if (name === 'data') {
          const node = path.node.value

          if (t.isArrowFunctionExpression(node)) {
            /*
            箭头函数
            () => {return {}}
            () => {}
            */
            if (node.body.body) {
              analysis(node.body.body, data)
            } else if (node.body.properties) {
              analysis(node.body.properties, data, true)
            }
          }
          path.stop()
        }
      }
    }
  })

  /*
    最终得到的结果
    {
      _statements, //data解析AST值
      list //data.list解析AST值
    }
  */
  return {
    ast,
    data
  }
}

module.exports = parse
