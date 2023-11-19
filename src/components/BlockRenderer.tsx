import { ChangeEvent } from "react"
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

export default BlockRenderer;
