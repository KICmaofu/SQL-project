import { useState, useEffect } from 'react'
import { Layout, Button, Dropdown, Avatar, Progress, Space, Tabs, Typography, message, Modal, Tooltip, Badge } from 'antd'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BookOutlined,
  ReloadOutlined,
  LogoutOutlined,
  UserOutlined,
  CheckCircleOutlined,
  CopyOutlined,
  PlayCircleOutlined,
  BulbOutlined,
  ExperimentOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons'
import { useNavigate, Link } from 'react-router-dom'
import StudyTree from '@/components/StudyTree'
import SQLEditor from '@/components/SQLEditor'
import ResultTable from '@/components/ResultTable'
import { useUserStore } from '@/store/userStore'
import { useStudyStore } from '@/store/studyStore'
import { getChapterTree, getTaskDetail, markTaskComplete, getProgress } from '@/api/study'
import { executeSql } from '@/api/sql'
import { resetPractice } from '@/api/practice'
import { SqlExecuteResult } from '@/types/entity'
import ReactMarkdown from 'react-markdown'

const { Header, Sider, Content } = Layout
const { Title, Text } = Typography

const StudyWorkbench = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [sqlContent, setSqlContent] = useState('')
  const [sqlResult, setSqlResult] = useState<SqlExecuteResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [markLoading, setMarkLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('knowledge')
  const navigate = useNavigate()

  const studentInfo = useUserStore((state) => state.studentInfo)
  const logout = useUserStore((state) => state.logout)
  const chapterTree = useStudyStore((state) => state.chapterTree)
  const activeTaskId = useStudyStore((state) => state.activeTaskId)
  const activeTaskDetail = useStudyStore((state) => state.activeTaskDetail)
  const progress = useStudyStore((state) => state.progress)
  const setChapterTree = useStudyStore((state) => state.setChapterTree)
  const setActiveTaskId = useStudyStore((state) => state.setActiveTaskId)
  const setActiveTaskDetail = useStudyStore((state) => state.setActiveTaskDetail)
  const setProgress = useStudyStore((state) => state.setProgress)

  const loadData = async () => {
    try {
      const [tree, prog] = await Promise.all([getChapterTree(), getProgress()])
      setChapterTree(tree)
      setProgress(prog)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleTaskClick = async (taskId: number) => {
    setActiveTaskId(taskId)
    setActiveTab('knowledge')
    setSqlResult(null)
    try {
      const detail = await getTaskDetail(taskId)
      setActiveTaskDetail(detail)
    } catch (e) {
      console.error(e)
    }
  }

  const handleExecute = async () => {
    if (!sqlContent.trim()) {
      message.warning('请输入SQL语句')
      return
    }
    try {
      setLoading(true)
      const result = await executeSql(sqlContent)
      setSqlResult(result)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkComplete = async () => {
    if (!activeTaskId) return
    try {
      setMarkLoading(true)
      await markTaskComplete(activeTaskId)
      message.success('已标记为已学习')
      loadData()
    } catch (e) {
      console.error(e)
    } finally {
      setMarkLoading(false)
    }
  }

  const handleFillExample = () => {
    if (activeTaskDetail?.exampleSql) {
      setSqlContent(activeTaskDetail.exampleSql)
      message.success('已填充到编辑器')
    }
  }

  const handleReset = () => {
    Modal.confirm({
      title: '确认重置练习数据',
      content: '此操作将重置练习数据库，所有练习数据将恢复到初始状态，确定继续吗？',
      okText: '确定重置',
      cancelText: '取消',
      onOk: async () => {
        try {
          await resetPractice()
          message.success('练习数据已重置')
        } catch (e) {
          console.error(e)
        }
      },
    })
  }

  const handleLogout = () => {
    Modal.confirm({
      title: '确认退出登录',
      content: '确定要退出当前账号吗？',
      onOk: () => {
        logout()
        navigate('/login')
      },
    })
  }

  const userMenuItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ]

  const progressPercent = progress ? Math.round(progress.progressRate * 100) : 0

  const leftTabItems = [
    {
      key: 'knowledge',
      label: (
        <Space>
          <BulbOutlined />
          知识点讲解
        </Space>
      ),
      children: activeTaskDetail ? (
        <div style={{ padding: '24px', overflow: 'auto', height: '100%' }} className="prose-custom">
          <ReactMarkdown>{activeTaskDetail.knowledgeContent}</ReactMarkdown>
        </div>
      ) : (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: '#9ca3af',
          padding: '40px',
        }}>
          <BookOutlined style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.3 }} />
          <Text type="secondary" style={{ fontSize: '16px' }}>请选择左侧任务开始学习</Text>
          <Text type="secondary" style={{ fontSize: '14px', marginTop: '8px' }}>从第一个章节开始，循序渐进掌握SQL</Text>
        </div>
      ),
    },
    {
      key: 'example',
      label: (
        <Space>
          <ExperimentOutlined />
          课堂例题
        </Space>
      ),
      children: activeTaskDetail ? (
        <div style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '16px', display: 'flex', gap: '12px' }}>
            <Button type="primary" icon={<CopyOutlined />} onClick={handleFillExample}>
              填充到编辑器
            </Button>
            <Button icon={<PlayCircleOutlined />} onClick={() => { handleFillExample(); setTimeout(handleExecute, 300) }}>
              直接运行
            </Button>
          </div>
          <div style={{
            background: '#1e293b',
            borderRadius: '10px',
            padding: '20px',
            flex: 1,
            overflow: 'auto',
            fontFamily: '"JetBrains Mono", "Fira Code", monospace',
            fontSize: '14px',
            lineHeight: 1.7,
            color: '#e2e8f0',
          }}>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
              <code>{activeTaskDetail.exampleSql}</code>
            </pre>
          </div>
        </div>
      ) : (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: '#9ca3af',
        }}>
          <ExperimentOutlined style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.3 }} />
          <Text type="secondary">请选择左侧任务查看例题</Text>
        </div>
      ),
    },
    {
      key: 'practice',
      label: (
        <Space>
          <ThunderboltOutlined />
          课后练习
        </Space>
      ),
      children: activeTaskDetail ? (
        <div style={{ padding: '24px', overflow: 'auto', height: '100%' }}>
          <ReactMarkdown>{activeTaskDetail.practiceQuestion}</ReactMarkdown>
        </div>
      ) : (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: '#9ca3af',
        }}>
          <ThunderboltOutlined style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.3 }} />
          <Text type="secondary">请选择左侧任务开始练习</Text>
        </div>
      ),
    },
  ]

  return (
    <Layout style={{ height: '100vh', background: '#f5f7fa' }}>
      <Header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#fff',
        padding: '0 20px',
        borderBottom: '1px solid #eef0f3',
        height: '60px',
        lineHeight: '60px',
      }}>
        <Space size={16} style={{ display: 'flex', alignItems: 'center' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ width: '36px', height: '36px' }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #1677ff, #0958d9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <BookOutlined style={{ color: '#fff', fontSize: '16px' }} />
            </div>
            <Title level={5} style={{ margin: 0, fontWeight: 600 }}>SQL学习平台</Title>
          </div>
        </Space>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '360px' }}>
          <Text type="secondary" style={{ fontSize: '13px', whiteSpace: 'nowrap' }}>学习进度</Text>
          <Progress
            percent={progressPercent}
            size="small"
            style={{ flex: 1 }}
          />
          <Text style={{ fontSize: '13px', fontWeight: 500, color: '#1677ff' }}>{progressPercent}%</Text>
        </div>

        <Space size={8}>
          <Link to="/error-book">
            <Tooltip title="错题本">
              <Badge count={0} size="small">
                <Button icon={<BookOutlined />} style={{ borderRadius: '8px' }}>错题本</Button>
              </Badge>
            </Tooltip>
          </Link>
          <Tooltip title="重置练习数据">
            <Button icon={<ReloadOutlined />} onClick={handleReset} style={{ borderRadius: '8px' }}>
              重置数据
            </Button>
          </Tooltip>
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 12px 4px 4px',
              borderRadius: '24px',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}>
              <Avatar size={32} icon={<UserOutlined />} style={{ background: '#e6f4ff', color: '#1677ff' }} />
              <Text style={{ fontSize: '14px' }}>{studentInfo?.realName || studentInfo?.username}</Text>
            </div>
          </Dropdown>
        </Space>
      </Header>

      <Layout>
        <Sider
          width={280}
          collapsible
          collapsed={collapsed}
          trigger={null}
          style={{
            background: '#fff',
            borderRight: '1px solid #eef0f3',
          }}
          collapsedWidth={0}
        >
          {!collapsed && (
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #eef0f3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <Title level={5} style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>学习大纲</Title>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {progress?.completedTask || 0}/{progress?.totalTask || 0}
              </Text>
            </div>
          )}
          <div style={{ overflow: 'auto', height: 'calc(100vh - 60px - 49px)', padding: '8px' }}>
            <StudyTree
              treeData={chapterTree}
              activeTaskId={activeTaskId || undefined}
              onTaskClick={handleTaskClick}
            />
          </div>
        </Sider>

        <Content style={{
          background: '#f5f7fa',
          padding: '16px',
          display: 'flex',
          gap: '16px',
          overflow: 'hidden',
        }}>
          <div style={{
            flex: 1,
            minWidth: 0,
            background: '#fff',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }} className="animate-slide-in-left">
            <div style={{
              padding: '14px 20px',
              borderBottom: '1px solid #f0f2f5',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Title level={5} style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>
                  {activeTaskDetail ? activeTaskDetail.taskName : '知识点学习'}
                </Title>
              </div>
              {activeTaskDetail && (
                <Button
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  onClick={handleMarkComplete}
                  loading={markLoading}
                  style={{ borderRadius: '8px' }}
                >
                  标记已学习
                </Button>
              )}
            </div>
            <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
              <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                items={leftTabItems}
                size="large"
                style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
              />
            </div>
          </div>

          <div style={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }} className="animate-slide-in-right">
            <div style={{
              background: '#fff',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
              flex: '55 1 0',
              minHeight: 0,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}>
              <div style={{
                padding: '14px 20px',
                borderBottom: '1px solid #f0f2f5',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <Title level={5} style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>SQL编辑器</Title>
              </div>
              <div style={{ flex: 1, minHeight: 0 }}>
                <SQLEditor
                  value={sqlContent}
                  onChange={setSqlContent}
                  onExecute={handleExecute}
                  loading={loading}
                />
              </div>
            </div>

            <div style={{
              background: '#fff',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
              flex: '45 1 0',
              minHeight: 0,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}>
              <div style={{
                padding: '14px 20px',
                borderBottom: '1px solid #f0f2f5',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <Title level={5} style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>执行结果</Title>
                {sqlResult && (
                  <Text type="secondary" style={{ fontSize: '13px' }}>
                    {sqlResult.type === 'QUERY'
                      ? `共 ${sqlResult.total} 条 · 耗时 ${sqlResult.costTime}ms`
                      : `影响 ${sqlResult.affectedRows} 行 · 耗时 ${sqlResult.costTime}ms`}
                  </Text>
                )}
              </div>
              <div style={{ flex: 1, minHeight: 0 }}>
                <ResultTable result={sqlResult} loading={loading} />
              </div>
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default StudyWorkbench
