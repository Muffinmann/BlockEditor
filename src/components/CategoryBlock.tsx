import { ChangeEvent, DragEventHandler, useState } from "react";
import { BlockElement, BlockType } from "../types";
import BasicBlock from "./BasicBlock";


const CategoryHeader = ({name, onNameChange}: {name: string, onNameChange: (name: string) => void}) => {
  const [editingName, setEditingName] = useState(false)
  const handleClick = () => {
    setEditingName(true)
  }
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    onNameChange(value)
  }

  if (!name) {
    return (
      <input
        className="block-header block-header__input" 
        onBlur={(e) => {
          setEditingName(false)
          handleChange(e)
        }} 
        placeholder="Enter name here"
      />
    )
  }

  if (editingName) {
    return (
      <input
        className="block-header block-header__input" 
        value={name} 
        onChange={handleChange} 
        onBlur={() => setEditingName(false)} 
      />
    )
  }
  return (
    <button onClick={handleClick} className="block-header block-header__button">{name}</button>
  )
}

const CategoryBlock = ({
  children, 
  displayName,
  onAdd,
  onRemove,
  onNameChange,
  onDragStart,
  onDrop,
}: {
  children: BlockElement,
  displayName: string,
  onAdd: (type: BlockType) => void,
  onRemove: () => void,
  onNameChange: (name: string) => void,
  onDrag?: DragEventHandler<HTMLDivElement>,
  onDragStart?:DragEventHandler<HTMLDivElement>,
  onDragEnter?:DragEventHandler<HTMLDivElement>,
  onDragOver?:DragEventHandler<HTMLDivElement>,
  onDragLeave?:DragEventHandler<HTMLDivElement>,
  onDrop?:DragEventHandler<HTMLDivElement>,  
}) => {

  return (
    <BasicBlock 
      defaultExpanded
      displayName={<CategoryHeader name={displayName} onNameChange={onNameChange} />}
      onAdd={onAdd}
      onRemove={onRemove}
      onDragStart={onDragStart}
      onDrop={onDrop}>
      {children}
    </BasicBlock>
  )
};
export default CategoryBlock;
