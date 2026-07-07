import { Tree, Typography, Badge } from 'antd'
import {
  CheckCircleOutlined,
  BookOutlined,
  FolderOutlined,
  FolderOpenOutlined,
  LockOutlined,
} from '@ant-design/icons'
import { ChapterTree } from '@/types/entity'
import type { DataNode } from 'antd/es/tree'

const { Text } = Typography

interface StudyTreeProps {
  treeData: ChapterTree[]
  activeTaskId?: number
  onTaskClick: (taskId: number) => void
}

const StudyTree = ({ treeData, activeTaskId, onTaskClick }: StudyTreeProps) => {
  const buildTreeData = (chapters: ChapterTree[]): DataNode[] => {
    return chapters.map((chapter) => {
      const isCompleted = chapter.completedTask === chapter.totalTask
      const progressPercent = Math.round((chapter.completedTask / chapter.totalTask) * 100)

      return {
        key: `chapter-${chapter.id}`,
        title: (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '2px 0',
            width: '100%',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
              {!chapter.unlocked && <LockOutlined style={{ fontSize: '12px', color: '#bfbfbf' }} />}
              <Text
                style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: chapter.unlocked ? '#1f2937' : '#bfbfbf',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {chapter.chapterName}
              </Text>
            </div>
            <Badge
              count={`${chapter.completedTask}/${chapter.totalTask}`}
              showZero
              style={{
                backgroundColor: isCompleted ? '#52c41a' : chapter.unlocked ? '#1677ff' : '#d9d9d9',
                fontSize: '11px',
                padding: '0 6px',
              }}
            />
          </div>
        ),
        icon: chapter.unlocked ? undefined : <LockOutlined style={{ opacity: 0.5 }} />,
        disabled: !chapter.unlocked,
        children: chapter.tasks.map((task) => {
          const isCompletedTask = task.studyStatus === 'COMPLETED'
          const isActive = activeTaskId === task.id

          return {
            key: `task-${task.id}`,
            title: (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 0',
              }}>
                {isCompletedTask ? (
                  <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '14px' }} />
                ) : (
                  <BookOutlined style={{ color: isActive ? '#1677ff' : '#8c8c8c', fontSize: '13px' }} />
                )}
                <Text
                  style={{
                    fontSize: '13px',
                    color: isCompletedTask
                      ? '#52c41a'
                      : isActive
                      ? '#1677ff'
                      : chapter.unlocked
                      ? '#4b5563'
                      : '#bfbfbf',
                    fontWeight: isActive ? 500 : 400,
                  }}
                >
                  {task.taskName}
                </Text>
              </div>
            ),
            isLeaf: true,
            disabled: !chapter.unlocked,
          }
        }),
      }
    })
  }

  const handleSelect = (selectedKeys: React.Key[]) => {
    if (selectedKeys.length === 0) return
    const key = selectedKeys[0] as string
    if (key.startsWith('task-')) {
      const taskId = parseInt(key.replace('task-', ''), 10)
      onTaskClick(taskId)
    }
  }

  return (
    <Tree
      showIcon={false}
      defaultExpandAll
      treeData={buildTreeData(treeData)}
      selectedKeys={activeTaskId ? [`task-${activeTaskId}`] : []}
      onSelect={handleSelect}
      style={{ padding: '4px', background: 'transparent' }}
      blockNode
      showLine={{ showLeafIcon: false }}
    />
  )
}

export default StudyTree
