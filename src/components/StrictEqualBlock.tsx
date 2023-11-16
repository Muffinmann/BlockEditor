import { Children } from "react";
import { BlockElement } from "../types";
import BasicBlock from "./BasicBlock";

const StrictEqualBlock = ({
  path,
  children 
}: {children: BlockElement, path: string}) => {
  const disableAdd = Children.count(children) > 2
  const handleAdd = (type: string) => {
    console.log("Adding ", type, "to",  path)
  }
  const handleRemove = () => {
    console.log("Removing ", path)
  }
  return (
    <BasicBlock disableAdd={disableAdd} onAdd={handleAdd} onRemove={handleRemove} displayName="Strict Equal (===)">
      {children}
    </BasicBlock>
  )
};
export default StrictEqualBlock;
