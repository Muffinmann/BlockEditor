
import { BlockNode } from "../types";
import uuidv4 from "./uuid";

const AVAILABLE_OPERATORS = {
  '+': 'Plus',
  '-': 'Minus',
  '*': 'Multiply',
  '/': 'Divide',
  '!': 'Not',
  '!!': 'NotNull',
  '===': 'StrictEqual',
  '!==': 'NotEqual',
  '<': 'SmallerThan',
  '>': 'GreaterThan',
  // '||': 'Fallback',
  // 'max': 'Max',
  // 'min': 'Min',
  'some': 'Some',
  'every': 'Every',
  'if': 'If',
  'and': 'And',
  'or': 'Or',
  'var': 'Var',
} as const;


type Operator = keyof typeof AVAILABLE_OPERATORS
type Operand = string | number | boolean | null | Logic;
type Logic = {
  [K in keyof typeof AVAILABLE_OPERATORS]?: Operand | Operand[]
} & {
  some?: [Operand[], Logic]
  if?: Operand[]
  var?: string
  and?: Operand[]
  or?: Operand[]
  every?: [Operand[], Logic]
};

const hasAvailableOperator = (val: unknown): val is Operator => {
  return typeof val === 'string' && Object.keys(AVAILABLE_OPERATORS).includes(val);
}

export const isLogic = (val: unknown): val is Logic => (typeof val === 'object'
  && !Array.isArray(val)
  && val !== null
  && val !== undefined
  && Object.keys(val).length === 1)
  && hasAvailableOperator(Object.keys(val)[0]);


const parseExistingBlocks = (input: unknown): BlockNode | BlockNode[] => {
  // console.log({ input, type: typeof input })
  if (input === undefined || input === null || Number.isNaN(input)) {
    return null;
  }

  if (typeof input === 'boolean' || typeof input === 'number' || typeof input === 'string') {
    return input
  }

  if (Object.keys(input).length === 0) {
    return null
  }

  if (isLogic(input)) {
    const type = AVAILABLE_OPERATORS[Object.keys(input)[0] as Operator]
    if (type !== 'Plus' && type !== 'Minus' && type !== 'Multiply' && type !== 'Divide') {
      const children = Object.values((child: any) => parseExistingBlocks(child)) as BlockNode[]
      return {
        id: uuidv4(),
        type,
        children,
      }
    }
  }



  if (Array.isArray(input)) {
    if (input.length > 1 && input.every((i) => typeof i === 'string')) {
      return {
        id: uuidv4(),
        type: 'List',
        children: input as BlockNode[]
      }
    }

    return input.map((i) => parseExistingBlocks(i)) as BlockNode[]
  }

  if (Object.keys(input).length > 1) {
    return Object.entries(input).map(([key, val]) => {
      const childNodes = parseExistingBlocks(val)
      return {
        type: 'Category',
        id: uuidv4(),
        name: key,
        children: Array.isArray(childNodes) ? childNodes : [childNodes]
      }
    })
  }

  return {
    type: 'Category',
    id: uuidv4(),
    name: Object.keys(input)[0],
    children: Object.values(input).map(parseExistingBlocks) as BlockNode[]
  }

}

export default parseExistingBlocks