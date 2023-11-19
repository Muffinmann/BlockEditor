import { ChangeEvent, useReducer } from 'react'
import { BlockDispatcherProvider, useBlockDispatcher } from './hooks/useBlockDispatcher'
import { BlockNode } from './types'
import './App.css'
import BasicBlock from './components/BasicBlock'
import Input from './components/Input'
import CategoryBlock from './components/CategoryBlock'


const testTree: BlockNode = {
  type: 'Category',
  name: 'Root',
  children: [
    {
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
    }
  ]
}

const BlockRenderer = ({ node, path = 'root' }: { node: BlockNode, path: string }) => {
  const dispatch = useBlockDispatcher()
  const handleAdd = (type: string) => {
    dispatch({
      type: 'add',
      payload: {
        path,
        blockType: type
      }
    })
  }
  const handleRemove = () => {
    dispatch({
      type: 'remove',
      payload: path,
    })
  }
  const handleValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    dispatch({
      type: 'updateValue',
      payload: {
        path,
        nextValue:value
      }
    })
  }

  const handleNameChange = (name: string) => {
    dispatch({
      type: 'updateNode',
      payload: {
        path,
        callback:(node) => {
          console.log("update node", node)
          if (typeof node === 'object' && ('name' in node)) {
            return {
              ...node,
              name
            }
          }
        }
      }
    })
  }
  if (!node) return null;
  if (typeof node === 'string') {
    // return <InputBlock path={path} value={node} />
    return (
      <BasicBlock displayName="Text" disableAdd onRemove={handleRemove}>
        <Input value={node} onChange={handleValueChange} />
      </BasicBlock>)
  } 
  if (node.type === 'Category') {
    return (
      <CategoryBlock displayName={node.name} onAdd={handleAdd} onRemove={handleRemove} onNameChange={handleNameChange}>
        {node.children.map((child, i) => <BlockRenderer key={i} node={child} path={`${path}.children.${i}`} />)}
      </CategoryBlock>
    )
  }
  if (node.type === 'If') {
    return (
      <BasicBlock onRemove={handleRemove} displayName="If" >
        <BasicBlock disableAdd={Boolean(node.children[0])} onAdd={handleAdd} disableRemove displayName="Evaluation" className="evaluation-block">
          <BlockRenderer path={`${path}.children.0`} node={node.children[0]} />
        </BasicBlock>
        <BasicBlock disableAdd={Boolean(node.children[1])} onAdd={handleAdd} disableRemove displayName="Truthy" className="truthy-block">
          <BlockRenderer path={`${path}.children.1`} node={node.children[1]} />
        </BasicBlock>
        <BasicBlock disableAdd={Boolean(node.children[2])} onAdd={handleAdd} disableRemove displayName="Falsy" className="falsy-block">
          <BlockRenderer path={`${path}.children.2`} node={node.children[2]} />
        </BasicBlock>
      </BasicBlock>
    )
  }
  if (node.type === "Var") {
    return (
      <BasicBlock disableAdd displayName="Variable" onRemove={handleRemove} >
        <Input value={node.value} onChange={handleValueChange} />
      </BasicBlock>
    )
  }
  if (node.type === 'StrictEqual') {
    return (
      <BasicBlock displayName="Strict Equal (===)" disableAdd={node.children.length > 1}  onAdd={handleAdd} onRemove={handleRemove} >
        {node.children.map((child, i) => <BlockRenderer key={i} node={child} path={`${path}.children.${i}`} />)}
      </BasicBlock>
    )
  }
}

type BlockUpdateAction = {
  type: 'remove',
  payload: string,
} | {
  type: 'add',
  payload: {
    path: string,
    blockType: string,
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
    callback: (n: BlockNode) => BlockNode
  }
}
const recursiveUpdate = (obj: BlockNode, path: string[], onReachTarget: (t: BlockNode) => BlockNode): BlockNode | BlockNode[] | BlockNode[keyof BlockNode] => {
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

  if (Array.isArray(obj)) {
    // If obj is an array, update it without converting to an object
    const updatedArray = [...obj] as BlockNode[]; 
    updatedArray[currentSeg] = recursiveUpdate(obj[currentSeg], path, onReachTarget);
    return updatedArray.filter(Boolean);
  } else {
    // If obj is not an array, proceed as before
    obj[currentSeg] = recursiveUpdate(obj[currentSeg], path, onReachTarget);
    return Object.assign({}, obj);
  }
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
  })
}
const removeBlockNode = (obj: BlockNode, path: string[]) => {
  return recursiveUpdate(obj, path, () => null)
}
const createBlockNode = (type: string) => {
  if (type === "Var") {
    return {
      type,
      value: ""
    }
  }
  return {
    type,
    children: []
  }
}
const addBlockNode = (obj: BlockNode, path: string[], newBlockType: string) => {
  return recursiveUpdate(obj, path, (obj) => {
    if (typeof obj === 'object' && 'children' in obj) {
      return {
        ...obj,
        children: [...obj.children, createBlockNode(newBlockType)]
      }
    }
  })
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
    return recursiveUpdate(state, action.payload.path.split('.'), action.payload.callback)
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
