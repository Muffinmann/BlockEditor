export type BlockType = (object & BlockNode)['type']

export type BlockNode = {
  type: 'Category',
  name: string,
  children: BlockNode[]
} | {
  type: 'If' | 'StrictEqual' | 'NotEqual' | 'NotNull' | 'And' | 'Or' | 'GreaterThan' | 'SmallerThan',
  children: BlockNode[],
} | {
  type: 'Var',
  value: string,
} | {
  type: "List",
  value: string[] | number[]
}
| string 


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
    nextValue: string | string[] | number[],
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