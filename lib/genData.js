const t = require('@babel/types')

module.exports = script => {
  if (script.data && script.data._statements) {
    // classProperty 类属性 identifier 标识符 objectExpression 对象表达式
    return t.classProperty(
      t.identifier('state'),
      t.objectExpression(script.data._statements)
    )
  } else {
    return null
  }
}
