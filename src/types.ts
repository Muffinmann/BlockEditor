export type BlockType = (object & BlockNode)['type'] & 'Text' & 'Number' & 'Boolean'

export type BlockNode = {
  type: 'Category',
  name: string,
  children: BlockNode[]
} | {
  type: 'If' | 'StrictEqual' | 'NotEqual' | 'NotNull' | 'And' | 'Or' | 'GreaterThan' | 'SmallerThan' | 'Every' | 'Some'| 'Var' | 'Formular' | 'Boolean' | 'List' | 'Not',
  children: BlockNode[]
}
| string | null | number | boolean

export type BlockUpdateAction = {
  type: 'remove',
  payload: string,
} | {
  type: 'add',
  payload: {
    path: string,
    blockType: BlockType,
  }
} | {
  type: 'updateValue',
  payload: {
    path: string,
    nextValue: string | number | boolean | string[] | number[],
  }
} | {
  type: 'updateNode',
  payload: {
    path: string,
    callback: (n: BlockNode | BlockNode[]) => BlockNode | BlockNode[]
  }
} | {
  type: 'nodePath',
  payload: {
    from: string,
    to: string,
  }
} | {
  type: 'sync',
  payload: BlockNode,
}

export type BlockElement = string | null | undefined | JSX.Element | JSX.Element[]