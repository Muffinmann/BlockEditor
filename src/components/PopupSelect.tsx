import "./PopupSelect.css"


const PopupSelect = () => {
  return ( 
    <div className="popup" id="popup">
      <div className="popup-header">
        <input type="text" placeholder="Type to search..." id="searchInput" />
      </div>

      <div className="popup-list">
        <div className="list-item">Block 1</div>
        <div className="list-item">Block 2</div>
        <div className="list-item">Block 3</div>
        <div className="list-item">Block 4</div>
        <div className="list-item">Block 5</div>
        <div className="list-item">Block 6</div>
      </div>
    </div>
  )

};
export default PopupSelect;
