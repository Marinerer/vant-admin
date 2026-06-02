import { Button, Result } from 'antd'
import { useNavigate } from 'react-router-dom'

export function ForbiddenPage() {
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Result
        status="403"
        title="403"
        subTitle="抱歉，您没有权限访问此页面。"
        extra={
          <Button type="primary" onClick={() => navigate('/')}>
            返回首页
          </Button>
        }
      />
    </div>
  )
}

export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Result
        status="404"
        title="404"
        subTitle="抱歉，您访问的页面不存在。"
        extra={
          <Button type="primary" onClick={() => navigate('/')}>
            返回首页
          </Button>
        }
      />
    </div>
  )
}

export function ServerErrorPage() {
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Result
        status="500"
        title="500"
        subTitle="抱歉，服务器出错了。"
        extra={
          <Button type="primary" onClick={() => navigate('/')}>
            返回首页
          </Button>
        }
      />
    </div>
  )
}
