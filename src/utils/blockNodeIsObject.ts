import { BlockNode } from "../types";

export default (obj: unknown): obj is object & BlockNode => {
  return obj !== null && typeof obj === 'object' && 'type' in obj
}