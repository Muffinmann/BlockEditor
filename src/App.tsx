import { useState } from 'react'
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

const tree = {
  id: '1',
  type: 'Category',
  name: 'Root',
  children: [
    {
      id:'2',
      type: 'If',
      children : [
        {
          id:'3',
          type: "StrictEqual",
          children: [
            {
              id:'4',
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

const blockRenderer = (node: {type: string, children: any, name?: string} | string) => {
  console.log(node)
  if (typeof node === 'string') return node
  if (node.type === 'Category') {
    return (
      <Block
        name={node.name}
      >
        {node.children.map((child) => blockRenderer(child))}
      </Block> 
    )
  }
  if (node.type === 'If') {
    return (
      <IfBlock 
        evaluation={blockRenderer(node.children[0])}
        truthy={blockRenderer(node.children[1])}
        falsy={blockRenderer(node.children[2])}
      />
    )
  }
  if (node.type === "Var") {
    return (
      <VarBlock value={node.value}/>
    )
  }
  if (node.type === 'StrictEqual') {
    return (
      <StrictEqualBlock left={blockRenderer(node.children[0])} right={blockRenderer(node.children[1])} />
    )
  }
}
function App() {
  const [count, setCount] = useState(0)

  return (
    <main>
      {blockRenderer(tree)}
    </main>
  )
}

export default App
