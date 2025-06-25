import { useState } from 'react';
import { Layout, Menu, Typography } from 'antd';
import { HomeOutlined, BookOutlined, LayoutOutlined } from '@ant-design/icons';
import App from './App';
import Documentation from './components/Documentation';

const { Header, Content } = Layout;
const { Title } = Typography;

type ViewMode = 'app' | 'docs' | 'split';

const AppRoutes = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('app');

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
      key: 'split',
      icon: <LayoutOutlined />,
      label: 'Split View',
    },
  ];

  const handleMenuClick = (e: { key: string }) => {
    setViewMode(e.key as ViewMode);
  };

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
      case 'split':
        return (
          <div style={{ 
            display: 'flex', 
            height: '100%',
            gap: '2px'
          }}>
            <div style={{ 
              flex: 1, 
              overflow: 'auto',
              borderRight: '1px solid #f0f0f0'
            }}>
              <div style={{ 
                background: '#f8f9fa', 
                padding: '8px 16px', 
                borderBottom: '1px solid #e9ecef',
                fontWeight: 'bold'
              }}>
                📝 Todo Application
              </div>
              <App />
            </div>
            <div style={{ 
              flex: 1, 
              overflow: 'auto'
            }}>
              <div style={{ 
                background: '#f8f9fa', 
                padding: '8px 16px', 
                borderBottom: '1px solid #e9ecef',
                fontWeight: 'bold'
              }}>
                📚 Documentation
              </div>
              <Documentation />
            </div>
          </div>
        );
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
        {/* Title and Navigation in one row */}
        <Title 
          level={3} 
          className="header-title"
          style={{ 
            margin: 0, 
            fontWeight: 'bold',
            color: 'white',
            fontSize: '20px'
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
            flex: 1
          }}
        />
      </Header>
      
      <Content style={{ height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
        {renderContent()}
      </Content>




    </Layout>
  );
};

export default AppRoutes; 