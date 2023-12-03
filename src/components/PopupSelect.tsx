import { useLayoutEffect, useRef, useState } from "react";
import "./PopupSelect.css"
import AVAILABLE_BLOCKS from '../config/blockDefinitions.json';
import { BlockType } from "../types";

const PopupSelect = ({ onClick}: {onClick: (type: BlockType) => void}) => {
  const popupRef = useRef<HTMLDivElement | null>(null)
  const [searchKey, setSearchKey] = useState('')
  const [translate, setTranslate] = useState({
    x: 0,
    y: 0,
  })
  // translate back to screen if it is out
  useLayoutEffect(() => {
    if (!popupRef.current) {
      return;
    }

    const rect = popupRef.current.getBoundingClientRect()
    const maxRight = window.innerWidth
    const maxBottom = window.innerHeight
    let translateX = 0
    let translateY = 0
    if (rect.bottom > maxBottom) {
      translateY = maxBottom - rect.bottom
    }
    if (rect.right > maxRight) {
      translateX = maxRight - rect.right
    }
    setTranslate({
      x: translateX,
      y: translateY
    })
  }, [])
  return ( 
    <div
      className="popup" id="popup" ref={popupRef}
      style={{
        transform: `translate(${translate.x}px, ${translate.y}px)`
      }}
    >
      <div className="popup-header">
        <input
          id="searchInput"
          type="text"
          placeholder="Type to search..."
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value.toLowerCase())}
        />
      </div>

      <ul id="block-types" className="popup-list">
        {AVAILABLE_BLOCKS
          .filter((opt) => opt.type.toLowerCase().includes(searchKey))
          .map((opt) => (
            <li className="list-item" key={opt.type} onClick={() => onClick(opt.type as BlockType)} >{opt.type}</li>
          ))}
      </ul>
    </div>
  )

};
export default PopupSelect;
