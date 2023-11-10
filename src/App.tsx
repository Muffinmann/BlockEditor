import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Block from './components/Block'
import PopupSelect from './components/PopupSelect'

function App() {
  const [count, setCount] = useState(0)

  return (
    <main>
      <Block name='TestBlockA' >
        <Block name='TestBlockB' /> 
        <Block name='TestBlockC' >
          <Block name='TestBlockD' />
          <Block name='TestBlockE' />
        </Block>
      </Block> 
      <div style={{position: "relative"}}>
        <PopupSelect />
      </div>
    </main>
  )
}

export default App
