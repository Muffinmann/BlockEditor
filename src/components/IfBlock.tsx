import { BlockElement } from '../types';
import BasicBlock from './BasicBlock';
import './IfBlock.css';

/**
 * Layout wrapper component for if block.
 * @returns 
 */
const IfBlock = ({
  path,
  evaluation,
  truthy,
  falsy
}: { path: string, evaluation: BlockElement, truthy: BlockElement, falsy: BlockElement }) => {
  const handleRemove = () => {
    console.log("removing ", path)
  }
  const handleAdd = (type: string) => {
    console.log("Add", type, "to", path, "children.index")
  }
  return (
    <BasicBlock onRemove={handleRemove} displayName="If" >
      <BasicBlock disableAdd={Boolean(evaluation)} onAdd={handleAdd} disableRemove displayName="Evaluation" className="evaluation-block">{evaluation}</BasicBlock>
      <BasicBlock disableAdd={Boolean(truthy)} onAdd={handleAdd} disableRemove displayName="Truthy" className="truthy-block">{truthy}</BasicBlock>
      <BasicBlock disableAdd={Boolean(falsy)} onAdd={handleAdd} disableRemove displayName="Falsy" className="falsy-block">{falsy}</BasicBlock>
    </BasicBlock>
  )
};
export default IfBlock;
