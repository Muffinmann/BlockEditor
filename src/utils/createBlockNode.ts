import { BlockType, BlockNode } from "../types";
import uuidv4 from "./uuid";

const createBlockNode = (type: BlockType): BlockNode => {
  switch (type) {
  case 'Text':
    return '';

  case 'Number':
    return NaN;
  case 'Boolean':
    return false;
  case 'Formula':
  case 'Var':
    return {
      type,
      id: uuidv4(),
      children: ['']
    };
  case 'Category':
    return {
      name: '',
      type,
      id: uuidv4(),
      children: []
    }
    // case 'List':
    //   return {
    //     type,
    //     value: []
    //   }
    // case 'Boolean':
    //   return {
    //     type,
    //     value: '',
    //   }
  default:
    return {
      type,
      id: uuidv4(),
      children: []
    }
  }
}

export default createBlockNode