import BasicBlock from "./BasicBlock";
import Input from "./Input";

const InputBlock = ({path, value}: {path: string, value: string}) => {
  const handleRemove = () => {
    console.log("removing ", path)
  }
  return (
    <BasicBlock displayName="Text" disableAdd onRemove={handleRemove}>
      <Input value={value} />
    </BasicBlock>
  )
};
export default InputBlock;
