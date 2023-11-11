import Input from "./Input";
import './InputGroup.css';

const InputGroup = ({type = 'text', count = 2}) => {
  return (
    <div className="input-group">
      {Array.from({length: count}, (_, k) => k).map((i) => (
        <Input key={i} type={type} />
      ))}
    </div>
  )
};
export default InputGroup;
