import { Card, Typography, Divider, Space, List, Tag, BackTop } from 'antd';
import { BookOutlined, CodeOutlined, ApiOutlined, SettingOutlined, BugOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph, Link } = Typography;

const Documentation = () => {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
      <Card>
        <Title level={1}>
          <BookOutlined /> Aptos Todo List dApp Documentation
        </Title>
        <Paragraph style={{ fontSize: '16px' }}>
          A fully decentralized todo list application built on the Aptos blockchain. This dApp stores all
          todo data on-chain using Move smart contracts, ensuring permanence, transparency, and true ownership
          of your data. No traditional databases or centralized servers required!
        </Paragraph>
        
        <Card style={{ background: '#e6f7ff', border: '1px solid #91d5ff', marginBottom: 16 }}>
          <Title level={4} style={{ color: '#1890ff', margin: '0 0 8px 0' }}>
            🚀 How It Works
          </Title>
          <List size="small">
            <List.Item>1. Connect your Aptos wallet (Petra, Martian, or Pontem)</List.Item>
            <List.Item>2. Create todos that are permanently stored on the Aptos blockchain</List.Item>
            <List.Item>3. Mark todos as complete, edit them, or delete them - all on-chain</List.Item>
            <List.Item>4. Your todos are tied to your wallet address and persist forever</List.Item>
          </List>
        </Card>
        
        <Title level={3}>Key Features</Title>
        <List
          dataSource={[
            '✅ Create, read, update, and delete todos on-chain',
            '🔒 Secure wallet integration with multiple wallet support',
            '⚡ Real-time blockchain state synchronization',
            '💾 Permanent data storage on Aptos blockchain',
            '🎨 Modern UI with Ant Design components',
            '📱 Responsive design for desktop and mobile',
            '🔍 Comprehensive error handling and loading states',
            '⏰ Automatic timestamp tracking for all todos'
          ]}
          renderItem={(item) => <List.Item>{item}</List.Item>}
        />
        
        <Divider />
        
        <Title level={2}>
          <SettingOutlined /> Getting Started
        </Title>
        
        <Title level={3}>Prerequisites</Title>
        <List
          dataSource={[
            'An Aptos wallet (Petra, Martian, or Pontem)',
            'Testnet APT tokens for transactions'
          ]}
          renderItem={(item) => <List.Item>• {item}</List.Item>}
        />
        
        <Divider />
        
        <Title level={2}>
          <ApiOutlined /> Smart Contract Overview
        </Title>
        <Paragraph>
          This dApp uses a <Text strong>Move smart contract</Text> written for the <Text strong>Aptos blockchain</Text>. 
          The contract provides a decentralized todo list manager that stores all todo data directly on-chain, 
          ensuring permanence and user ownership.
        </Paragraph>
        
        <Card style={{ background: '#f0f8ff', border: '1px solid #91caff', marginBottom: 16 }}>
          <Title level={4} style={{ color: '#1677ff', margin: '0 0 8px 0' }}>
            📋 Contract Module: <Text code>todo_addr::todo_list</Text>
          </Title>
          <Text>
            A production-ready Move smart contract that demonstrates best practices for Aptos development 
            including proper resource management, error handling, and view functions for efficient data retrieval.
          </Text>
        </Card>

        <Title level={3}>Key Data Structures</Title>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Card type="inner" size="small">
            <Title level={4}>TodoItem</Title>
            <Text>Individual todo item structure stored on-chain:</Text>
            <List size="small" style={{ marginTop: 8 }}>
              <List.Item><Text code>id: u64</Text> - Unique identifier</List.Item>
              <List.Item><Text code>task: String</Text> - Todo description</List.Item>
              <List.Item><Text code>completed: bool</Text> - Completion status</List.Item>
              <List.Item><Text code>created_at: u64</Text> - Unix timestamp when created</List.Item>
            </List>
          </Card>
          
          <Card type="inner" size="small">
            <Title level={4}>TodoList (User Resource)</Title>
            <Text>Per-user resource containing all todos and metadata:</Text>
            <List size="small" style={{ marginTop: 8 }}>
              <List.Item><Text code>todos: vector&lt;TodoItem&gt;</Text> - User's todo items</List.Item>
              <List.Item><Text code>next_id: u64</Text> - Auto-incrementing ID counter</List.Item>
              <List.Item><Text code>set_todo_event: EventHandle</Text> - Event emission for frontend reactivity</List.Item>
              <List.Item><Text code>task_counter: u64</Text> - Total todo count</List.Item>
            </List>
          </Card>
        </Space>

        <Title level={3}>Smart Contract Features</Title>
        <List
          dataSource={[
            '👤 Per-User Storage - Each user has their own TodoList resource',
            '🚀 Auto-Initialization - Todo list created automatically on first use',
            '📡 Event Emission - Emits events for frontend reactivity',
            '⏰ Timestamp Tracking - Uses timestamp::now_seconds() for creation time',
            '🛡️ Error Handling - Proper error codes for invalid operations',
            '🔄 CRUD Operations - Full create, read, update, delete functionality'
          ]}
          renderItem={(item) => <List.Item>{item}</List.Item>}
        />

        <Title level={3}>Smart Contract Functions</Title>
        
        <Title level={4}>Entry Functions (Transactions) <Tag color="blue">Modify State</Tag></Title>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Card type="inner" size="small">
            <Title level={5}>create_todo</Title>
            <Paragraph>Creates a new todo item and automatically initializes the user's TodoList if it doesn't exist. Uses <Text code>timestamp::now_seconds()</Text> for accurate timestamps.</Paragraph>
            <Text strong>Move Signature:</Text><br />
            <Text code>public entry fun create_todo(account: &signer, task: String)</Text><br />
            <Text strong>Frontend Usage:</Text><br />
            <Text code>await aptosService.createTodo("Buy groceries");</Text>
          </Card>
          
          <Card type="inner" size="small">
            <Title level={5}>complete_todo</Title>
            <Paragraph>Toggles the completion status of a todo item. Uses vector iteration to find the matching todo ID.</Paragraph>
            <Text strong>Move Signature:</Text><br />
            <Text code>public entry fun complete_todo(account: &signer, todo_id: u64)</Text><br />
            <Text strong>Frontend Usage:</Text><br />
            <Text code>await aptosService.completeTodo(1);</Text>
          </Card>
          
          <Card type="inner" size="small">
            <Title level={5}>update_todo</Title>
            <Paragraph>Updates the task description of an existing todo item. Finds the todo by ID and modifies the task field.</Paragraph>
            <Text strong>Move Signature:</Text><br />
            <Text code>public entry fun update_todo(account: &signer, todo_id: u64, new_task: String)</Text><br />
            <Text strong>Frontend Usage:</Text><br />
            <Text code>await aptosService.updateTodo(1, "Buy organic groceries");</Text>
          </Card>
          
          <Card type="inner" size="small">
            <Title level={5}>delete_todo</Title>
            <Paragraph>Permanently removes a todo item from the user's vector and decrements the task counter.</Paragraph>
            <Text strong>Move Signature:</Text><br />
            <Text code>public entry fun delete_todo(account: &signer, todo_id: u64)</Text><br />
            <Text strong>Frontend Usage:</Text><br />
            <Text code>await aptosService.deleteTodo(1);</Text>
          </Card>
        </Space>
        
        <Title level={4}>View Functions (Read-only) <Tag color="green">Query State</Tag></Title>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Card type="inner" size="small">
            <Title level={5}>get_todos</Title>
            <Paragraph>Retrieves all todos for a specific user. Returns empty vector if user has no TodoList.</Paragraph>
            <Text strong>Move Signature:</Text><br />
            <Text code>#[view] public fun get_todos(user_address: address): vector&lt;TodoItem&gt;</Text><br />
            <Text strong>Frontend Usage:</Text><br />
            <Text code>const todos = await aptosService.getTodos(userAddress);</Text>
          </Card>
          
          <Card type="inner" size="small">
            <Title level={5}>get_todo_count</Title>
            <Paragraph>Returns the total number of todos for a user using the task_counter field.</Paragraph>
            <Text strong>Move Signature:</Text><br />
            <Text code>#[view] public fun get_todo_count(user_address: address): u64</Text><br />
            <Text strong>Frontend Usage:</Text><br />
            <Text code>const count = await aptosService.getTodoCount(userAddress);</Text>
          </Card>
          
          <Card type="inner" size="small">
            <Title level={5}>has_todo_list</Title>
            <Paragraph>Checks if a user has initialized their TodoList resource.</Paragraph>
            <Text strong>Move Signature:</Text><br />
            <Text code>#[view] public fun has_todo_list(user_address: address): bool</Text><br />
            <Text strong>Frontend Usage:</Text><br />
            <Text code>const hasList = await aptosService.hasTodoList(userAddress);</Text>
          </Card>
        </Space>
        
        <Divider />
        
        <Title level={2}>
          <CodeOutlined /> Frontend Components
        </Title>
        
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Card type="inner" size="small">
            <Title level={4}>App</Title>
            <Paragraph>Main application component with wallet integration and state management</Paragraph>
            <Text strong>Features:</Text>
            <List size="small">
              <List.Item>• Wallet connection management</List.Item>
              <List.Item>• Todo CRUD operations</List.Item>
              <List.Item>• Error handling and loading states</List.Item>
            </List>
          </Card>
          
          <Card type="inner" size="small">
            <Title level={4}>WalletConnection</Title>
            <Paragraph>Wallet connection UI with support for multiple Aptos wallets</Paragraph>
            <Text strong>Features:</Text>
            <List size="small">
              <List.Item>• Multi-wallet support (Petra, Martian, Pontem)</List.Item>
              <List.Item>• Connection status display</List.Item>
              <List.Item>• Account info dropdown</List.Item>
            </List>
          </Card>
          
          <Card type="inner" size="small">
            <Title level={4}>TodoList</Title>
            <Paragraph>Displays and manages the list of todos with CRUD operations</Paragraph>
            <Text strong>Features:</Text>
            <List size="small">
              <List.Item>• Inline editing</List.Item>
              <List.Item>• Completion tracking</List.Item>
              <List.Item>• Delete confirmation</List.Item>
              <List.Item>• Statistics display</List.Item>
            </List>
          </Card>
        </Space>
        
        <Divider />
        
        <Title level={2}>Technology Stack</Title>
        
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Card type="inner" size="small">
            <Title level={4}>Blockchain</Title>
            <Space wrap>
              <Tag color="blue">Aptos Blockchain</Tag>
              <Tag color="blue">Move Language</Tag>
              <Tag color="blue">Aptos TypeScript SDK</Tag>
            </Space>
          </Card>
          
          <Card type="inner" size="small">
            <Title level={4}>Frontend</Title>
            <Space wrap>
              <Tag color="green">React 18</Tag>
              <Tag color="green">TypeScript</Tag>
              <Tag color="green">Vite</Tag>
              <Tag color="green">Ant Design</Tag>
            </Space>
          </Card>
          
          <Card type="inner" size="small">
            <Title level={4}>Wallet Integration</Title>
            <Space wrap>
              <Tag color="purple">Aptos Wallet Adapter</Tag>
              <Tag color="purple">Petra Wallet</Tag>
              <Tag color="purple">Martian Wallet</Tag>
              <Tag color="purple">Pontem Wallet</Tag>
            </Space>
          </Card>
        </Space>
        
        <Divider />
        
        <Title level={2}>
          <BugOutlined /> Troubleshooting
        </Title>
        
        <Title level={3}>Common Issues</Title>
        <List
          dataSource={[
            {
              problem: 'Wallet connection fails',
              solution: 'Ensure your wallet is installed and set to testnet mode. Try refreshing the page.'
            },
            {
              problem: 'Transaction fails with insufficient funds',
              solution: (
                <span>
                  Get testnet APT tokens from the{' '}
                  <Link 
                    href="https://www.aptosfaucet.com/" 
                    target="_blank"
                    style={{ color: '#1890ff', fontWeight: 'bold' }}
                  >
                    Aptos faucet 🚰
                  </Link>
                  {' '}(opens in new tab)
                </span>
              )
            },
            {
              problem: 'Contract address not found',
              solution: 'Verify VITE_CONTRACT_ADDRESS is set correctly in your .env file'
            },
            {
              problem: 'Todos not loading',
              solution: 'Check browser console for errors. Ensure wallet is connected and contract is deployed.'
            }
          ]}
          renderItem={(item) => (
            <List.Item>
              <div>
                <Text strong>Problem:</Text> {item.problem}
                <br />
                <Text strong>Solution:</Text> {item.solution}
              </div>
            </List.Item>
          )}
        />
      </Card>
      
      <BackTop />
    </div>
  );
};

export default Documentation; 