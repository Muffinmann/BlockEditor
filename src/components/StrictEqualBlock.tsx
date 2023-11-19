import { Children } from "react";
import { BlockElement } from "../types";
import BasicBlock from "./BasicBlock";
import { useBlockDispatcher } from "../hooks/useBlockDispatcher";

const StrictEqualBlock = ({
  onAdd,
  onRemove,
  children 
}: {children: BlockElement, onAdd: (type: string) => void, onRemove: () => void}) => {
  console.log("Strict equal", children)
  const disableAdd = Children.count(children) > 1
  // const dispatch = useBlockDispatcher()
  // const handleAdd = (type: string) => {
  //   console.log("Adding ", type, "to",  path)
  //   dispatch({
  //     type: 'add',
  //     payload: {
  //       path,
  //       blockType: type
  //     }
  //   })
  // }
  // const handleRemove = () => {
  //   console.log("Removing ", path)
  // }
  return (
    <BasicBlock disableAdd={disableAdd} onAdd={onAdd} onRemove={onRemove} displayName="Strict Equal (===)">
      {children}
    </BasicBlock>
  )
};
export default StrictEqualBlock;
