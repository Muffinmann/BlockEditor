import { useId, useRef, useState, MouseEventHandler } from "react";
import PopupSelect from "./PopupSelect";
import { BlockElement, BlockType } from "../types";
import "./BasicBlock.css"

export interface BasicBlockProps {
  displayName?: string | JSX.Element,
  type?: string, // block type: "if", "var", ...
  disableAdd?: boolean,
  disableRemove?: boolean,
  className?: string, // supplement class names
  onAdd?: (blockType: BlockType) => void;
  onRemove?: () => void;
  children: BlockElement;
}

const BasicBlock = ({
  className = '',
  displayName,
  disableAdd,
  disableRemove,
  onAdd,
  onRemove,
  children }: BasicBlockProps) => {
  const blockId = useId()
  const blockRef = useRef(null)
  const [hovered, setHovered] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

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

  return (
    <div
      ref={blockRef}
      id={blockId}
      className={`block ${className} ${hovered ? 'hovered' : ''}`}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      <div className="block-header">{displayName}</div>
      <div className="block-content">
        {children}
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
          <button className="remove-btn" onClick={onRemove}>-</button>
        )}
        {showPopup && <PopupSelect onClick={(blockType) => onAdd && onAdd(blockType)} />}
      </div>
    </div>
  )
};

export default BasicBlock;