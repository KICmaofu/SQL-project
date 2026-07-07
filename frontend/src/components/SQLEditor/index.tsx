import { useRef } from 'react'
import Editor, { useMonaco } from '@monaco-editor/react'
import { Button, Space, Tooltip, Spin } from 'antd'
import { PlayCircleOutlined, FormatPainterOutlined, FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons'
import { format } from 'sql-formatter'
import { useState } from 'react'

interface SQLEditorProps {
  value: string
  onChange: (value: string) => void
  onExecute: () => void
  loading?: boolean
  language?: string
}

const SQLEditor = ({ value, onChange, onExecute, loading = false, language = 'mysql' }: SQLEditorProps) => {
  const editorRef = useRef<any>(null)
  const monaco = useMonaco()
  const [isFullscreen, setIsFullscreen] = useState(false)

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor
    if (monaco) {
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, onExecute)
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF, handleFormat)
    }
  }

  const handleFormat = () => {
    try {
      const formatted = format(value, { language: 'mysql' })
      onChange(formatted)
    } catch (e) {
      console.error('格式化失败', e)
    }
  }

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
    setTimeout(() => {
      editorRef.current?.layout()
    }, 100)
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      position: 'relative',
    }}>
      <div style={{
        padding: '10px 16px',
        borderBottom: '1px solid #f0f2f5',
        background: '#fafbfc',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Space size={8}>
          <Button
            type="primary"
            icon={<PlayCircleOutlined />}
            onClick={onExecute}
            loading={loading}
            size="middle"
            style={{ borderRadius: '6px' }}
          >
            执行
            <span style={{ opacity: 0.7, fontSize: '12px', marginLeft: '4px' }}>Ctrl+Enter</span>
          </Button>
          <Tooltip title="格式化 SQL">
            <Button
              icon={<FormatPainterOutlined />}
              onClick={handleFormat}
              size="middle"
              style={{ borderRadius: '6px' }}
            >
              格式化
            </Button>
          </Tooltip>
        </Space>
        <Space size={4}>
          <Tooltip title={isFullscreen ? '退出全屏' : '全屏编辑'}>
            <Button
              type="text"
              icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
              onClick={handleFullscreen}
              size="small"
            />
          </Tooltip>
        </Space>
      </div>
      <div style={{
        flex: 1,
        minHeight: 0,
        position: 'relative',
      }}>
        {loading && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(255, 255, 255, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
          }}>
            <Spin tip="执行中..." />
          </div>
        )}
        <Editor
          height="100%"
          language={language}
          value={value}
          onChange={(val) => onChange(val || '')}
          onMount={handleEditorDidMount}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            fontFamily: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
            fontLigatures: true,
            cursorBlinking: 'smooth',
            smoothScrolling: true,
            padding: { top: 12, bottom: 12 },
            renderLineHighlight: 'all',
            scrollbar: {
              verticalScrollbarSize: 6,
              horizontalScrollbarSize: 6,
            },
          }}
        />
      </div>
    </div>
  )
}

export default SQLEditor
