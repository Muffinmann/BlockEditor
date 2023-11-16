import { createContext, useContext, useReducer, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Block from './components/Block'
import PopupSelect from './components/PopupSelect'
import InputGroup from './components/InputGroup'
import IfBlock from './components/IfBlock'
import VarBlock from './components/VarBlock'
import StrictEqualBlock from './components/StrictEqualBlock'
import Input from './components/Input'
import { BlockDispatcherProvider } from './hooks/useBlockDispatcher'

type BlockNode = {
  type: 'Category',
  name: string,
  children: BlockNode[]
} | {
  type: 'If' | 'StrictEqual',
  children: BlockNode[],
} | {
  type: 'Var',
  value: string,
} | string

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
  if (typeof node === 'string') return node
  if (node.type === 'Category') {
    return (
      <Block
        name={node.name}
        path={path}
      >
        {node.children.map((child, i) => <BlockRenderer key={i} node={child} path={`${path}.children.${i}`} />)}
      </Block>
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
      <StrictEqualBlock
        left={<BlockRenderer path={`${path}.children.0`} node={node.children[0]} />}
        right={<BlockRenderer path={`${path}.children.0`} node={node.children[1]} />}
      />
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
