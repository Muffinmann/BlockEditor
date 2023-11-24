import { ChangeEvent, DragEventHandler } from "react"
import { useBlockDispatcher } from "../hooks/useBlockDispatcher"
import { BlockNode, BlockType } from "../types"
import BasicBlock from "./BasicBlock"
import CategoryBlock from "./CategoryBlock"
import Input from "./Input"

export const BlockRenderer = ({ node, path = 'root' }: { node: BlockNode, path: string }) => {
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
          return node
        }
      }
    })
  }

  const handleDragStart: DragEventHandler<HTMLDivElement>=(ev) => {
    ev.dataTransfer.setData('text/plain', path)
  }
  const handleDrop: DragEventHandler<HTMLDivElement>=(ev) => {
    const fromPath = ev.dataTransfer.getData('text/plain')
    dispatch({
      type: 'nodePath',
      payload: {
        from: fromPath,
        to: path
      }
    })
    console.log('MOVE FROM [',fromPath,'] TO [',path,']' )
  }
  if (!node) return null;
  if (typeof node === 'string') {
    // return <InputBlock path={path} value={node} />
    return (
      <BasicBlock displayName="Text" disableAdd onRemove={handleRemove} onDragStart={handleDragStart} onDrop={handleDrop}>
        <Input value={node} onChange={handleValueChange} />
      </BasicBlock>)
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
      <BasicBlock onRemove={handleRemove} displayName="If" onDragStart={handleDragStart} onDrop={handleDrop}>
        {node.children.slice(0, 3).map((child, i) => (
          <BasicBlock key={i} disableAdd disableRemove disableDrag allowDragPropagation displayName={i === 0 ? "Evaluation" : i === 1 ? "Truthy" : "Falsy"} className={i === 0 ? "evaluation-block" : i === 1 ? "truthy-block" : "falsy-block"}>
            <BlockRenderer node={child} path={`${path}.children.${i}`} />
          </BasicBlock>
        ))}
      </BasicBlock>
    )
  }
  if (node.type === "Var") {
    return (
      <BasicBlock disableAdd displayName="Variable" onRemove={handleRemove} onDragStart={handleDragStart} onDrop={handleDrop}>
        <Input value={node.value} onChange={handleValueChange} />
      </BasicBlock>
    )
  }
  if (node.type === 'StrictEqual') {
    return (
      <BasicBlock displayName="Strict Equal (===)" disableAdd={node.children.length > 1}  onAdd={handleAdd} onRemove={handleRemove} onDragStart={handleDragStart} onDrop={handleDrop}>
        {node.children.map((child, i) => <BlockRenderer key={i} node={child} path={`${path}.children.${i}`} />)}
      </BasicBlock>
    )
  }
}

export default BlockRenderer;
