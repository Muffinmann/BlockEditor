import { ComponentProps } from 'react';
import './Input.css'

interface Input extends ComponentProps<'input'> {

}
const Input = ({ type = 'text', value, ...props }: Input) => {
  return (
    <input
      type={type}
      value={value}
      className="input-field"
      placeholder="Enter value"
      {...props}
    />
  )
};
export default Input;
