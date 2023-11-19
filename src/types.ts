export type BlockType = (object & BlockNode)['type']

export type BlockNode = {
  type: 'Category',
  name: string,
  children: BlockNode[]
} | {
  type: 'If' | 'StrictEqual',
  children: BlockNode[],
} | {
  type: 'Var',
  value: string,
} | string 


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
    nextValue: string,
  }
} | {
  type: 'updateNode',
  payload: {
    path: string,
    callback: (n: BlockNode | BlockNode[]) => BlockNode | BlockNode[]
  }
}

export type BlockElement = string | null | undefined | JSX.Element | JSX.Element[]