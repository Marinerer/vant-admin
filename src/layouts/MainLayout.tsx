import { ProLayout } from '@ant-design/pro-components'
import { HomeOutlined, SettingOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAppStore } from '../stores/useAppStore'

export default function MainLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = useAppStore((state) => state.user)
  const logout = useAppStore((state) => state.logout)

  return (
    <ProLayout
      title="Vant Admin"
      location={location}
      route={{
        path: '/',
        routes: [
          { path: '/', name: 'Dashboard', icon: <HomeOutlined /> },
          { path: '/users', name: '用户管理', icon: <UserOutlined /> },
          { path: '/settings', name: '系统设置', icon: <SettingOutlined /> },
        ],
      }}
      avatarProps={{
        src: user?.avatar,
        title: user?.name,
      }}
      onMenuHeaderClick={() => navigate('/')}
      menuItemRender={(item, dom) => (
        <div
          onClick={() => {
            if (item.path) navigate(item.path)
          }}
        >
          {dom}
        </div>
      )}
      actionsRender={() => [
        <a key="logout" onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <LogoutOutlined />
          退出登录
        </a>,
      ]}
    >
      <Outlet />
    </ProLayout>
  )
}
