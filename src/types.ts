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

export type BlockElement = string | null | undefined | JSX.Element | JSX.Element[]