import Block from "./Block";
import Input from "./Input";

// TODO: hint for key input.
const VarBlock = ({value}: {value?: string}) => {
  return (
    <Block disableAdd name="Variable">
      <Input value={value} />
    </Block>
  )
};
export default VarBlock;
