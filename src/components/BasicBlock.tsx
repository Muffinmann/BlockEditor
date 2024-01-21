import { useId, useRef, useState, MouseEventHandler, DragEventHandler } from "react";
import PopupSelect from "./PopupSelect";
import { BlockElement, BlockType } from "../types";
import "./BasicBlock.css"
import { FiMaximize2, FiMinimize2 } from "react-icons/fi";

export interface BasicBlockProps {
  displayName?: string | JSX.Element,
  type?: string, // block type: "if", "var", ...
  disableAdd?: boolean,
  disableRemove?: boolean,
  disableDrag?: boolean,
  allowDragPropagation?: boolean,
  defaultExpanded?: boolean,
  className?: string, // supplement class names
  onAdd?: (blockType: BlockType) => void;
  onRemove?: () => void;
  onDrag?: DragEventHandler<HTMLDivElement>,
  onDragStart?:DragEventHandler<HTMLDivElement>,
  onDragEnter?:DragEventHandler<HTMLDivElement>,
  onDragOver?:DragEventHandler<HTMLDivElement>,
  onDragLeave?:DragEventHandler<HTMLDivElement>,
  onDragEnd?:DragEventHandler<HTMLDivElement>,
  onDrop?:DragEventHandler<HTMLDivElement>,
  children?: BlockElement;
}

const BasicBlock = ({
  className = '',
  displayName,
  disableAdd,
  disableRemove,
  disableDrag = false,
  allowDragPropagation = false,
  defaultExpanded = true,
  onAdd,
  onRemove,
  onDrag,
  onDragStart,
  onDragEnter,
  onDragOver,
  onDragLeave,
  onDragEnd,
  onDrop,
  children }: BasicBlockProps) => {
  const blockId = useId()
  const blockRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isDropTarget, setIsDropTarget] = useState(false);
  const [expanded,setExpanded] = useState(defaultExpanded)

  const handleMouseOver: MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation(); // Prevent event from bubbling up to parent blocks
    setHovered(true);
  };

  const handleMouseOut: MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation()
    setHovered(false);
    if (e.target === blockRef.current) {
      setShowPopup(false)
    }
  };
  
  const handleDrag:DragEventHandler<HTMLDivElement> = (e) => {
    !allowDragPropagation && e.stopPropagation()
    if (onDrag) {
      onDrag(e)
    }
  }
  const handleDragStart:DragEventHandler<HTMLDivElement> = (ev) => {
    !allowDragPropagation && ev.stopPropagation()
    if (blockRef.current) {
      ev.dataTransfer.setDragImage(blockRef.current, 10, 10)
    }
    if (onDragStart) {
      onDragStart(ev)
    }
  }
  const handleDragEnter:DragEventHandler<HTMLDivElement> = (ev) => {
    !allowDragPropagation && ev.stopPropagation()
    if (onDragEnter) {
      onDragEnter(ev)
    }
  }
  const handleDragOver:DragEventHandler<HTMLDivElement> = (ev) => {
    !allowDragPropagation && ev.stopPropagation()
    ev.preventDefault() 
    ev.dataTransfer.dropEffect = "move";
    setIsDropTarget(true)
    if (onDragOver) {
      onDragOver(ev)
    }
  }
  const handleDragLeave:DragEventHandler<HTMLDivElement> = (ev) => {
    !allowDragPropagation && ev.stopPropagation()
    setIsDropTarget(false)
    if (onDragLeave) {
      onDragLeave(ev)
    }
  }
  const handleDragEnd:DragEventHandler<HTMLDivElement> = (ev) => {
    !allowDragPropagation && ev.stopPropagation()
    setIsDropTarget(false)
    if (onDragEnd){
      onDragEnd(ev)
    }
  }
  const handleDrop:DragEventHandler<HTMLDivElement> = (ev) => {
    !allowDragPropagation && ev.stopPropagation()
    ev.preventDefault() 
    setIsDropTarget(false)
    if (onDrop) {
      onDrop(ev)
    }
  }

  return (
    <div
      draggable={!disableDrag}
      ref={blockRef}
      id={blockId}
      className={`block ${className} ${hovered ? 'hovered' : ''} ${isDropTarget ? 'drop-target' : ''}`}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      onDrag={handleDrag}
      onDragStart={handleDragStart}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDragEnd={handleDragEnd}
      onDrop={handleDrop} 
    >
     
      <div className="block-header">
        {displayName}
        {hovered && (
          <button type="button" onClick={() => {setExpanded((old) => !old)}} className="expand-btn">
            {expanded ? <FiMinimize2 /> :<FiMaximize2 />}
          </button>
        )}
      </div>
      <div className="block-content">
        {expanded ? children : '...'}
      </div>
      <div className={`block-footer ${hovered ? '' : 'hidden'}`}>
        {!disableAdd && (
          <button
            name="addButton"
            className="add-btn"
            onClick={() => { setShowPopup(true) }}
          >
            +
          </button>)
        }
        {!disableRemove && (
          <button className="remove-btn" onClick={() => onRemove?.()}>-</button>
        )}
        {showPopup && <PopupSelect onClick={(blockType) => onAdd && onAdd(blockType)} />}
      </div>
    </div>
  )
};

export default BasicBlock;