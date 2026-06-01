import { ProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import { Space, Button } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

interface DataType {
  id: number;
  name: string;
  status: 'active' | 'inactive';
  role: string;
  email: string;
  createdAt: string;
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
    render: () => (
      <Space>
        <Button type="link" icon={<EditOutlined />}>
          编辑
        </Button>
        <Button type="link" danger icon={<DeleteOutlined />}>
          删除
        </Button>
      </Space>
    ),
  },
];

const mockData: DataType[] = [
  {
    id: 1,
    name: '张三',
    email: 'zhangsan@example.com',
    role: 'admin',
    status: 'active',
    createdAt: '2024-01-15',
  },
  {
    id: 2,
    name: '李四',
    email: 'lisi@example.com',
    role: 'user',
    status: 'active',
    createdAt: '2024-02-20',
  },
  {
    id: 3,
    name: '王五',
    email: 'wangwu@example.com',
    role: 'editor',
    status: 'inactive',
    createdAt: '2024-03-10',
  },
];

export default function Users() {
  return (
    <div className="p-6">
      <ProTable<DataType>
        columns={columns}
        dataSource={mockData}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        toolBarRender={() => [
          <Button key="add" type="primary" icon={<PlusOutlined />}>
            新增用户
          </Button>,
        ]}
        pagination={{
          pageSize: 10,
        }}
      />
    </div>
  );
}
