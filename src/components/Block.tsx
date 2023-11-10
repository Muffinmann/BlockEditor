import { MouseEventHandler, ReactElement, useState } from "react";
import './Block.css';


// This block serves as a general interface for the system and offers the basic
// functionality for building blocks.
const Block = ({name, children}: {name: string, children?: ReactElement | ReactElement[]}) => {
  console.log({children})
  const [hovered, setHovered] = useState(false);

  const handleMouseOver: MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation(); // Prevent event from bubbling up to parent blocks
    setHovered(true);
  };

  const handleMouseOut = () => {
    setHovered(false);
  };
  return (
    <div
      className={`block ${hovered ? 'hovered' : ''}`}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}>
      <div className="block-header">{name}</div>
      <div className="block-content">
        {children}
      </div>
      {hovered && (
        <div className="block-footer">
          <button className="add-btn">+</button>
          <button className="remove-btn">-</button>
        </div>
      )}
    </div>
  )
};
export default Block;
