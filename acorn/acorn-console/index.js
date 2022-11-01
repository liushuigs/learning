const {Parser} = require("acorn")
const walk = require("acorn-walk")
const escodegen = require('escodegen')

const RunJSParser = Parser.extend()
const code = `
"use strict;"
const limit = 15;
let count = 1;xxyyy
[12, 34].map(t => t * 2)
count
`

function addConsoleLog(ast) {
  for(let i = 0; i < ast.body.length; i++) {
    const node = ast.body[i]
    if (node.type === 'ExpressionStatement') {
      const {object, property} = node.expression.callee || {object: {}, property: {}}
      const isConsole = object.name === 'console' && property.name === 'log'
      if (isConsole) {
        continue
      }
      const {type, value} = node.expression || {}
      const isUseStrict = type === 'Literal' && (value === 'use strict' || value === 'use strict;')
      if (isUseStrict) {
        continue
      }
      node.expression = {
        type: 'CallExpression',
        callee: {
          "type": "MemberExpression",
          "start": 34,
          "end": 45,
          "object": {
            "type": "Identifier",
            "start": 34,
            "end": 41,
            "name": "console"
          },
          "property": {
            "type": "Identifier",
            "start": 42,
            "end": 45,
            "name": "log"
          },
          "computed": false,
          "optional": false
        },
        arguments: [node.expression]
      }
    }
  }
}

const nodes = RunJSParser.parse(code, {})
console.log(JSON.stringify(nodes))
nodes.start = 10
addConsoleLog(nodes)
console.log(escodegen.generate(nodes))
walk.simple(nodes, {
  Literal(node) {
    console.log(node)
  }
})