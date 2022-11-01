import { useRef } from 'react'
import { useState, useEffect } from 'react'
import MonacoEditor from 'react-monaco-editor'
import './App.css'

export default function App() {
  const [code, setCode] = useState('// type your code...\nconst counter = 0;')
  const [textarea, setTextarea] = useState('')
  const [addedText, setAddedText] = useState(null)
  const [editor, setEditor] = useState(null)
  const [monaco, setMonaco] = useState(null)
  const [provider, setProvider] = useState(null)
  const [decorator, setDecorator] = useState([])
  const previousAddedText = useRef(null)
  const options = {
    selectOnLineNumbers: true
  }
  const onChange = () => {}
  const onChangeInput = (evt) => setTextarea(evt.target.value)
  const onAddText = () => {
    setCode(`${code}\n${textarea}`)
    setTextarea('')
    setAddedText({
      startPosition: code.split('\n').length + 1, 
      oldValue: code, 
      newValue: textarea
    })
  }
  const editorDidMount = (editor, monaco) => {
    setEditor(editor)
    setMonaco(monaco)
    editor.focus()
  }

  const addCodeLensProvider = () => {
    const selectChanges = (command) => editor.addCommand(1, () => {
      let newText;
  
      if (command === 'current') {
        newText = addedText.oldValue;
      } else if (command === 'incoming') {
        newText = addedText.newValue;
      }
      setCode(newText)
      setAddedText(null)
    }, '');
    const provider = monaco.languages.registerCodeLensProvider('javascript', {
      provideCodeLenses: function(model, token) {
        return {
          lenses: [
            {
                range: { startLineNumber: 1, endLineNumber: 1, startColumn: 1, endColumn: 1},
                command: {
                    id: selectChanges('current'),
                    title: 'Select Current Text',
                },
            }, {
                range: { startLineNumber: addedText.startPosition, endLineNumber: addedText.startPosition, startColumn: 1, endColumn: 1 },
                command: {
                    id: selectChanges('incoming'),
                    title: 'Select Incoming Text',
                },
            }
          ],
          dispose: () => {
            // do some cleanup if neccessary
          }
        }
      },
      resolveCodeLens: function(model, codeLens, token) {
        return codeLens;
      }
    })
    setProvider(provider)
  }

  useEffect(() => {
    if (addedText && !provider) {
      addCodeLensProvider()
    }
    return () => {
      if(!addedText && provider) {
        provider.dispose()
        setProvider(null)
      }
    }
  }, [addedText, provider, editor])

  useEffect(() => {
    if (!previousAddedText.current && addedText) {
      console.log('decorator')
      previousAddedText.current = addedText
      let newDecorator = editor.deltaDecorations(decorator, [{
        range: new monaco.Range(1, 1, addedText.startPosition-1, 1),
        options: {
          isWholeLine: true,
          className: 'green-decorator'
        }
      }, {
        range: new monaco.Range(addedText.startPosition, 1, addedText.startPosition + addedText.newValue.split('\n').length,1),
        options: {
          isWholeLine: true,
          className: 'blue-decorator',
        }
      }])
      setDecorator(newDecorator)
    }
    return () => {
      previousAddedText.current = addedText
    }
  }, [addedText, decorator, editor, monaco])

  return <div style={{display: 'flex'}}>
    <MonacoEditor
      width='50%'
      height={600}
      language="javascript"
      theme="vs-dark"
      value={code}
      options={options}
      onChange={onChange}
      editorDidMount={editorDidMount}
     />
    <div style={{marginLeft: '30px', flex: 1}}>
      <textarea style={{height: '100px', width: '100%', boxSizing: 'border-box'}} value={textarea} onChange={onChangeInput}/>
      <button onClick={onAddText}>Add</button>
    </div>
  </div>
}