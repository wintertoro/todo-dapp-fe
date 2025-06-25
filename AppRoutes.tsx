import { useState } from 'react';
import { Layout, Menu, Typography, Input, Button, Spin, Card } from 'antd';
import { HomeOutlined, BookOutlined, SearchOutlined } from '@ant-design/icons';
import App from './App';
import Documentation from './components/Documentation';
import TodoList from './components/TodoList';
import { AptosService, TodoItem } from './services/aptosService';
import WalletConnection from './components/WalletConnection';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

type ViewMode = 'app' | 'docs' | 'other';

const AppRoutes = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('app');
  // State for the new page
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const menuItems = [
    {
      key: 'app',
      icon: <HomeOutlined />,
      label: 'Todo App',
    },
    {
      key: 'docs',
      icon: <BookOutlined />,
      label: 'Documentation',
    },
    {
      key: 'other',
      icon: <SearchOutlined />,
      label: "View Other's Todos",
    },
  ];

  const handleMenuClick = (e: { key: string }) => {
    setViewMode(e.key as ViewMode);
  };

  // Handler for address input and fetch
  const handleFetchTodos = async () => {
    setError(null);
    setTodos([]);
    setLoading(true);
    try {
      const service = new AptosService();
      const result = await service.getTodos(address.trim());
      setTodos(result);
      if (result.length === 0) setError('No todos found for this address.');
    } catch (err: any) {
      setError('Failed to fetch todos.');
    } finally {
      setLoading(false);
    }
  };

  const renderOtherTodos = () => (
    <Card title="View Another User's Todo List" style={{ maxWidth: 500, margin: '32px auto' }}>
      <Input
        placeholder="Enter Aptos address"
        value={address}
        onChange={e => setAddress(e.target.value)}
        style={{ marginBottom: 12 }}
        onPressEnter={handleFetchTodos}
        allowClear
      />
      <Button
        type="primary"
        icon={<SearchOutlined />}
        onClick={handleFetchTodos}
        loading={loading}
        disabled={!address.trim()}
        style={{ marginBottom: 16 }}
        block
      >
        View Todos
      </Button>
      {loading && <Spin style={{ display: 'block', margin: '16px auto' }} />}
      {error && <Text type="danger">{error}</Text>}
      {!loading && todos.length > 0 && (
        <TodoList
          todos={todos}
          loading={false}
          onToggleTodo={async () => {}}
          onUpdateTodo={async () => {}}
          onDeleteTodo={async () => {}}
        />
      )}
    </Card>
  );

  const renderContent = () => {
    switch (viewMode) {
      case 'app':
        return (
          <div style={{ height: '100%', overflow: 'auto' }}>
            <App />
          </div>
        );
      case 'docs':
        return (
          <div style={{ height: '100%', overflow: 'auto' }}>
            <Documentation />
          </div>
        );
      case 'other':
        return renderOtherTodos();
      default:
        return (
          <div style={{ height: '100%', overflow: 'auto' }}>
            <App />
          </div>
        );
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        background: '#001529', 
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '32px',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        {/* Header flex: left = title/menu, right = wallet */}
        <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
          <Title 
            level={3} 
            className="header-title"
            style={{ 
              margin: 0, 
              fontWeight: 'bold',
              color: 'white',
              fontSize: '20px',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            📝 Aptos Todo List
          </Title>
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[viewMode]}
            items={menuItems}
            onClick={handleMenuClick}
            style={{ 
              background: 'transparent',
              border: 'none',
              lineHeight: '64px',
              flex: 1,
              minWidth: 0,
              marginLeft: '32px'
            }}
          />
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
          <WalletConnection />
        </div>
      </Header>
      
      <Content style={{ height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
        {renderContent()}
      </Content>
    </Layout>
  );
};

export default AppRoutes; 