import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { SqlExecuteResult } from '@/types/entity'
import { Empty, Typography, Spin, Result } from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'

const { Text } = Typography

interface ResultTableProps {
  result: SqlExecuteResult | null
  loading?: boolean
}

const ResultTable = ({ result, loading = false }: ResultTableProps) => {
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
      }}>
        <Spin tip="执行中..." size="large" />
      </div>
    )
  }

  if (!result) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        padding: '40px',
      }}>
        <Empty
          description={
            <div style={{ textAlign: 'center' }}>
              <Text type="secondary" style={{ fontSize: '14px' }}>暂无执行结果</Text>
              <div style={{ marginTop: '8px' }}>
                <Text type="secondary" style={{ fontSize: '12px' }}>在上方编辑器中输入SQL语句，点击执行查看结果</Text>
              </div>
            </div>
          }
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </div>
    )
  }

  if (result.type === 'UPDATE') {
    return (
      <div style={{
        padding: '40px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Result
          icon={<CheckCircleOutlined style={{ color: '#52c41a', fontSize: '48px' }} />}
          title="执行成功"
          subTitle={
            <div style={{ marginTop: '12px' }}>
              <Text type="success" style={{ fontSize: '16px', fontWeight: 500 }}>
                影响 {result.affectedRows} 行
              </Text>
              <div style={{ marginTop: '8px' }}>
                <Text type="secondary" style={{ fontSize: '13px' }}>
                  执行耗时: {result.costTime}ms
                </Text>
              </div>
            </div>
          }
        />
      </div>
    )
  }

  const columnDefs = result.columns?.map((col) => ({
    headerName: col.name,
    field: col.name,
    sortable: true,
    filter: true,
    resizable: true,
  })) || []

  const rowData = result.rows?.map((row) => {
    const obj: Record<string, any> = {}
    result.columns?.forEach((col, index) => {
      obj[col.name] = row[index]
    })
    return obj
  }) || []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="ag-theme-alpine" style={{ flex: 1, minHeight: 0 }}>
        <AgGridReact
          columnDefs={columnDefs}
          rowData={rowData}
          domLayout="normal"
          defaultColDef={{
            resizable: true,
            sortable: true,
            filter: true,
          }}
          headerHeight={38}
          rowHeight={36}
        />
      </div>
    </div>
  )
}

export default ResultTable
