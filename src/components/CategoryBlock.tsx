import { ChangeEvent, useState } from "react";
import { FiMaximize2, FiMinimize2  } from "react-icons/fi";import {} from 'react-icons/hi';
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
        placeholder="Enter name here"
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
}: {
  children: BlockElement,
  displayName: string,
  onAdd: (type: BlockType) => void,
  onRemove: () => void,
  onNameChange: (name: string) => void,
}) => {
  const [expanded,setExpanded] = useState(false)
  if (!expanded) {
    return (
      <div>
        <button type="button" onClick={() => {setExpanded(true)}}>
          <FiMaximize2 />
        </button>
        <BasicBlock displayName={<CategoryHeader name={displayName} onNameChange={onNameChange} />} disableAdd disableRemove >...</BasicBlock>
      </div>
    )
  }
  return (
    <div>
      <button type="button" onClick={() => {setExpanded(false)}}>
        <FiMinimize2 />
      </button>
      <BasicBlock displayName={<CategoryHeader name={displayName} onNameChange={onNameChange} />} onAdd={onAdd} onRemove={onRemove}>
        {children}
      </BasicBlock>
    </div>
  )
};
export default CategoryBlock;
