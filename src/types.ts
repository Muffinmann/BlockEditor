export type BlockType = (object & BlockNode)['type'] & 'Text' & 'Number' & 'Boolean'

export type BlockNode = {
  id: string,
  type: 'Category',
  name: string,
  children: BlockNode[]
} | {
  id: string,
  type: 'If' | 'StrictEqual' | 'NotEqual' | 'NotNull' | 'And' | 'Or' | 'GreaterThan' | 'SmallerThan' | 'Every' | 'Some' | 'Var' | 'Formular' | 'Boolean' | 'List' | 'Not',
  children: BlockNode[]
}
  | string | null | number | boolean

export type BlockUpdateAction = {
  type: 'remove',
  payload: {
    path: string,
    id: string,
  }
} | {
  type: 'add',
  payload: {
    path: string,
    blockNode: BlockNode,
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
  type: 'moveNode' | 'switchNode',
  payload: {
    from: string,
    to: string,
    fromId: string,
    toId: string,
  }
} | {
  type: 'sync',
  payload: BlockNode,
}

export type BlockElement = string | null | undefined | JSX.Element | JSX.Element[]