import { useEffect, useReducer } from 'react'
import { BlockDispatcherProvider } from './hooks/useBlockDispatcher'
import { BlockNode, BlockUpdateAction } from './types'
import './App.css'
import BlockRenderer from './components/BlockRenderer'
import testJSON from './config/test.json';
import parseExistingBlocks from './utils/parseExistingBlocks'
import recursiveUpdate, { buildBlockNodePath } from './utils/recursiveUpdate'
import blockNodeIsObject from './utils/blockNodeIsObject'


const updateBlockNode = (obj: BlockNode | BlockNode[], path: string[], value: string | number | boolean | string[] | number[]) => {
  return recursiveUpdate(obj, path, () => {
    return value
  }) 
}

const removeBlockNode = (obj: BlockNode | BlockNode[], path: string[], id: string) => {
  return recursiveUpdate(obj, path, (node) => {
    if (blockNodeIsObject(node) && (node.id === id)) {
      return null
    }
    return node
  }) 
}

const addBlockNode = (obj: BlockNode | BlockNode[], path: string[], newBlockNode: BlockNode) => {
  return recursiveUpdate(obj, path, (obj) => {
    if (blockNodeIsObject(obj)) {
      const children = obj.children.filter((c) => c !== undefined || c !== null)

      const nodeIsDuplicated = children.findIndex((c) => blockNodeIsObject(c) && blockNodeIsObject(newBlockNode) && c.id === newBlockNode.id) > -1
      if (nodeIsDuplicated) {
        return obj;
      }

      children.push(newBlockNode)

      return {
        ...obj,
        children
      }
    }
    return obj
  }) as BlockNode
}

const moveBlockNode = (obj: BlockNode | BlockNode[], {from, to, fromId, toId}: (BlockUpdateAction & {type: 'moveNode'})['payload']) => {
  const fromNode = buildBlockNodePath(obj, from).pop()
  const toNode = buildBlockNodePath(obj, to).pop()
  if (blockNodeIsObject(fromNode) && blockNodeIsObject(toNode)) {
    if (fromNode.id !== fromId || toNode.id !== toId) {
      console.log('Inconsistent update: node id does not match')
      return obj
    }
    const removed = removeBlockNode(obj, from.split('.'), fromId)
    return addBlockNode(removed, to.split('.'), fromNode)
  }
  return obj
}

const switchBlockNode = (obj: BlockNode | BlockNode[], {from, to, fromId, toId}: (BlockUpdateAction & {type: 'switchNode'})['payload']) => {
  const fromNode = buildBlockNodePath(obj, from).pop()
  const toNode = buildBlockNodePath(obj, to).pop()

  if (blockNodeIsObject(fromNode) && blockNodeIsObject(toNode)) {
    if (fromNode.id !== fromId || toNode.id !== toId) {
      console.log('Inconsistent update: node id does not match')
      return obj
    }

    const updated = recursiveUpdate(obj, from.split('.'), () => toNode)
    return recursiveUpdate(updated, to.split('.'), () => fromNode)
  }
  return obj
}


const reducer = (state: BlockNode | BlockNode[], action: BlockUpdateAction) => {
  console.log("running reducer", action)
  if (action.type === 'sync') {
    return action.payload
  }
  if (action.type === 'remove') {
    return removeBlockNode(state, action.payload.path.split('.'), action.payload.id)
  }
  if (action.type === 'add') {
    return addBlockNode(state, action.payload.path.split('.'), action.payload.blockNode)
  }
  if (action.type === 'updateValue') {
    return updateBlockNode(state, action.payload.path.split('.'), action.payload.nextValue)
  }
  if (action.type === 'updateNode') {
    return recursiveUpdate(state, action.payload.path.split('.'), action.payload.callback) as BlockNode
  }
  if (action.type === 'moveNode') {
    return moveBlockNode(state, action.payload)
  }
  if (action.type === 'switchNode') {
    return switchBlockNode(state, action.payload)
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
        payload: JSON.parse(e.newValue as string) as BlockNode
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
