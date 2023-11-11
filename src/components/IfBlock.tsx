import Block from "./Block";
import './IfBlock.css';

const IfBlock = ({
  evaluation,
  truthy,
  falsy
}: {evaluation: any, truthy: any, falsy: any}) => {
  return (
    <Block name="If">
      <Block name="Evaluation" className="evaluation-block">{evaluation}</Block>
      <Block name="Truthy" className="truthy-block">{truthy}</Block>
      <Block name="Falsy" className="falsy-block">{falsy}</Block>
    </Block>
  )
};
export default IfBlock;
