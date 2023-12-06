import { useEffect, useReducer } from 'react'
import { BlockDispatcherProvider } from './hooks/useBlockDispatcher'
import { BlockNode, BlockType, BlockUpdateAction } from './types'
import './App.css'
import BlockRenderer from './components/BlockRenderer'
import testJSON from './config/test.json';
import parseExistingBlocks from './utils/parseExistingBlocks'


const recursiveUpdate = (obj: BlockNode | BlockNode[], path: string[], onReachTarget: (t: BlockNode | BlockNode[]) => BlockNode | BlockNode[] | null): null | BlockNode | BlockNode[] | BlockNode[keyof BlockNode] => {
  if (!path) {
    console.error("Expected 'path' argument to be type 'string[]', got 'undefined'.")
    return obj;
  }

  if (!path.length) {
    return onReachTarget(obj)
  }

  const currentSeg = path.shift()

  if (currentSeg === undefined) {
    console.error("Path segment is undefined")
    return obj
  }

  if (currentSeg === 'root') {
    return recursiveUpdate(obj, path, onReachTarget)
  }

  if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
    return obj;
  }

  if (obj === null) {
    return obj;
  }
  if (Array.isArray(obj)) {
    // If obj is an array, update it without converting to an object
    const updatedArray = obj.map((o, index) => {
      const i = parseInt(currentSeg, 10)
      if (index === i) {
        return recursiveUpdate(obj[i], path, onReachTarget)
      }
      return o
    })

    // return updatedArray.filter(Boolean) as BlockNode[];
    return updatedArray as BlockNode[];
  }


  return {
    ...obj,
    [currentSeg]: recursiveUpdate(obj[currentSeg as keyof BlockNode], path, onReachTarget)
  } as BlockNode;

}

const updateBlockNode = (obj: BlockNode | BlockNode[], path: string[], value: string | number | boolean | string[] | number[]) => {
  return recursiveUpdate(obj, path, (obj) => {
    return value
    // if (typeof obj === "string" && typeof value === 'string') {
    //   return value
    // }
    // if (obj !== null && typeof obj === 'object') {
    //   if ('value' in obj) {
    //     return {
    //       ...obj,
    //       value
    //     } as BlockNode
    //   }
    // }
    // return obj
  }) as BlockNode
}

const removeBlockNode = (obj: BlockNode | BlockNode[], path: string[]) => {
  return recursiveUpdate(obj, path, () => null) as BlockNode
}

const createBlockNode = (type: BlockType): BlockNode => {
  switch (type) {
    case 'Text':
      return '';

    case 'Number':
      return NaN;
    case 'Boolean':
      return false;
    case 'Var':
      return {
        type,
        children: ['']
      };
    case 'Category':
      return {
        name: '',
        type,
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
        children: []
      }
  }
}
const addBlockNode = (obj: BlockNode | BlockNode[], path: string[], newBlockType: BlockType) => {
  return recursiveUpdate(obj, path, (obj) => {
    if (obj !== null && typeof obj === 'object' && 'children' in obj) {
      // const emptySlotIndex = obj.children.indexOf(null)
      let children = obj.children.filter(Boolean)
      children.push(createBlockNode(newBlockType))
      // if (emptySlotIndex > -1) {
      //  children[emptySlotIndex] = createBlockNode(newBlockType) 
      // } else {
      // }
      return {
        ...obj,
        children
      }
    }
    return obj
  }) as BlockNode
}

const reducer = (state: BlockNode | BlockNode[], action: BlockUpdateAction) => {
  console.count("running reducer")
  if (action.type === 'sync') {
    return action.payload
  }
  if (action.type === 'remove') {
    return removeBlockNode(state, action.payload.split('.'))
  }
  if (action.type === 'add') {
    return addBlockNode(state, action.payload.path.split('.'), action.payload.blockType)
  }
  if (action.type === 'updateValue') {
    return updateBlockNode(state, action.payload.path.split('.'), action.payload.nextValue)
  }
  if (action.type === 'updateNode') {
    return recursiveUpdate(state, action.payload.path.split('.'), action.payload.callback) as BlockNode
  }
  if (action.type === 'nodePath') {
    let source: BlockNode
    let destination: BlockNode | null = null
    // get the source node
    recursiveUpdate(state, action.payload.from.split('.'), (fromNode) => {
      source = fromNode as BlockNode
      return fromNode
    })

    const updated = recursiveUpdate(state, action.payload.to.split('.'), (toNode) => {
      if (toNode !== null && typeof toNode === 'object' && 'children' in toNode) {
        const childrenHasEmptySlot = toNode.children.findIndex((child) => child === undefined || child === null) > -1
        if (childrenHasEmptySlot) {
          toNode.children = toNode.children.map((child) => (child === undefined || child === null) ? source : child)
        } else {
          toNode.children.push(source)
        }
        return toNode
      }
      destination = toNode as BlockNode
      return source
    }) as BlockNode

    return recursiveUpdate(updated, action.payload.from.split('.'), () => {
      return destination
    }) as BlockNode
  }
  return state
}

function App() {
  const [tree, dispatch] = useReducer(reducer, parseExistingBlocks(testJSON), (arg) => {
    const currentData = localStorage.getItem('block-data')
    if (currentData) {
      return JSON.parse(currentData) as BlockNode
    }
    return arg
  })

  console.log(tree)
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      dispatch({
        type: 'sync',
        payload: JSON.parse(e.newValue as string)
      })
    }
    window.addEventListener('storage', handleStorage)
    return () => {
      window.removeEventListener('storage', handleStorage)
    }
  }, [])


  useEffect(() => {
    if (tree) {
      localStorage.setItem('block-data', JSON.stringify(tree))
    }
  }, [tree])


  return (
    <main>
      <BlockDispatcherProvider dispatch={dispatch}>
        <BlockRenderer path='root' node={tree} />
      </BlockDispatcherProvider>
    </main>
  )
}

export default App
