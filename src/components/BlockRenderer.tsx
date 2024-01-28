import { ChangeEvent, DragEventHandler, createContext, useContext, useState } from "react"
import { useBlockDispatcher } from "../hooks/useBlockDispatcher"
import { BlockNode, BlockType } from "../types"
import BasicBlock from "./BasicBlock"
import CategoryBlock from "./CategoryBlock"
import Input from "./Input"
import BLOCK_DEFINITIONS from '../config/blockDefinitions.json'
import createBlockNode from "../utils/createBlockNode"
import { KeywordsContext } from "../App"
import PopupList from "./PopupList"


const KeyInput = ({node, path}: {node: string, path: string}) => {
  const [localValue = node, setLocalValue] = useState<string | undefined>();
  const [isFocused, setIsFocused] = useState(false)
  const dispatch = useBlockDispatcher() 
  const keywordsTrie = useContext(KeywordsContext)
 
  const handleLocalChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setLocalValue(val)
  }
  
  const handleValueChange = (value: string) => {
    dispatch({
      type: 'updateValue',
      payload: {
        path,
        nextValue: value
      }
    })
    setIsFocused(false)
    setLocalValue(value)
  }

  const possibleKeys = keywordsTrie.search(localValue || '') as string[]

  return (
    <div className="relative">
      <Input value={localValue} onFocus={() => setIsFocused(true)}  onChange={handleLocalChange} placeholder="Enter text" />
      {
        localValue?.length && isFocused
          ? <PopupList onClick={handleValueChange} options={possibleKeys.map((k) => ({displayName: k, value: k}))} />
          : null
      }
    </div>)
}

const ArrayBlock = ({nodes, path}: {nodes: BlockNode[], path: string}) => {
  return nodes.map((n, i) => (
    <BlockRenderer key={i} node={n} path={`${path}.${i}`} />
  ))
}

const PrimitiveBlock = ({node, path}: {node: string | number | boolean, path: string}) => {
  const dispatch = useBlockDispatcher()
  const handleValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value: string | boolean | number = e.target.value
    if (value === 'true' || value === 'false') {
      value = Boolean(value === 'true')
    }
    if (!Number.isNaN(e.target.valueAsNumber)) {
      value = e.target.valueAsNumber
    }
    dispatch({
      type: 'updateValue',
      payload: {
        path,
        nextValue: value
      }
    })
  }

  if (typeof node === 'string') {
    return <Input value={node} onChange={handleValueChange} placeholder="Enter text" />
  }
  if (typeof node === 'number') {
    return <Input type="number" value={node} onChange={handleValueChange} placeholder="Enter number" />
  }

  if (typeof node === 'boolean') {
    return (
      <div>
        <label>
            true
          <Input type="radio" value="true" checked={node} onChange={handleValueChange} />
        </label>
        <label>
            false
          <Input type="radio" value="false" checked={!node} onChange={handleValueChange} />
        </label>
      </div>
    )
  }
 
  return null;
}

const RecursiveBlock = ({node, path}: {node: BlockNode & object, path: string}) => {
  const dispatch = useBlockDispatcher()

  const handleAdd = (type: BlockType) => {
    dispatch({
      type: 'add',
      payload: {
        path,
        blockNode: createBlockNode(type)
      }
    })
  }

  const handleRemove = (p?: string) => {
    dispatch({
      type: 'remove',
      payload: {
        path: p || path,
        id: node.id,
      },
    })
  }


  const handleArrayChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value.split(',').map((str) => str.trim())
    dispatch({
      type: 'updateValue',
      payload: {
        path: `${path}.children`,
        nextValue: value
      }
    })

  }

  const handleNameChange = (name: string) => {
    dispatch({
      type: 'updateNode',
      payload: {
        path,
        callback: (node) => {
          console.log("update node", node)
          if (node && typeof node === 'object' && ('name' in node)) {
            return {
              ...node,
              name
            }
          }
          return node
        }
      }
    })
  }

  const handleDragStart: DragEventHandler<HTMLDivElement> = (ev) => {
    ev.dataTransfer.setData('text/plain', path.concat('#', node.id))
  }
  const handleDrop: DragEventHandler<HTMLDivElement> = (ev) => {
    const fromPathWithId = ev.dataTransfer.getData('text/plain').split('#')
    const fromPath = fromPathWithId[0]
    const fromId = fromPathWithId[1]
    if (fromPath === path || fromPath === 'root') {
      return;
    }
    dispatch({
      type: ev.ctrlKey ? 'switchNode' : 'moveNode',
      payload: {
        from: fromPath,
        fromId,
        to: path,
        toId: node.id
      }
    })
    console.log(`MOVE FROM [${fromPath}#${fromId}] TO [${path}#${node.id}]`)
  }
 
  if (node.type === 'Var') {
    return (
      <BasicBlock displayName="Var">
        <KeyInput node={node.children[0] as string } path={`${path}.children.0`} />
      </BasicBlock>
    )
  }

  if (node.type === 'Category') {
    return (
      <CategoryBlock displayName={node.name} onAdd={handleAdd} onRemove={handleRemove} onNameChange={handleNameChange} onDragStart={handleDragStart} onDrop={handleDrop}>
        {node.children.map((child, i) => <BlockRenderer key={i} node={child} path={`${path}.children.${i}`} />)}
      </CategoryBlock>
    )
  }

  if (node.type === 'If') {
    return (
      <BasicBlock onAdd={handleAdd} onRemove={handleRemove} displayName="If" onDragStart={handleDragStart} onDrop={handleDrop}>
        {node.children.map((child, i) => child !== null ? (
          <BasicBlock
            key={i} 
            disableAdd 
            disableDrag 
            allowDragPropagation 
            onRemove={() => handleRemove(`${path}.children.${i}`)}
            displayName={i === 0 ? "Evaluation" : i % 2 === 1 ? "Then" : "Else"}
            className={i === 0 ? "evaluation-block" : i === 1 ? "truthy-block" : "falsy-block"}
          >
            <BlockRenderer node={child} path={`${path}.children.${i}`} />
          </BasicBlock>
        ): <div key={i} />)}
      </BasicBlock>
    )
  }

  if (node.type === 'List') {
    return (
      <BasicBlock displayName="List" disableAdd onRemove={handleRemove} onDragStart={handleDragStart} onDrop={handleDrop}>
        <textarea value={node.children.toString()} onChange={handleArrayChange} />
      </BasicBlock>
    )
  }

  const blockDef = BLOCK_DEFINITIONS.find((def) => def.type === node.type)
  if (!blockDef) {
    return null
  }

  return (
    <BasicBlock displayName={blockDef.blockHeader} disableAdd={blockDef.disableAdd || node.children.length === blockDef.maxSlots} onAdd={handleAdd} onRemove={handleRemove} onDragStart={handleDragStart} onDrop={handleDrop}>
      {node.children.map((child, i) => <BlockRenderer key={i} node={child} path={`${path}.children.${i}`} />)}
    </BasicBlock>
  )
}

export const BlockRenderer = ({ node, path = 'root' }: { node: BlockNode | BlockNode[], path: string }) => {
  if (node === null) return null;

  if (Array.isArray(node)) {
    return <ArrayBlock nodes={node} path={path} />
  }

  if (typeof node === 'string' || typeof node === 'number' || typeof node === 'boolean') {
    return <PrimitiveBlock node={node} path={path} />
  }

  return <RecursiveBlock node={node} path={path} />

 
}

export default BlockRenderer;
