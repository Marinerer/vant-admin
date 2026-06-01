import { ConfigProvider } from 'antd';

export default function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1677ff',
        },
      }}
    >
      {/* RouterProvider is now handled in main.tsx */}
    </ConfigProvider>
  );
}
