import { useState } from 'react'
import { Form, Input, Button, Tabs, message, Typography, Divider } from 'antd'
import { UserOutlined, LockOutlined, UserAddOutlined, DatabaseOutlined, ThunderboltOutlined, SafetyCertificateOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { login, register } from '@/api/auth'
import { useUserStore } from '@/store/userStore'

const { Title, Text, Paragraph } = Typography

const Login = () => {
  const [activeTab, setActiveTab] = useState('login')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const setToken = useUserStore((state) => state.setToken)
  const setStudentInfo = useUserStore((state) => state.setStudentInfo)

  const handleLogin = async (values: { username: string; password: string }) => {
    try {
      setLoading(true)
      const result = await login(values.username, values.password)
      setToken(result.token)
      setStudentInfo(result.studentInfo)
      message.success('登录成功')
      navigate('/')
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (values: { username: string; password: string; realName: string }) => {
    try {
      setLoading(true)
      await register(values.username, values.password, values.realName)
      message.success('注册成功，请登录')
      setActiveTab('login')
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const features = [
    {
      icon: <DatabaseOutlined style={{ fontSize: '24px', color: '#1677ff' }} />,
      title: '真实环境练习',
      desc: '基于真实MySQL数据库，在线执行SQL语句，即时查看结果'
    },
    {
      icon: <ThunderboltOutlined style={{ fontSize: '24px', color: '#faad14' }} />,
      title: '循序渐进学习',
      desc: '从基础到进阶，系统化的学习路径，帮助你快速掌握SQL'
    },
    {
      icon: <SafetyCertificateOutlined style={{ fontSize: '24px', color: '#52c41a' }} />,
      title: '智能错题本',
      desc: '自动收录错误SQL，标记掌握状态，针对性复习提升'
    }
  ]

  const loginItems = [
    {
      key: 'login',
      label: '登录',
      children: (
        <Form
          name="login"
          onFinish={handleLogin}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入学号/账号' }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="学号/账号"
              style={{ height: '44px' }}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="密码"
              style={{ height: '44px' }}
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: '16px' }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
              style={{
                height: '44px',
                fontSize: '16px',
                fontWeight: 500,
              }}
            >
              登 录
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: 'register',
      label: '注册',
      children: (
        <Form
          name="register"
          onFinish={handleRegister}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入学号/账号' }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="学号/账号"
              style={{ height: '44px' }}
            />
          </Form.Item>
          <Form.Item
            name="realName"
            rules={[{ required: true, message: '请输入真实姓名' }]}
          >
            <Input
              prefix={<UserAddOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="真实姓名"
              style={{ height: '44px' }}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="密码"
              style={{ height: '44px' }}
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: '16px' }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
              style={{
                height: '44px',
                fontSize: '16px',
                fontWeight: 500,
              }}
            >
              注 册
            </Button>
          </Form.Item>
        </Form>
      ),
    },
  ]

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: '#f5f7fa',
    }}>
      <div style={{
        flex: 1,
        background: 'linear-gradient(135deg, #1677ff 0%, #0958d9 50%, #003eb3 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-20%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.05)',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-30%',
          left: '-10%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.08)',
        }} />

        <div style={{ position: 'relative', zIndex: 1, color: '#fff', maxWidth: '480px' }} className="animate-slide-in-left">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              background: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)',
            }}>
              <DatabaseOutlined style={{ fontSize: '28px', color: '#fff' }} />
            </div>
            <Title level={2} style={{ color: '#fff', margin: 0, fontWeight: 700 }}>
              SQL学习平台
            </Title>
          </div>

          <Title level={1} style={{ color: '#fff', marginBottom: '16px', fontSize: '42px', lineHeight: 1.2, fontWeight: 700 }}>
            从零开始<br />掌握SQL数据库
          </Title>

          <Paragraph style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '16px', marginBottom: '48px', lineHeight: 1.8 }}>
            系统化的学习路径，真实的数据库环境，智能的错题回顾。
            让SQL学习更简单、更高效。
          </Paragraph>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {features.map((feature, index) => (
              <div key={index} style={{
                display: 'flex',
                gap: '16px',
                alignItems: 'flex-start',
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.25s ease',
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {feature.icon}
                </div>
                <div>
                  <div style={{ color: '#fff', fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>
                    {feature.title}
                  </div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '14px', lineHeight: 1.6 }}>
                    {feature.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{
        width: '520px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
      }} className="animate-fade-in">
        <div style={{
          width: '100%',
          maxWidth: '420px',
          background: '#fff',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 20px 60px -15px rgba(0, 0, 0, 0.1)',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <Title level={3} style={{ margin: '0 0 8px 0', fontWeight: 700 }}>
              {activeTab === 'login' ? '欢迎回来' : '创建账号'}
            </Title>
            <Text type="secondary">
              {activeTab === 'login' ? '登录账号开始你的学习之旅' : '注册账号，开启SQL学习新旅程'}
            </Text>
          </div>

          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            centered
            items={loginItems}
            size="large"
            style={{ marginBottom: '8px' }}
          />

          <Divider style={{ margin: '24px 0 16px 0' }}>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {activeTab === 'login' ? '还没有账号？' : '已有账号？'}
              <Button
                type="link"
                style={{ padding: '0 0 0 4px', height: 'auto' }}
                onClick={() => setActiveTab(activeTab === 'login' ? 'register' : 'login')}
              >
                {activeTab === 'login' ? '立即注册' : '去登录'}
              </Button>
            </Text>
          </Divider>
        </div>
      </div>
    </div>
  )
}

export default Login
