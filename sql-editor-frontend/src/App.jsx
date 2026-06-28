import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import SqlEditor from './components/SqlEditor'

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <SqlEditor />
    </ConfigProvider>
  )
}

export default App
