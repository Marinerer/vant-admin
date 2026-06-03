import { useRef } from 'react'
import { ProTable } from '@ant-design/pro-components'
import type { ProColumns, ActionType } from '@ant-design/pro-components'
import { Space, Button, message, Modal, Popconfirm } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { get, del } from '../utils/request'

interface DataType {
  id: number
  name: string
  email: string
  role: 'admin' | 'user' | 'editor'
  status: 'active' | 'inactive'
  phone: string
  createdAt: string
}

interface UserListResponse {
  list: DataType[]
  total: number
  current: number
  pageSize: number
}

export default function Users() {
  const actionRef = useRef<ActionType>(null)

  const handleDelete = (id: number) => {
    del(`/users/${id}`)
      .then(() => {
        message.success('删除成功')
        void actionRef.current?.reload()
      })
      .catch(() => {
        message.error('删除失败')
      })
  }

  const columns: ProColumns<DataType>[] = [
    {
      title: '姓名',
      dataIndex: 'name',
      search: true,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      search: false,
    },
    {
      title: '角色',
      dataIndex: 'role',
      valueEnum: {
        admin: { text: '管理员', status: 'Success' },
        user: { text: '普通用户', status: 'Default' },
        editor: { text: '编辑', status: 'Processing' },
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: {
        active: { text: '启用', status: 'Success' },
        inactive: { text: '禁用', status: 'Error' },
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      valueType: 'date',
      search: false,
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EditOutlined />}>
            编辑
          </Button>
          <Popconfirm title="确定要删除该用户吗？" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div className="p-6">
      <ProTable<DataType>
        columns={columns}
        actionRef={actionRef}
        rowKey="id"
        request={async (params) => {
          const { current, pageSize, name } = params
          const data = await get<UserListResponse>('/users', {
            current,
            pageSize,
            name,
          })
          return {
            data: data.list,
            success: true,
            total: data.total,
          }
        }}
        search={{
          labelWidth: 'auto',
        }}
        toolBarRender={() => [
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              Modal.info({
                title: '新增用户',
                content: '新增功能待实现（可通过调用 POST /api/users 完成）',
              })
            }}
          >
            新增用户
          </Button>,
        ]}
        pagination={{
          pageSize: 10,
        }}
      />
    </div>
  )
}
