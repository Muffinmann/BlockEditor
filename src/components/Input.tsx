import './Input.css'

const Input = ({type = 'text', value}: {type: string, value?: string}) => {
  return (
    <input type={type} value={value} className="input-field" placeholder="Enter value" />
  )
};
export default Input;
