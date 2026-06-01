import { Card, Typography, Space, Tag, Button } from 'antd'
import { CheckCircleOutlined, WarningOutlined } from '@ant-design/icons'
import { useAppStore } from '../stores/useAppStore'

const { Title, Paragraph, Text } = Typography

export default function Dashboard() {
  const user = useAppStore((state) => state.user)

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
        {[
          { title: '总用户数', value: '1,234', icon: <CheckCircleOutlined />, color: 'blue' },
          { title: '活跃用户', value: '892', icon: <CheckCircleOutlined />, color: 'green' },
          { title: '待处理', value: '56', icon: <WarningOutlined />, color: 'orange' },
          { title: '完成率', value: '98.5%', icon: <CheckCircleOutlined />, color: 'purple' },
        ].map((stat) => (
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
          <Button type="primary">新建内容</Button>
          <Button>用户管理</Button>
          <Button>系统设置</Button>
          <Button>查看报表</Button>
        </Space>
      </Card>
    </div>
  )
}
