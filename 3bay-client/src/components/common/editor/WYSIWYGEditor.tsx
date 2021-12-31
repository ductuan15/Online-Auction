import { ControllerRenderProps } from 'react-hook-form/dist/types/controller'
import * as React from 'react'
import { convertToRaw, EditorState } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import { Editor, EditorProps } from 'react-draft-wysiwyg'
import { useTheme } from '@mui/material/styles'

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import './WYSIWYGEditor.css'
import {GREY} from '../../../theme/palette'

type WYSIWYGEditorProps = {
  // value?: string
  onChange: ControllerRenderProps['onChange']
} & EditorProps

const TOOLBAR_OPTIONS: EditorProps['toolbar'] = {
  options: [
    'inline',
    'blockType',
    'fontSize',
    'fontFamily',
    'list',
    'textAlign',
    'emoji',
    'remove',
    'history',
  ],
  blockType: {
    className: 'option-custom',
  },
  fontSize: {
    options: [12, 14, 16, 18, 24, 30, 36, 48],
  },
  fontFamily: {
    options: [
      'Manrope',
      'Roboto',
      'Jetbrains Mono',
      'Roboto Slab',
      'Libre Baskerville',
    ],
  },
  colorPicker: {
    inDropdown: false,
  },
  link: {
    inDropdown: false,
  },
  embedded: {
    inDropdown: false,
  },
  image: {},
}

export default function WYSIWYGEditor({
  // value,
  onChange,
  ...editorProps
}: WYSIWYGEditorProps): JSX.Element {
  // const [editorState, setEditorState] = useState(() => {
  //   return EditorState.createEmpty()
  // })

  const theme = useTheme()
  const toolbarClasses =
    theme.palette.mode === 'light'
      ? 'rdw-editor-toolbar-light'
      : 'rdw-editor-toolbar-dark'

  const onEditorStateChange = (editorState: EditorState) => {
    // console.log('Hei')
    // setEditorState(editorState)
    return onChange(draftToHtml(convertToRaw(editorState.getCurrentContent())))
  }

  return (
    <div
      className='editor'

    >
      <Editor
        // editorState={editorState}
        wrapperClassName='wrapper-class'
        editorClassName='editor-class'
        toolbarClassName={toolbarClasses}
        toolbarStyle={{
          color: 'black',
          background: GREY[500_8],
        }}
        wrapperStyle={{
          background: GREY[500_8],
        }}
        onEditorStateChange={onEditorStateChange}
        toolbar={TOOLBAR_OPTIONS}
        {...editorProps}
      />
    </div>
  )
}
