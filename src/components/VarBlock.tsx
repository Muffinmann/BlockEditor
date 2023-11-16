import { ChangeEvent } from "react";
import Block from "./Block";
import Input from "./Input";
import { useBlockRenderContext } from "../hooks/useBlockDispatcher";
import BasicBlock from "./BasicBlock";

// TODO: hint for key input.
const VarBlock = ({ value, path }: { path: string, value?: string }) => {
  console.log('var blcok path', path)
  const dispatch = useBlockRenderContext()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const nodes = path.split('.').slice(1)
    console.log({
      path,
      value,
      nodes
    })

    dispatch((old) => {
      // console.log('original: ', old, nodes.toString())
      const obj = structuredClone(old);
      let target = obj
      while (nodes.length) {
        const nextNode = nodes.shift()
        target = target[nextNode]
      }
      console.log('target = ', JSON.stringify(target))
      if ('value' in target) {
        target.value = value
      }
      console.log('final: ', obj)
      return obj
    })
  }
  return (
    <BasicBlock disableAdd displayName="Variable" >
      {/* <Input defaultValue={value} onBlur={handleChange} /> */}
      <Input value={value} onChange={handleChange} />
    </BasicBlock>
  )
};
export default VarBlock;
