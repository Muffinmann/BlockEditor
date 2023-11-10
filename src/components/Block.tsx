import { MouseEventHandler, ReactElement, useId, useRef, useState } from "react";
import './Block.css';
import PopupSelect from "./PopupSelect";


// This block serves as a general interface for the system and offers the basic
// functionality for building blocks.
const Block = ({name, children}: {name: string, children?: ReactElement | ReactElement[]}) => {
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
      className={`block ${hovered ? 'hovered' : ''}`}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      <div className="block-header">{name}</div>
      <div className="block-content">
        {children}
      </div>
      <div className={`block-footer ${hovered ? '' : 'hidden'}`}>
        <button
          name="addButton"
          className="add-btn"
          onClick={() => {setShowPopup(true)}}
        >
            +
        </button>
        <button className="remove-btn">-</button>
        { showPopup && <PopupSelect />}
      </div>
    </div>
  )
};
export default Block;
