import Block from "./Block";

const StrictEqualBlock = ({
  left,
  right
}: {left: any, right: any}) => {
  return (
    <Block disableAdd name="Strict Equal (===)">
      {left}
      {right}
    </Block>
  )
};
export default StrictEqualBlock;
