import { useRef } from "react";
import "./PopupSelect.css"
import AVAILABLE_BLOCKS from '../config/blockDefinitions.json';

const PopupSelect = ({ onClick}: {onClick: (type: string) => void}) => {
  const popupRef = useRef<HTMLDivElement | null>(null)

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
          <li className="list-item" key={opt.type} onClick={() => onClick(opt.type)} >{opt.type}</li>
        ))}
      </ul>
    </div>
  )

};
export default PopupSelect;
