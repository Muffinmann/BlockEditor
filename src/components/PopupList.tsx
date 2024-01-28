const PopupList = ({options, onClick}: {
  options: {displayName: string, value: string}[],
  onClick: (v: string) => void
}) => {
  return (
    <ul className="popup-list">
      {
        options
          .map((opt) => (
            <li
              className="list-item"
              key={opt.value}
              onClick={() => onClick(opt.value)} >
              {opt.displayName}</li>
          ))}
    </ul>
  )
}

export default PopupList;
