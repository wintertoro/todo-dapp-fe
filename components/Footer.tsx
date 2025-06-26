import React from 'react';
import { Typography } from 'antd';

const { Text, Link } = Typography;

const Footer: React.FC = () => {
  return (
    <div style={{ 
      textAlign: 'center', 
      padding: '20px 0', 
      marginTop: '40px', 
      borderTop: '1px solid #f0f0f0',
      color: '#666'
    }}>
      <Text type="secondary" style={{ fontSize: '14px' }}>
        vibecoded by{' '}
        <Link 
          href="https://github.com/wintertoro" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ color: '#1890ff', fontWeight: 500 }}
        >
          @wintertoro
        </Link>
      </Text>
    </div>
  );
};

export default Footer; 