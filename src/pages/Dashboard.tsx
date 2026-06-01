import { Card, Typography } from 'antd';
import { useAppStore } from '../stores/useAppStore';

const { Title, Paragraph } = Typography;

export default function Dashboard() {
  const user = useAppStore((state) => state.user);

  return (
    <div className="p-4">
      <Title level={3}>Welcome, {user?.name}!</Title>
      <Card>
        <Paragraph>
          This is the dashboard page. You can add charts, statistics, and other widgets here.
        </Paragraph>
      </Card>
    </div>
  );
}
