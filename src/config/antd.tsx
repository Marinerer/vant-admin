import { ConfigProvider, theme } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

// 设置 dayjs 为中文
dayjs.locale('zh-cn');

// Ant Design 配置提供者
export function AntdProvider({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 6,
          fontSize: 14,
          lineHeight: 1.6,
        },
        algorithm: theme.defaultAlgorithm,
      }}
      componentSize="middle"
      input={{
        autoComplete: 'off',
      }}
      form={{
        validateMessages: {
          required: '${label}为必填项',
          types: {
            email: '${label}不是有效的邮箱',
            number: '${label}不是有效的数字',
          },
          number: {
            range: '${label}必须在 ${min}-${max} 之间',
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
