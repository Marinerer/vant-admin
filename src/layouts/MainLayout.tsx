import { ProLayout } from '@ant-design/pro-components';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../stores/useAppStore';

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAppStore((state) => state.user);
  const logout = useAppStore((state) => state.logout);

  return (
    <ProLayout
      title="Nest CMS Admin"
      location={location}
      route={{
        path: '/',
        routes: [
          { path: '/', name: 'Dashboard', icon: 'HomeOutlined' },
          { path: '/settings', name: 'Settings', icon: 'SettingOutlined' },
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
            if (item.path) navigate(item.path);
          }}
        >
          {dom}
        </div>
      )}
      actionsRender={() => [
        <a key="logout" onClick={logout}>
          Logout
        </a>,
      ]}
    >
      <Outlet />
    </ProLayout>
  );
}
