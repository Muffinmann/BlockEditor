import { ChangeEvent } from "react";
import Input from "./Input";
import BasicBlock from "./BasicBlock";

// TODO: hint for key input.
const VarBlock = ({ value, path }: { path: string, value?: string }) => {
  console.log('var block path', path)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const nodes = path.split('.').slice(1)
    console.log("changing ", {
      path,
      value,
      nodes
    })
  }
  
  const handleRemove = () => {
    console.log("Removing ", path)
  }
  return (
    <BasicBlock disableAdd displayName="Variable" onRemove={handleRemove} >
      <Input value={value} onChange={handleChange} />
    </BasicBlock>
  )
};
export default VarBlock;
