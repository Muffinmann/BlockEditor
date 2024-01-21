import parse from "arithmetic2json"
import { BlockNode, CommonPrimitive } from "../types"


const OPERATOR_REMAP = {
  'Plus': '+',
  'Minus': '-',
  'Multiply': '*',
  'Divide': '/',
  'Not': '!',
  'NotNull': '!!',
  'StrictEqual': '===',
  'NotEqual': '!==',
  'SmallerThan': '<',
  'GreaterThan': '>',
  'Fallback': '||',
  'Max': 'max',
  'Min': 'min',
  'Some': 'some',
  'Every': 'every',
  'If': 'if',
  'And': 'and',
  'Or': 'or',
  'Var': 'var',
} as const;


const transformTree = (node: BlockNode | BlockNode[]): Record<string, any> | CommonPrimitive => {
  if (Array.isArray(node)) {
    const nonNullNodes = node.filter((n) => n !== null)
    return nonNullNodes.flatMap(transformTree) as Array<Record<string, any> | CommonPrimitive>
  }

  if (node !== null && typeof node === 'object') {
    if (node.type === 'Category') {
      const transformedChildren = transformTree(node.children)
      if (Array.isArray(transformedChildren) 
            && transformedChildren.every((child) => child !== null && typeof child === 'object')){
        return {
          [node.name] :transformedChildren.reduce((prev: object, crr: object) => {
            return {
              ...prev,
              ...crr
            }
          }, {}) as Record<string, any> }
      }
      return {
        [node.name]: transformedChildren
      }
    }
    if (node.type === 'Formula') {
      console.log("Parsing Formula", node)
      const content = node.children[0] as string
      return (content ? parse(content) : '') as Record<string, any>
    }
    if (node.type === 'List') {
      return node.children
    }

    const name = OPERATOR_REMAP[node.type as keyof typeof OPERATOR_REMAP] || 'unknownOperator' 
    return {
      [name]: transformTree(node.children)
    }
  }
  return node
}


export default transformTree