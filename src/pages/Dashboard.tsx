import { Card, Typography, Space, Tag, Button, Spin, Empty } from 'antd'
import { CheckCircleOutlined, WarningOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAppStore } from '../stores/useAppStore'
import { get } from '../utils/request'

const { Title, Paragraph, Text } = Typography

interface DashboardStats {
  totalUsers: number
  activeUsers: number
  pendingTasks: number
  completionRate: number
}

export default function Dashboard() {
  const user = useAppStore((state) => state.user)
  const navigate = useNavigate()

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: () => get<DashboardStats>('/dashboard/stats'),
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spin size="large" />
      </div>
    )
  }

  if (!stats) {
    return <Empty description="暂无数据" className="mt-20" />
  }

  const statCards = [
    {
      title: '总用户数',
      value: stats.totalUsers.toLocaleString(),
      icon: <CheckCircleOutlined />,
      color: 'blue',
    },
    {
      title: '活跃用户',
      value: stats.activeUsers.toLocaleString(),
      icon: <CheckCircleOutlined />,
      color: 'green',
    },
    {
      title: '待处理',
      value: String(stats.pendingTasks),
      icon: <WarningOutlined />,
      color: 'orange',
    },
    {
      title: '完成率',
      value: `${stats.completionRate}%`,
      icon: <CheckCircleOutlined />,
      color: 'purple',
    },
  ]

  return (
    <div className="p-6">
      <div className="mb-6">
        <Title level={3} className="!mb-2">
          欢迎回来，{user?.name}!
        </Title>
        <Paragraph className="text-gray-600">
          这是您的工作台，查看今天的运营数据和快捷操作。
        </Paragraph>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((stat) => (
          <Card key={stat.title} hoverable className="shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <Text className="text-gray-500 text-sm">{stat.title}</Text>
                <Title level={4} className="!mb-0 !mt-1">
                  {stat.value}
                </Title>
              </div>
              <Tag color={stat.color} className="text-lg px-3 py-1">
                {stat.icon}
              </Tag>
            </div>
          </Card>
        ))}
      </div>

      {/* 快捷操作 */}
      <Card title="快捷操作" className="shadow-sm">
        <Space wrap>
          <Button type="primary" onClick={() => navigate('/users')}>
            新建内容
          </Button>
          <Button onClick={() => navigate('/users')}>用户管理</Button>
          <Button onClick={() => navigate('/settings')}>系统设置</Button>
          <Button onClick={() => navigate('/')}>查看报表</Button>
        </Space>
      </Card>
    </div>
  )
}
