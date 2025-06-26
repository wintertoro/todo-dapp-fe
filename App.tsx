import { useState, useEffect, useCallback, useMemo } from 'react'
import { Card, Space, notification, Typography } from 'antd'
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import TodoList from './components/TodoList'
import AddTodo from './components/AddTodo'
import WalletHelper from './components/WalletHelper'
import Footer from './components/Footer'
import { AptosService, TodoItem } from './services/aptosService'
import './App.css'

const { Title, Text } = Typography;

// Constants
const NOTIFICATION_DURATION = 4.5;

// Types
interface AppState {
  todos: TodoItem[];
  loading: boolean;
  aptosService: AptosService | null;
}

function App() {
  const { connected, account, signAndSubmitTransaction } = useWallet();
  
  // State management
  const [state, setState] = useState<AppState>({
    todos: [],
    loading: false,
    aptosService: null,
  });

  // Memoized Aptos service creation
  const aptosService = useMemo(() => {
    if (connected && account && signAndSubmitTransaction) {
      try {
        return new AptosService(signAndSubmitTransaction, account.address);
      } catch (error) {
        console.error('Failed to initialize Aptos service:', error);
        notification.error({
          message: 'Service Error',
          description: 'Failed to initialize blockchain service',
          duration: NOTIFICATION_DURATION,
        });
        return null;
      }
    }
    return null;
  }, [connected, account, signAndSubmitTransaction]);

  // Load todos function
  const loadTodos = useCallback(async (service: AptosService) => {
    if (!account?.address) return;
    
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      const userTodos = await service.getTodos(account.address);
      setState(prev => ({ 
        ...prev, 
        todos: userTodos,
        loading: false 
      }));
    } catch (error) {
      console.error('Error loading todos:', error);
      notification.error({
        message: 'Loading Error',
        description: 'Failed to load todos from blockchain',
        duration: NOTIFICATION_DURATION,
      });
      setState(prev => ({ 
        ...prev, 
        loading: false 
      }));
    }
  }, [account?.address]);

  // Initialize service and load todos when wallet connects
  useEffect(() => {
    if (aptosService && account) {
      setState(prev => ({ ...prev, aptosService }));
      
      // Debug configuration
      aptosService.verifyConfiguration(account.address).then(() => {
        console.log('✅ Configuration verified, loading todos...');
        loadTodos(aptosService);
      }).catch((error) => {
        console.error('❌ Configuration verification failed:', error);
        loadTodos(aptosService); // Try to load anyway
      });
    } else {
      setState(prev => ({ 
        ...prev, 
        aptosService: null, 
        todos: [] 
      }));
    }
  }, [aptosService, loadTodos, account]);

  // Handler functions with improved error handling
  const handleAddTodo = useCallback(async (task: string) => {
    if (!state.aptosService || !account) return;

    setState(prev => ({ ...prev, loading: true }));
    
    try {
      await state.aptosService.createTodo(task);
      await loadTodos(state.aptosService);
      notification.success({
        message: 'Success',
        description: 'To-do added successfully!',
        duration: NOTIFICATION_DURATION,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add to-do';
      console.error('Error adding to-do:', error);
      notification.error({
        message: 'Error',
        description: errorMessage,
        duration: NOTIFICATION_DURATION,
      });
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [state.aptosService, account, loadTodos]);

  const handleToggleTodo = useCallback(async (todoId: number) => {
    if (!state.aptosService || !account) return;

    setState(prev => ({ ...prev, loading: true }));
    
    try {
      await state.aptosService.completeTodo(todoId);
      await loadTodos(state.aptosService);
      notification.success({
        message: 'Success',
        description: 'To-do updated successfully!',
        duration: NOTIFICATION_DURATION,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update to-do';
      console.error('Error toggling to-do:', error);
      notification.error({
        message: 'Error',
        description: errorMessage,
        duration: NOTIFICATION_DURATION,
      });
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [state.aptosService, account, loadTodos]);

  const handleUpdateTodo = useCallback(async (todoId: number, newTask: string) => {
    if (!state.aptosService || !account) return;

    setState(prev => ({ ...prev, loading: true }));
    
    try {
      await state.aptosService.updateTodo(todoId, newTask);
      await loadTodos(state.aptosService);
      notification.success({
        message: 'Success',
        description: 'To-do updated successfully!',
        duration: NOTIFICATION_DURATION,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update to-do';
      console.error('Error updating to-do:', error);
      notification.error({
        message: 'Error',
        description: errorMessage,
        duration: NOTIFICATION_DURATION,
      });
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [state.aptosService, account, loadTodos]);

  const handleDeleteTodo = useCallback(async (todoId: number) => {
    if (!state.aptosService || !account) return;

    setState(prev => ({ ...prev, loading: true }));
    
    try {
      await state.aptosService.deleteTodo(todoId);
      await loadTodos(state.aptosService);
      notification.success({
        message: 'Success',
        description: 'To-do deleted successfully!',
        duration: NOTIFICATION_DURATION,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete to-do';
      console.error('Error deleting to-do:', error);
      notification.error({
        message: 'Error',
        description: errorMessage,
        duration: NOTIFICATION_DURATION,
      });
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [state.aptosService, account, loadTodos]);

  // Memoized components for performance
  const WelcomeCard = useMemo(() => (
    <Card className="welcome-card">
      <div className="welcome-content">
        <Title level={3}>Welcome to Aptos To-do List! 🚀</Title>
        <Text>
          Connect your Aptos wallet to start managing your to-dos on the blockchain.
          Your to-dos will be stored securely and immutably on the Aptos network.
        </Text>
        <Space direction="vertical" size="middle" style={{ marginTop: 20 }}>
          <Text strong>Features:</Text>
          <ul>
            <li>✅ Create, update, and delete to-dos</li>
            <li>🔒 Secure blockchain storage</li>
            <li>💰 Low transaction fees</li>
            <li>🌐 Decentralized and censorship-resistant</li>
          </ul>
        </Space>
      </div>
    </Card>
  ), []);

  return (
    <div className="app-content" style={{ padding: '24px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="content-container" style={{ maxWidth: 1200, margin: '0 auto', flex: 1 }}>
        <Space direction="horizontal" size="large" style={{ width: '100%', marginBottom: 16, justifyContent: 'space-between', alignItems: 'center', display: 'flex' }}>
          <WalletHelper />
        </Space>
        {!connected ? (
          WelcomeCard
        ) : (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <AddTodo onAddTodo={handleAddTodo} loading={state.loading} />
            <TodoList
              todos={state.todos}
              loading={state.loading}
              onToggleTodo={handleToggleTodo}
              onUpdateTodo={handleUpdateTodo}
              onDeleteTodo={handleDeleteTodo}
            />
          </Space>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default App 