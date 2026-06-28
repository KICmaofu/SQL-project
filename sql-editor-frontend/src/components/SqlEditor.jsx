import { useRef, useState, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import {
  Button,
  Select,
  Space,
  Table,
  Modal,
  Form,
  Input,
  message,
  Popconfirm,
  Card,
  Tag,
} from 'antd'
import {
  PlayCircleOutlined,
  ClearOutlined,
  FormatPainterOutlined,
  PlusOutlined,
  DeleteOutlined,
  DatabaseOutlined,
} from '@ant-design/icons'
import { format } from 'sql-formatter'
import request from '../utils/request'
import * as monaco from 'monaco-editor'

const SqlEditor = () => {
  const editorRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState({
    columns: [],
    rows: [],
    message: '',
    duration: null,
    success: null,
    affectedRows: null,
  })
  const [dsList, setDsList] = useState([])
  const [currentDsId, setCurrentDsId] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [form] = Form.useForm()
  const [testLoading, setTestLoading] = useState(false)

  useEffect(() => {
    fetchDatasourceList()
  }, [])

  const fetchDatasourceList = async () => {
    try {
      const res = await request.get('/api/datasource/list')
      setDsList(res.data)
      if (res.data.length > 0 && !currentDsId) {
        setCurrentDsId(String(res.data[0].id))
      }
    } catch (e) {
      console.error('获取数据源列表失败', e)
    }
  }

  const handleEditorMount = (editor) => {
    editorRef.current = editor
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
      handleExecute
    )
  }

  const getCurrentSql = () => {
    const editor = editorRef.current
    if (!editor) return ''
    const selection = editor.getSelection()
    const selectedText = editor.getModel().getValueInRange(selection)
    return selectedText.trim() || editor.getValue().trim()
  }

  const handleExecute = async () => {
    const sql = getCurrentSql()
    if (!sql) {
      message.warning('请输入 SQL 语句')
      return
    }
    if (!currentDsId) {
      message.warning('请先选择数据源')
      return
    }

    setLoading(true)
    try {
      const res = await request.post('/api/sql/execute', {
        sql,
        datasourceId: currentDsId,
      })
      const data = res.data
      if (data.success) {
        setResult({
          columns: data.columns || [],
          rows: data.rows || [],
          message: data.message,
          duration: data.duration,
          success: true,
          affectedRows: data.affectedRows,
        })
        message.success(data.message)
      } else {
        setResult({
          columns: [],
          rows: [],
          message: data.message,
          duration: data.duration,
          success: false,
          affectedRows: null,
        })
        message.error(data.message)
      }
    } catch (e) {
      message.error('请求失败：' + e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleFormat = () => {
    const sql = getCurrentSql()
    if (!sql) return
    try {
      const formatted = format(sql, {
        language: 'mysql',
        tabWidth: 2,
        keywordCase: 'upper',
        linesBetweenQueries: 2,
      })
      editorRef.current.setValue(formatted)
    } catch (e) {
      message.error('SQL语法有误，无法格式化')
    }
  }

  const handleClear = () => {
    if (editorRef.current) {
      editorRef.current.setValue('')
    }
    setResult({
      columns: [],
      rows: [],
      message: '',
      duration: null,
      success: null,
      affectedRows: null,
    })
  }

  const handleTestConnection = async () => {
    try {
      const values = await form.validateFields()
      setTestLoading(true)
      const res = await request.post('/api/datasource/test', values)
      if (res.data) {
        message.success('连接测试成功')
      } else {
        message.error('连接测试失败，请检查配置')
      }
    } catch (e) {
      message.error('连接测试失败：' + e.message)
    } finally {
      setTestLoading(false)
    }
  }

  const handleAddDatasource = async () => {
    try {
      const values = await form.validateFields()
      await request.post('/api/datasource/add', values)
      message.success('数据源添加成功')
      setModalOpen(false)
      form.resetFields()
      fetchDatasourceList()
    } catch (e) {
      console.error(e)
    }
  }

  const handleDeleteDatasource = async (id) => {
    try {
      await request.delete(`/api/datasource/${id}`)
      message.success('删除成功')
      fetchDatasourceList()
      if (currentDsId === String(id)) {
        setCurrentDsId('')
      }
    } catch (e) {
      message.error('删除失败：' + e.message)
    }
  }

  const tableColumns = result.columns.map((col) => ({
    title: col,
    dataIndex: col,
    key: col,
    ellipsis: true,
    width: 180,
  }))

  return (
    <div style={{ padding: '20px', minHeight: '100vh', background: '#f0f2f5' }}>
      <Card
        title={
          <Space>
            <DatabaseOutlined style={{ color: '#1890ff' }} />
            <span>SQL 编辑器</span>
          </Space>
        }
        style={{ marginBottom: 16 }}
        extra={
          <Space>
            <Select
              style={{ width: 220 }}
              value={currentDsId || undefined}
              onChange={setCurrentDsId}
              placeholder="选择数据源"
              options={dsList.map((item) => ({
                label: item.name,
                value: String(item.id),
              }))}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setModalOpen(true)}
            >
              新增连接
            </Button>
          </Space>
        }
      >
        <Space style={{ marginBottom: 12 }} wrap>
          <Button
            type="primary"
            icon={<PlayCircleOutlined />}
            onClick={handleExecute}
            loading={loading}
          >
            执行 (Ctrl+Enter)
          </Button>
          <Button
            icon={<FormatPainterOutlined />}
            onClick={handleFormat}
          >
            格式化
          </Button>
          <Button icon={<ClearOutlined />} onClick={handleClear}>
            清空
          </Button>
          {result.duration !== null && (
            <Tag color="blue">耗时：{result.duration} ms</Tag>
          )}
          {result.affectedRows !== null && (
            <Tag color="green">影响行数：{result.affectedRows}</Tag>
          )}
        </Space>

        <Editor
          height="380px"
          defaultLanguage="mysql"
          defaultValue="-- 请输入 SQL 语句"
          theme="vs-dark"
          onMount={handleEditorMount}
          options={{
            lineNumbers: 'on',
            minimap: { enabled: false },
            fontSize: 14,
            tabSize: 2,
            automaticLayout: true,
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            bracketPairColorization: { enabled: true },
            cursorBlinking: 'smooth',
            scrollbar: {
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
            },
          }}
        />
      </Card>

      <Card title="执行结果" style={{ marginTop: 16 }}>
        {result.message && (
          <div
            style={{
              padding: '8px 12px',
              marginBottom: 12,
              borderRadius: 4,
              background: result.success ? '#f6ffed' : '#fff2f0',
              border: `1px solid ${result.success ? '#b7eb8f' : '#ffccc7'}`,
              color: result.success ? '#389e0d' : '#cf1322',
            }}
          >
            {result.message}
          </div>
        )}
        {result.columns.length > 0 && (
          <Table
            dataSource={result.rows}
            columns={tableColumns}
            rowKey={(record, index) => index}
            size="small"
            pagination={false}
            scroll={{ y: 300, x: result.columns.length * 180 }}
          />
        )}
        {!result.message && result.columns.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              color: '#999',
              padding: '40px 0',
            }}
          >
            暂无执行结果
          </div>
        )}
      </Card>

      <Modal
        title="新增数据源"
        open={modalOpen}
        onOk={handleAddDatasource}
        onCancel={() => {
          setModalOpen(false)
          form.resetFields()
        }}
        width={500}
        okText="保存"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="连接名称"
            name="name"
            rules={[{ required: true, message: '请输入连接名称' }]}
          >
            <Input placeholder="请输入连接名称，如：测试库" />
          </Form.Item>
          <Form.Item
            label="数据库类型"
            name="dbType"
            initialValue="mysql"
            rules={[{ required: true, message: '请选择数据库类型' }]}
          >
            <Select
              options={[
                { label: 'MySQL', value: 'mysql' },
                { label: 'PostgreSQL', value: 'postgresql' },
              ]}
            />
          </Form.Item>
          <Form.Item
            label="JDBC 连接地址"
            name="url"
            rules={[{ required: true, message: '请输入 JDBC 连接地址' }]}
          >
            <Input placeholder="jdbc:mysql://127.0.0.1:3306/test?useSSL=false" />
          </Form.Item>
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="root" />
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
          <Form.Item>
            <Button onClick={handleTestConnection} loading={testLoading} block>
              测试连接
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {dsList.length > 0 && (
        <Card title="数据源管理" style={{ marginTop: 16 }}>
          <Table
            dataSource={dsList}
            rowKey="id"
            size="small"
            pagination={false}
            columns={[
              { title: '连接名称', dataIndex: 'name', key: 'name' },
              { title: '类型', dataIndex: 'dbType', key: 'dbType', width: 100 },
              { title: '地址', dataIndex: 'url', key: 'url', ellipsis: true },
              { title: '用户名', dataIndex: 'username', key: 'username', width: 120 },
              {
                title: '操作',
                key: 'action',
                width: 100,
                render: (_, record) => (
                  <Popconfirm
                    title="确定要删除这个数据源吗？"
                    onConfirm={() => handleDeleteDatasource(record.id)}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Button
                      type="link"
                      danger
                      icon={<DeleteOutlined />}
                      size="small"
                    >
                      删除
                    </Button>
                  </Popconfirm>
                ),
              },
            ]}
          />
        </Card>
      )}
    </div>
  )
}

export default SqlEditor
