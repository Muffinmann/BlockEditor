import { ChangeEvent, DragEventHandler } from "react"
import { useBlockDispatcher } from "../hooks/useBlockDispatcher"
import { BlockNode, BlockType } from "../types"
import BasicBlock from "./BasicBlock"
import CategoryBlock from "./CategoryBlock"
import Input from "./Input"
import BLOCK_DEFINITIONS from '../config/blockDefinitions.json'

export const BlockRenderer = ({ node, path = 'root' }: { node: BlockNode | BlockNode[], path: string }) => {
  console.log({ node, type: typeof node, path })
  const dispatch = useBlockDispatcher()
  const handleAdd = (type: BlockType) => {
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
  const handleArrayChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value.split(',').map((str) => str.trim())
    dispatch({
      type: 'updateValue',
      payload: {
        path,
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
    ev.dataTransfer.setData('text/plain', path)
  }
  const handleDrop: DragEventHandler<HTMLDivElement> = (ev) => {
    const fromPath = ev.dataTransfer.getData('text/plain')
    if (fromPath === path || fromPath === 'root') {
      return;
    }
    dispatch({
      type: 'nodePath',
      payload: {
        from: fromPath,
        to: path
      }
    })
    console.log('MOVE FROM [', fromPath, '] TO [', path, ']')
  }
  if (node === null) return null;

  if (typeof node === 'string') {
    return (
      <BasicBlock displayName="Text" disableAdd onRemove={handleRemove} onDragStart={handleDragStart} onDrop={handleDrop}>
        <Input value={node} onChange={handleValueChange} />
      </BasicBlock>)
  }
  if (typeof node === 'number') {
    return (
      <BasicBlock displayName="Number" disableAdd onRemove={handleRemove} onDragStart={handleDragStart} onDrop={handleDrop}>
        <Input type="number" value={node} onChange={handleValueChange} />
      </BasicBlock>
    )
  }

  if (typeof node === 'boolean') {
    console.log('Boolean node', node)
    return (
      <BasicBlock displayName="Boolean" disableAdd onAdd={handleAdd} onRemove={handleRemove} onDragStart={handleDragStart} onDrop={handleDrop}>
        <label>
          true
          <Input type="radio" value="true" checked={node} onChange={handleValueChange} />
        </label>
        <label>
          false
          <Input type="radio" value="false" checked={!node} onChange={handleValueChange} />
        </label>
      </BasicBlock>
    )
  }
  if (Array.isArray(node)) {
    return node.map((n, i) => (
      <BlockRenderer key={i} node={n} path={`${path}.${i}`} />
    ))
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
        {node.children.slice(0, 3).map((child, i) => (
          <BasicBlock key={i} disableAdd disableRemove disableDrag allowDragPropagation displayName={i === 0 ? "Evaluation" : i % 2 === 1 ? "Truthy" : "Falsy"} className={i === 0 ? "evaluation-block" : i === 1 ? "truthy-block" : "falsy-block"}>
            <BlockRenderer node={child} path={`${path}.children.${i}`} />
          </BasicBlock>
        ))}
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

export default BlockRenderer;
