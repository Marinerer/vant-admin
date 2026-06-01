import { Button, Form, Input, Card, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../stores/useAppStore';

const { Title } = Typography;

export default function Login() {
  const navigate = useNavigate();
  const setUser = useAppStore((state) => state.setUser);

  const onFinish = (values: { username: string }) => {
    // Mock login
    setUser({ id: '1', name: values.username });
    navigate('/');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-sm">
        <Title level={3} className="text-center mb-6">Admin Login</Title>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="username" label="Username" rules={[{ required: true }]}>
            <Input placeholder="Enter any username" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>Login</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
