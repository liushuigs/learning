import { useRef } from 'react'
import { useState, useEffect } from 'react'
import MonacoEditor from 'react-monaco-editor'
import { WebsocketProvider } from 'y-websocket'
import { MonacoBinding } from 'y-monaco'
import * as Y from 'yjs'
import './App.css'

export default function App() {
  const [code, setCode] = useState('// type your code...\nconst counter = 0;')
  const [editor, setEditor] = useState(null)
  const [monaco, setMonaco] = useState(null)
  const [provider, setProvider] = useState(null)
  const [isConnect, setIsConnect] = useState(false)
  const [ydoc, setYdoc] = useState(null)
  const [ytext, setYtext] = useState(null)
  const [binding, setBinding] = useState(null)
  const options = {
    selectOnLineNumbers: true
  }
  const onChange = () => {}
  const editorDidMount = (editor, monaco) => {
    setEditor(editor)
    setMonaco(monaco)
    editor.focus()
  }

  const handleClick = () => {}

  useEffect(() => {
    const ydoc = new Y.Doc()
    setYdoc(ydoc)
    const ytext = ydoc.getText('monaco')
    setYtext(ytext)
    const provider = new WebsocketProvider('ws://localhost:1234', 'monaco-demo', ydoc)
    setProvider(provider)
    return () => {
      provider && provider.disconnect()
      binding && binding.destroy()
    }
  }, [])

  useEffect(() => {
    if (!binding && ytext && editor && provider) {
      const monacoBinding = new MonacoBinding(ytext, editor.getModel(), new Set([editor]), provider.awareness)
      setBinding(monacoBinding)
    }
  }, [ytext, editor, provider, binding])

  return <div style={{display: 'flex'}}>
    <MonacoEditor
      width='50%'
      height={600}
      language="javascript"
      theme="vs-dark"
      options={options}
      onChange={onChange}
      editorDidMount={editorDidMount}
     />
    <div style={{marginLeft: '30px', flex: 1}}>
      <button onClick={handleClick}>{isConnect ? 'Disconnect': 'connect'}</button>
    </div>
  </div>
}