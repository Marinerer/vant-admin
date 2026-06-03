import { useState } from 'react'
import { Button, Form, Input, Card, Typography, Checkbox, message, Spin } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined, MobileOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../stores/useAppStore'
import { setToken, setRefreshToken } from '../utils/token'
import { post } from '../utils/request'

const { Title, Text } = Typography

interface LoginFormValues {
  username?: string
  password?: string
  phone?: string
  code?: string
  remember?: boolean
}

interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: {
    id: string
    name: string
    avatar: string
    role: string
  }
}

export default function Login() {
  const navigate = useNavigate()
  const setUser = useAppStore((state) => state.setUser)
  const [loading, setLoading] = useState(false)
  const [loginType, setLoginType] = useState<'account' | 'phone'>('account')

  const onFinish = async (values: LoginFormValues) => {
    setLoading(true)

    try {
      // 根据登录方式分发请求体
      const payload =
        loginType === 'account'
          ? { username: values.username, password: values.password }
          : { phone: values.phone, code: values.code }

      const res = await post<LoginResponse>('/auth/login', payload)

      // 存储 token
      setToken(res.accessToken)
      setRefreshToken(res.refreshToken)

      setUser({
        id: res.user.id,
        name: res.user.name,
        avatar: res.user.avatar,
      })

      message.success('登录成功！')
      navigate('/')
    } catch {
      message.error('登录失败,请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="w-full max-w-md px-4">
        {/* Logo 和标题区域 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
            <UserOutlined className="text-2xl text-white" />
          </div>
          <Title level={2} className="!mb-2 !text-gray-800">
            Vant Admin
          </Title>
          <Text className="text-gray-500">现代化内容管理系统后台</Text>
        </div>

        {/* 登录表单卡片 */}
        <Card
          className="shadow-lg border-0 rounded-xl"
          bodyStyle={{ padding: '24px', minHeight: '380px' }}
        >
          {/* 登录方式切换 */}
          <div className="flex mb-6 border-b border-gray-200">
            <button
              className={`flex-1 pb-3 text-center font-medium transition-colors cursor-pointer ${
                loginType === 'account'
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setLoginType('account')}
            >
              账号密码登录
            </button>
            <button
              className={`flex-1 pb-3 text-center font-medium transition-colors cursor-pointer ${
                loginType === 'phone'
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setLoginType('phone')}
            >
              手机号登录
            </button>
          </div>

          <Spin spinning={loading}>
            <div className="h-[240px]">
              {loginType === 'account' ? (
                <Form<LoginFormValues>
                  layout="vertical"
                  onFinish={(values) => {
                    void onFinish(values)
                  }}
                  initialValues={{ remember: true }}
                  size="large"
                  className="space-y-2"
                >
                  <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
                    <Input
                      prefix={<UserOutlined className="text-gray-400" />}
                      placeholder="用户名: admin 或任意字符"
                      className="rounded-lg"
                    />
                  </Form.Item>

                  <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
                    <Input.Password
                      prefix={<LockOutlined className="text-gray-400" />}
                      placeholder="密码: 123456 或任意字符"
                      className="rounded-lg"
                    />
                  </Form.Item>

                  <Form.Item>
                    <div className="flex justify-between items-center">
                      <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>记住我</Checkbox>
                      </Form.Item>
                      <a className="text-blue-500 hover:text-blue-600">忘记密码?</a>
                    </div>
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      block
                      loading={loading}
                      className="h-11 rounded-lg font-medium"
                    >
                      {loading ? '登录中...' : '登 录'}
                    </Button>
                  </Form.Item>
                </Form>
              ) : (
                <Form<LoginFormValues>
                  layout="vertical"
                  onFinish={(values) => {
                    void onFinish(values)
                  }}
                  size="large"
                  className="space-y-2"
                >
                  <Form.Item
                    name="phone"
                    rules={[
                      { required: true, message: '请输入手机号' },
                      { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' },
                    ]}
                  >
                    <Input
                      prefix={<MobileOutlined className="text-gray-400" />}
                      placeholder="请输入手机号"
                      className="rounded-lg"
                    />
                  </Form.Item>

                  <Form.Item name="code" rules={[{ required: true, message: '请输入验证码' }]}>
                    <Input
                      prefix={<MailOutlined className="text-gray-400" />}
                      placeholder="请输入验证码"
                      className="rounded-lg"
                      suffix={
                        <Button type="link" size="small" className="!px-2">
                          获取验证码
                        </Button>
                      }
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      block
                      loading={loading}
                      className="h-11 rounded-lg font-medium"
                    >
                      {loading ? '登录中...' : '登 录'}
                    </Button>
                  </Form.Item>
                </Form>
              )}
            </div>
          </Spin>

          {/* 第三方登录 */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">其他登录方式</span>
              </div>
            </div>

            <div className="flex justify-center gap-6 mt-4">
              <button className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 8.16l-1.658 5.798h-3.697l-.698-2.448h-2.89l-.698 2.448H5.21L3.552 8.16h2.89l.698 2.448h2.89l.698-2.448h2.89l.698 2.448h2.89l-1.658-5.798h2.89z" />
                </svg>
              </button>
              <button className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.066 16.578c-.135.315-.315.63-.54.9-.225.27-.495.495-.81.675-.315.18-.63.315-.945.405-.315.09-.585.135-.81.135-.225 0-.45-.045-.675-.135-.225-.09-.405-.225-.54-.405-.135-.18-.225-.405-.27-.675-.045-.27-.045-.54.045-.81.09-.27.225-.495.405-.675.18-.18.405-.315.675-.405.27-.09.54-.135.81-.135.225 0 .45.045.675.135.225.09.405.225.54.405.135.18.225.405.27.675.045.27.045.54-.045.81z" />
                </svg>
              </button>
              <button className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.446 15.48c-.27.63-.63 1.17-1.08 1.62-.45.45-.99.81-1.62 1.08-.63.27-1.26.45-1.89.54-.63.09-1.26.09-1.89 0-.63-.09-1.26-.27-1.89-.54-.63-.27-1.17-.63-1.62-1.08-.45-.45-.81-.99-1.08-1.62-.27-.63-.45-1.26-.54-1.89-.09-.63-.09-1.26 0-1.89.09-.63.27-1.26.54-1.89.27-.63.63-1.17 1.08-1.62.45-.45.99-.81 1.62-1.08.63-.27 1.26-.45 1.89-.54.63-.09 1.26-.09 1.89 0 .63.09 1.26.27 1.89.54.63.27 1.17.63 1.62 1.08.45.45.81.99 1.08 1.62.27.63.45 1.26.54 1.89.09.63.09 1.26 0 1.89-.09.63-.27 1.26-.54 1.89z" />
                </svg>
              </button>
            </div>
          </div>
        </Card>

        {/* 底部版权信息 */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <Text>© 2024 Vant Admin. All rights reserved.</Text>
        </div>
      </div>
    </div>
  )
}
