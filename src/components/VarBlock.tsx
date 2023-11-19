import { ChangeEvent } from "react";
import Input from "./Input";
import BasicBlock from "./BasicBlock";
import { useBlockDispatcher } from "../hooks/useBlockDispatcher";

// TODO: hint for key input.
const VarBlock = ({ value, path }: { path: string, value?: string }) => {
  console.log('var block path', path)
  const dispatch = useBlockDispatcher()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const nodes = path.split('.').slice(1)
    console.log("changing ", {
      path,
      value,
      nodes
    })
    dispatch({
      type: 'updateValue',
      payload: {
        path,
        value
      }
    })
  }
  
  const handleRemove = () => {
    console.log("Removing ", path)
    dispatch({
      type: 'remove',
      payload: path,
    })
  }
  return (
    <BasicBlock disableAdd displayName="Variable" onRemove={handleRemove} >
      <Input value={value} onChange={handleChange} />
    </BasicBlock>
  )
};
export default VarBlock;
