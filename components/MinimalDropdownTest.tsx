import { Dropdown, Button } from 'antd';

const menu = {
  items: [
    { key: '1', label: 'Option 1' },
    { key: '2', label: 'Option 2' },
    { key: '3', label: 'Option 3' },
  ],
  onClick: ({ key }: { key: string }) => {
    console.log('Minimal Dropdown selected:', key);
  }
};

export default function MinimalDropdownTest() {
  return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <Dropdown menu={menu} trigger={['click']}>
        <Button type="primary">Minimal Dropdown</Button>
      </Dropdown>
    </div>
  );
} 