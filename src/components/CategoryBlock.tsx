import { BlockElement } from "../types";
import BasicBlock from "./BasicBlock";

const CategoryBlock = ({children, name, path}: {
  children: BlockElement,
  name: string,
  path: string,
}) => {
  const handleAdd = (type: string) => {
    console.log("Adding ", type, " to ", path)
  }
  const handleRemove = () => {
    console.log("Removing ", path)
  }
  return (
    <BasicBlock displayName={name} onAdd={handleAdd} onRemove={handleRemove}>
      {children}
    </BasicBlock>
  )
};
export default CategoryBlock;
