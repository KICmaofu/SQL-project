import { useState, useEffect } from 'react'
import {
  Layout,
  Button,
  List,
  Pagination,
  Tag,
  Space,
  Typography,
  message,
  Card,
  Empty,
  Spin,
  Tooltip,
  Divider,
} from 'antd'
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  PlayCircleOutlined,
  BookOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { getErrorList, markMaster } from '@/api/errorBook'
import { ErrorItem } from '@/types/entity'

const { Sider, Content } = Layout
const { Title, Text, Paragraph } = Typography

const ErrorBook = () => {
  const [status, setStatus] = useState<string>('all')
  const [errorList, setErrorList] = useState<ErrorItem[]>([])
  const [total, setTotal] = useState(0)
  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const loadErrorList = async () => {
    try {
      setLoading(true)
      const params: any = {
        pageNum: current,
        pageSize: pageSize,
      }
      if (status !== 'all') {
        params.masterStatus = status === 'unmastered' ? 0 : 1
      }
      const result = await getErrorList(params)
      setErrorList(result.records)
      setTotal(result.total)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadErrorList()
  }, [status, current, pageSize])

  const handleMarkMaster = async (id: number) => {
    try {
      await markMaster(id)
      message.success('已标记为已掌握')
      loadErrorList()
    } catch (e) {
      console.error(e)
    }
  }

  const handleRedo = (sqlContent: string) => {
    navigate('/', { state: { sqlContent } })
  }

  const statusTabs = [
    { key: 'all', label: '全部', icon: <BookOutlined />, count: total },
    { key: 'unmastered', label: '未掌握', icon: <ExclamationCircleOutlined />, count: status === 'unmastered' ? total : 0 },
    { key: 'mastered', label: '已掌握', icon: <CheckCircleOutlined />, count: status === 'mastered' ? total : 0 },
  ]

  const getStatusInfo = (masterStatus: string) => {
    if (masterStatus === 'MASTERED') {
      return { color: 'success', text: '已掌握', icon: <CheckCircleOutlined /> }
    }
    return { color: 'error', text: '未掌握', icon: <ExclamationCircleOutlined /> }
  }

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      <Sider
        width={260}
        style={{
          background: '#fff',
          borderRight: '1px solid #eef0f3',
        }}
      >
        <div style={{ padding: '20px', borderBottom: '1px solid #eef0f3' }}>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/')}
            style={{ padding: 0, marginBottom: '12px', height: 'auto' }}
          >
            返回学习
          </Button>
          <Title level={4} style={{ margin: 0, fontWeight: 600 }}>错题本</Title>
          <Text type="secondary" style={{ fontSize: '13px' }}>
            共 {total} 道错题
          </Text>
        </div>

        <div style={{ padding: '12px' }}>
          {statusTabs.map((tab) => (
            <div
              key={tab.key}
              onClick={() => {
                setStatus(tab.key)
                setCurrent(1)
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: '8px',
                cursor: 'pointer',
                marginBottom: '4px',
                background: status === tab.key ? '#e6f4ff' : 'transparent',
                color: status === tab.key ? '#1677ff' : '#4b5563',
                fontWeight: status === tab.key ? 500 : 400,
                transition: 'all 0.2s ease',
              }}
            >
              <Space size={10}>
                <span style={{ fontSize: '16px' }}>{tab.icon}</span>
                <span style={{ fontSize: '14px' }}>{tab.label}</span>
              </Space>
              {total > 0 && status !== 'all' && (
                <Tag color={status === tab.key ? 'blue' : 'default'} style={{ margin: 0 }}>
                  {total}
                </Tag>
              )}
            </div>
          ))}
        </div>
      </Sider>

      <Content style={{ padding: '24px', overflow: 'auto' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
              <Spin tip="加载中..." size="large" />
            </div>
          ) : errorList.length === 0 ? (
            <div style={{ padding: '60px 0' }}>
              <Empty
                description={
                  <div style={{ textAlign: 'center' }}>
                    <Text type="secondary" style={{ fontSize: '15px' }}>
                      {status === 'all' ? '暂无错题记录' : status === 'mastered' ? '暂无已掌握的错题' : '暂无未掌握的错题'}
                    </Text>
                    <div style={{ marginTop: '8px' }}>
                      <Text type="secondary" style={{ fontSize: '13px' }}>
                        {status === 'all' ? '继续练习，错题会自动收录到这里' : '继续加油！'}
                      </Text>
                    </div>
                  </div>
                }
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '16px' }}>
                <Text type="secondary" style={{ fontSize: '13px' }}>
                  第 {current} 页，共 {total} 条记录
                </Text>
              </div>

              <List
                dataSource={errorList}
                renderItem={(item) => {
                  const statusInfo = getStatusInfo(item.masterStatus)
                  return (
                    <Card
                      key={item.id}
                      style={{
                        marginBottom: '16px',
                        borderRadius: '12px',
                        border: '1px solid #eef0f3',
                      }}
                      bodyStyle={{ padding: '20px' }}
                      className="animate-fade-in"
                    >
                      <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Space size={12}>
                          <Tag
                            color={statusInfo.color}
                            icon={statusInfo.icon}
                            style={{ margin: 0, borderRadius: '6px', padding: '2px 10px' }}
                          >
                            {statusInfo.text}
                          </Tag>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            <ClockCircleOutlined style={{ marginRight: '4px' }} />
                            {item.createTime || '未知时间'}
                          </Text>
                        </Space>
                        <Space size={4}>
                          <Tooltip title="重做此题">
                            <Button
                              type="primary"
                              size="small"
                              icon={<PlayCircleOutlined />}
                              onClick={() => handleRedo(item.sqlContent)}
                              style={{ borderRadius: '6px' }}
                            >
                              重做
                            </Button>
                          </Tooltip>
                          {item.masterStatus === 'UNMASTERED' && (
                            <Tooltip title="标记为已掌握">
                              <Button
                                size="small"
                                icon={<CheckCircleOutlined />}
                                onClick={() => handleMarkMaster(item.id)}
                                style={{ borderRadius: '6px' }}
                              >
                                已掌握
                              </Button>
                            </Tooltip>
                          )}
                        </Space>
                      </div>

                      <div
                        style={{
                          background: '#1e293b',
                          borderRadius: '8px',
                          padding: '14px 16px',
                          marginBottom: '12px',
                          fontFamily: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
                          fontSize: '13px',
                          lineHeight: 1.6,
                          color: '#e2e8f0',
                          overflow: 'auto',
                          maxHeight: '120px',
                        }}
                      >
                        <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                          <code>{item.sqlContent}</code>
                        </pre>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                        <ExclamationCircleOutlined style={{ color: '#ff4d4f', marginTop: '3px', flexShrink: 0 }} />
                        <div>
                          <Text type="danger" style={{ fontSize: '13px', fontWeight: 500 }}>
                            错误信息
                          </Text>
                          <div style={{ marginTop: '4px' }}>
                            <Text type="danger" style={{ fontSize: '13px' }}>
                              {item.errorMsg}
                            </Text>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )
                }}
              />

              {total > pageSize && (
                <div style={{ marginTop: '24px', textAlign: 'center' }}>
                  <Pagination
                    current={current}
                    pageSize={pageSize}
                    total={total}
                    onChange={(page, size) => {
                      setCurrent(page)
                      setPageSize(size)
                    }}
                    showSizeChanger
                    showQuickJumper
                    showTotal={(t) => `共 ${t} 条`}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </Content>
    </Layout>
  )
}

export default ErrorBook
