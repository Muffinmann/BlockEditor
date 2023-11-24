import { Children, useReducer } from 'react'
import { BlockDispatcherProvider } from './hooks/useBlockDispatcher'
import { BlockNode, BlockType, BlockUpdateAction } from './types'
import './App.css'
import BlockRenderer from './components/BlockRenderer'


const testTree: BlockNode = {
  type: 'Category',
  name: 'Root',
  children: [
    {
      type: 'Category',
      name: 'Sub 1',
      children: [    {
        type: 'If',
        children: [
          {
            type: "StrictEqual",
            children: [
              {
                type: 'Var',
                value: 'test_field_key'
              },
              'test_value'
            ]
          },
          'correct',
          'wrong',
        ]
      }],
    },
    {
      type: 'Category',
      name: 'Sub 2',
      children: [    ],
    },
  ]
}



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

  if (currentSeg === '') { // empty string means the root object
    return recursiveUpdate(obj, path, onReachTarget)
  }

  if (typeof obj === 'string') {
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

const updateBlockNode = (obj: BlockNode, path: string[], value: string) => {
  return recursiveUpdate(obj, path, (obj) => {
    if (typeof obj === "string") {
      return value
    }
    if (typeof obj === 'object') {
      if ('value' in obj) {
        return {
          ...obj,
          value
        }
      }
    }
    return obj
  }) as BlockNode
}
const removeBlockNode = (obj: BlockNode, path: string[]) => {
  return recursiveUpdate(obj, path, () => null) as BlockNode
}

const createBlockNode = (type: BlockType): BlockNode => {
  switch(type) {
  case 'Var':
    return {
      type,
      value: ""
    }
  case 'Category':
    return {
      name: '',
      type,
      children: []
    }
  case 'If':
  case 'StrictEqual':
  default:
    return {
      type,
      children: []
    }
  }
}
const addBlockNode = (obj: BlockNode, path: string[], newBlockType: BlockType) => {
  return recursiveUpdate(obj, path, (obj) => {
    if (typeof obj === 'object' && 'children' in obj) {
      return {
        ...obj,
        children: [...obj.children, createBlockNode(newBlockType)]
      }
    }
    return obj
  }) as BlockNode
}

const reducer = (state: BlockNode, action: BlockUpdateAction) => {
  console.count("running reducer")
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
    } )

    const updated = recursiveUpdate(state, action.payload.to.split('.'), (toNode) => {
      if (typeof toNode === 'object' && 'children' in toNode) {
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
    } ) as BlockNode
  }
  return state
}

function App() {
  const [tree, dispatch] = useReducer(reducer, testTree)
  console.log({tree})
  return (
    <main>
      <BlockDispatcherProvider dispatch={dispatch}>
        <BlockRenderer path='' node={tree} />
      </BlockDispatcherProvider>
    </main>
  )
}

export default App
