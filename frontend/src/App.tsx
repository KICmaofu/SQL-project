import { ConfigProvider, theme } from 'antd'
import { RouterProvider } from 'react-router-dom'
import router from './router'
import zhCN from 'antd/locale/zh_CN'

const { defaultAlgorithm, compactAlgorithm } = theme

function App() {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: defaultAlgorithm,
        token: {
          colorPrimary: '#1677ff',
          colorSuccess: '#52c41a',
          colorWarning: '#faad14',
          colorError: '#ff4d4f',
          colorInfo: '#1677ff',
          borderRadius: 8,
          fontSize: 14,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        },
        components: {
          Layout: {
            headerBg: '#ffffff',
            siderBg: '#ffffff',
            bodyBg: '#f5f7fa',
          },
          Menu: {
            itemBg: 'transparent',
            subMenuItemBg: 'transparent',
          },
          Button: {
            controlHeight: 36,
            borderRadius: 6,
          },
          Input: {
            controlHeight: 40,
            borderRadius: 6,
          },
          Card: {
            borderRadius: 12,
          },
          Tabs: {
            borderRadius: 6,
          },
          Progress: {
            colorPrimary: '#1677ff',
          },
        },
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  )
}

export default App
