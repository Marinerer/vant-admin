import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import Users from '../pages/Users'
import { ForbiddenPage, NotFoundPage, ServerErrorPage } from '../pages/ErrorPages'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'users', element: <Users /> },
      { path: 'settings', element: <div className="p-6">Settings Page</div> },
    ],
  },
  {
    path: '/403',
    element: <ForbiddenPage />,
  },
  {
    path: '/500',
    element: <ServerErrorPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
