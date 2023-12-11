import { FiUpload, FiDownload } from "react-icons/fi";
import './Toobar.css'
import { ChangeEventHandler, MouseEventHandler } from "react";

interface Toolbar {
  onUpload: ChangeEventHandler<HTMLInputElement>,
  onDownload: MouseEventHandler<HTMLButtonElement>,
}

const Toolbar = ({onUpload, onDownload}: Toolbar) => {
  return (
    <div className="toolbar">
      <label htmlFor="fileUpload" className="toolbar-item">
        <span className="icon"><FiUpload /></span> Upload
      </label>
      <input onChange={onUpload} type="file" id="fileUpload" className="file-input" hidden />
      <button className="toolbar-item" type="button" onClick={onDownload}>
        <span className="icon"><FiDownload /></span> Download
      </button>
    </div>

  )
};
export default Toolbar;
