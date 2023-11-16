import { useReducer } from 'react'
import IfBlock from './components/IfBlock'
import VarBlock from './components/VarBlock'
import CategoryBlock from './components/CategoryBlock'
import InputBlock from './components/InputBlock'
import StrictEqualBlock from './components/StrictEqualBlock'
import { BlockDispatcherProvider } from './hooks/useBlockDispatcher'
import { BlockNode } from './types'
import './App.css'


const testTree: BlockNode = {
  type: 'Category',
  name: 'Root',
  children: [
    {
      type: 'If',
      children: [
        {
          type: "StrictEqual",
          children: [
            {
              type: 'Var',
              value: 'test_field_key'
            },
            'test_value'
          ]
        },
        'correct',
        'wrong',
      ]
    }
  ]
}

const BlockRenderer = ({ node, path = 'root' }: { node: BlockNode, path: string }) => {
  console.log(node)
  if (!node) return null;
  if (typeof node === 'string') {
    return <InputBlock path={path} value={node} />
  } 
  if (node.type === 'Category') {
    return (
      <CategoryBlock
        name={node.name}
        path={path}
      >
        {node.children.map((child, i) => <BlockRenderer key={i} node={child} path={`${path}.children.${i}`} />)}
      </CategoryBlock>
    )
  }
  if (node.type === 'If') {
    return (
      <IfBlock
        path={path}
        evaluation={<BlockRenderer path={`${path}.children.0`} node={node.children[0]} />}
        truthy={<BlockRenderer path={`${path}.children.1`} node={node.children[1]} />}
        falsy={<BlockRenderer path={`${path}.children.2`} node={node.children[2]} />}
      />
    )
  }
  if (node.type === "Var") {
    return (
      <VarBlock path={path} value={node.value} />
    )
  }
  if (node.type === 'StrictEqual') {
    return (
      <StrictEqualBlock path={path} >
        <BlockRenderer path={`${path}.children.0`} node={node.children[0]} />
        <BlockRenderer path={`${path}.children.1`} node={node.children[1]} />
      </StrictEqualBlock>
    )
  }
}

const reducer = (state, action) => {

}

function App() {
  const [tree, dispatch] = useReducer(reducer, testTree as any)
  return (
    <main>
      <BlockDispatcherProvider dispatch={dispatch}>
        <BlockRenderer path='root' node={tree} />
      </BlockDispatcherProvider>
    </main>
  )
}

export default App
