import { MouseEventHandler, ReactElement, useId, useRef, useState } from "react";
import './Block.css';
import PopupSelect from "./PopupSelect";
import { useBlockRenderContext } from "../hooks/useBlockDispatcher";
import { BasicBlockProps } from "./BasicBlock";


interface BlockProps extends BasicBlockProps {
  name?: string, // display name
  type?: string, // block type: "if", "var", ...
  disableAdd?: boolean,
  disableRemove?: boolean,
  className?: string, // supplement class names
  path: string, // dot seperated path in the tree
  children: ReactElement | ReactElement[]
}
// This block serves as a general interface for the system and offers the basic
// functionality for building blocks.
const Block = ({ className = '', name, disableAdd, disableRemove, path, children }: BlockProps) => {
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

  const dispatch = useBlockRenderContext()

  const handleRemove = () => {
    dispatch((old) => {
      const nodes = path.split('.').slice(1)
      let target = old
      while (nodes.length > 1) {
        const nextPath = nodes.shift()
        target = target[nextPath]
      }
      const lastKey = nodes.shift()
      delete target[lastKey]
      return { ...old }
    })
  }

  return (
    <div
      ref={blockRef}
      id={blockId}
      className={`block ${className} ${hovered ? 'hovered' : ''}`}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      <div className="block-header">{name}</div>
      <div className="block-content">
        {children}
      </div>
      <div className={`block-footer ${hovered ? '' : 'hidden'}`}>
        {!disableAdd && (<button
          name="addButton"
          className="add-btn"
          onClick={() => { setShowPopup(true) }}
        >
          +
        </button>)}
        <button className="remove-btn" onClick={handleRemove}>-</button>
        {showPopup && <PopupSelect />}
      </div>
    </div>
  )
};
export default Block;
