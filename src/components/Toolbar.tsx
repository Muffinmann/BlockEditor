import { FiUpload, FiDownload } from "react-icons/fi";
import './Toolbar.css'
import { ChangeEventHandler, MouseEventHandler, useState } from "react";
import PopupSelect from "./PopupSelect";
import { BlockType } from "../types";

interface Toolbar {
  onUpload: ChangeEventHandler<HTMLInputElement>,
  onDownload: MouseEventHandler<HTMLButtonElement>,
  onAddBlock: (type: BlockType) => void,
}

const Toolbar = ({onUpload, onDownload, onAddBlock}: Toolbar) => {
  const [showPopup, setShowPopup] = useState(false)
  return (
    <div className="toolbar">
      <label htmlFor="fileUpload" className="toolbar-item">
        <span className="icon"><FiUpload /></span> Upload
      </label>
      <input onChange={onUpload} type="file" id="fileUpload" className="file-input" hidden />
      <button className="toolbar-item" type="button" onClick={onDownload}>
        <span className="icon"><FiDownload /></span> Download
      </button>
      <button className='add-btn' onClick={() => setShowPopup((old) => !old)}>
            +
      </button>
      {showPopup && <PopupSelect onClick={onAddBlock} />}
    </div>

  )
};
export default Toolbar;
