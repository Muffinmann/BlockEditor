import { useRef } from "react";
import "./PopupSelect.css"
import AVAILABLE_BLOCKS from '../config/blockDefinitions.json';
import { BlockType } from "../types";

const PopupSelect = ({ onClick}: {onClick: (type: BlockType) => void}) => {
  const popupRef = useRef<HTMLDivElement | null>(null)

  // TODO: translate back to screen if it is out
  return ( 
    <div
      className="popup" id="popup" ref={popupRef}
    >
      <div className="popup-header">
        <input
          id="searchInput"
          type="text"
          placeholder="Type to search..."
        />
      </div>

      <ul id="block-types" className="popup-list">
        {AVAILABLE_BLOCKS.map((opt) => (
          <li className="list-item" key={opt.type} onClick={() => onClick(opt.type as BlockType)} >{opt.type}</li>
        ))}
      </ul>
    </div>
  )

};
export default PopupSelect;
