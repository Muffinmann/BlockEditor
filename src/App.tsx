import { ChangeEvent, useEffect, useReducer } from 'react'
import { BlockDispatcherProvider } from './hooks/useBlockDispatcher'
import { BlockNode, BlockUpdateAction, CommonPrimitive } from './types'
import './App.css'
import BlockRenderer from './components/BlockRenderer'
import testJSON from './config/test.json';
import parseExistingBlocks from './utils/parseExistingBlocks'
import recursiveUpdate, { buildBlockNodePath } from './utils/recursiveUpdate'
import blockNodeIsObject from './utils/blockNodeIsObject'
import Toolbar from './components/Toolbar'
import parse from 'arithmetic2json'


const updateBlockNode = (obj: BlockNode | BlockNode[], path: string[], value: string | number | boolean | string[] | number[] | BlockNode) => {
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

    const updated = updateBlockNode(obj, from.split('.'), toNode)
    return updateBlockNode(updated, to.split('.'), fromNode)
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

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const fr = new FileReader()
      fr.readAsText(file, 'utf-8')
      fr.onload = (e) => {
        console.log("loaded", e)
        if (e.target?.result){
          dispatch({
            type: 'sync',
            payload: parseExistingBlocks(
              JSON.parse(e.target.result as string)
            ) as BlockNode
          })
        }
      }
      console.log(file, file.type)
    }
  }

  const transformTree = (node: BlockNode | BlockNode[]): Record<string, any> | CommonPrimitive => {
    if (Array.isArray(node)) {
      const nonNullNodes = node.filter((n) => n !== null)
      return nonNullNodes.flatMap(transformTree) as (Record<string, any> | CommonPrimitive)[]
    }

    if (node !== null && typeof node === 'object') {
      if (node.type === 'Category') {
        const transformedChildren = transformTree(node.children)
        if (Array.isArray(transformedChildren) 
            && transformedChildren.every((child) => child !== null && typeof child === 'object')){
          return {
            [node.name] :transformedChildren.reduce((prev: object, crr: object) => {
              return {
                ...prev,
                ...crr
              }
            }, {}) as Record<string, any> }
        }
        return {
          [node.name]: transformedChildren
        }
      }
      if (node.type === 'Formula') {
        console.log("Parsing Formula", node)
        const content = node.children[0] as string
        return (content ? parse(content) : '') as Record<string, any>
      }
      if (node.type === 'List') {
        return node.children
      }
      return {
        [node.type]: transformTree(node.children)
      }
    }
    return node
  }

  const handleDownload = () => {
    const data = transformTree(tree) || {}
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)])) 
    a.setAttribute('download', 'data.json')
    a.click()
    console.log('start transform', tree)
    console.log('transform result:', transformTree(tree))
  }


  return (
    <main>
      <Toolbar onUpload={handleUpload} onDownload={handleDownload} />
      <BlockDispatcherProvider dispatch={dispatch}>
        <BlockRenderer path='root' node={tree} />
      </BlockDispatcherProvider>
    </main>
  )
}

export default App
