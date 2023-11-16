import Block from "./Block";
import './IfBlock.css';

const IfBlock = ({
  path,
  evaluation,
  truthy,
  falsy
}: { evaluation: any, truthy: any, falsy: any, path: string }) => {
  return (
    <Block name="If" path={path}>
      <Block name="Evaluation" className="evaluation-block">{evaluation}</Block>
      <Block name="Truthy" className="truthy-block">{truthy}</Block>
      <Block name="Falsy" className="falsy-block">{falsy}</Block>
    </Block>
  )
};
export default IfBlock;
