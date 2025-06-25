import { useState, useCallback, useMemo } from 'react';
import { Card, List, Button, Checkbox, Input, Space, Typography, Popconfirm, message, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';

const { Text } = Typography;

// Types
export interface TodoItem {
  id: number;
  task: string;
  completed: boolean;
  created_at: number;
}

interface TodoListProps {
  todos: TodoItem[];
  loading: boolean;
  onToggleTodo: (todoId: number) => Promise<void>;
  onUpdateTodo: (todoId: number, newTask: string) => Promise<void>;
  onDeleteTodo: (todoId: number) => Promise<void>;
}

// Constants
const MAX_TASK_LENGTH = 280;

const TodoList = ({
  todos,
  loading,
  onToggleTodo,
  onUpdateTodo,
  onDeleteTodo,
}: TodoListProps) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState<string>('');

  // Handlers with validation
  const handleEditStart = useCallback((todo: TodoItem) => {
    setEditingId(todo.id);
    setEditingText(todo.task);
  }, []);

  const handleEditSave = useCallback(async () => {
    if (!editingId || !editingText.trim()) {
      message.warning('Task cannot be empty');
      return;
    }

    if (editingText.length > MAX_TASK_LENGTH) {
      message.warning(`Task is too long (max ${MAX_TASK_LENGTH} characters)`);
      return;
    }

    try {
      await onUpdateTodo(editingId, editingText.trim());
      setEditingId(null);
      setEditingText('');
    } catch (error) {
      message.error('Failed to update todo');
      console.error('Error in handleEditSave:', error);
    }
  }, [editingId, editingText, onUpdateTodo]);

  const handleEditCancel = useCallback(() => {
    setEditingId(null);
    setEditingText('');
  }, []);

  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleEditSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleEditCancel();
    }
  }, [handleEditSave, handleEditCancel]);

  // Safe wrappers for async operations
  const safeToggleTodo = useCallback(async (todoId: number) => {
    try {
      await onToggleTodo(todoId);
    } catch (error) {
      message.error('Failed to update todo status');
      console.error('Error toggling todo:', error);
    }
  }, [onToggleTodo]);

  const safeDeleteTodo = useCallback(async (todoId: number) => {
    console.log('🔥 Delete button clicked for todo ID:', todoId);
    try {
      await onDeleteTodo(todoId);
      console.log('🔥 Delete completed successfully for todo ID:', todoId);
    } catch (error) {
      message.error('Failed to delete todo');
      console.error('🔥 Error deleting todo:', error);
    }
  }, [onDeleteTodo]);

  // Format date utility
  const formatDate = useCallback((timestamp: number): string => {
    try {
      return new Date(timestamp * 1000).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.warn('Error formatting date:', error);
      return 'Invalid date';
    }
  }, []);

  // Memoized statistics
  const todoStats = useMemo(() => {
    const completed = todos.filter(todo => todo.completed);
    const pending = todos.filter(todo => !todo.completed);
    
    return {
      total: todos.length,
      completed: completed.length,
      pending: pending.length,
      completionRate: todos.length > 0 ? Math.round((completed.length / todos.length) * 100) : 0
    };
  }, [todos]);

  // Memoized sorted todos (pending first, then completed)
  const sortedTodos = useMemo(() => {
    const pending = todos.filter(todo => !todo.completed);
    const completed = todos.filter(todo => todo.completed);
    return [...pending, ...completed];
  }, [todos]);

  // Memoized empty state
  const EmptyState = useMemo(() => (
    <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
      <Text>No todos yet. Add your first todo above! 📝</Text>
    </div>
  ), []);

  // Memoized completion summary
  const CompletionSummary = useMemo(() => {
    if (todoStats.completed === 0) return null;

    return (
      <Card size="small" title={`Completed (${todoStats.completed})`} style={{ marginTop: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Text type="secondary">
            🎉 Great job! You've completed {todoStats.completed} task{todoStats.completed !== 1 ? 's' : ''}.
          </Text>
          <Tag color="green">{todoStats.completionRate}% Complete</Tag>
        </div>
      </Card>
    );
  }, [todoStats]);

  // Render todo item
  const renderTodoItem = useCallback((todo: TodoItem) => {
    const isEditing = editingId === todo.id;
    const isDisabled = loading || isEditing;

    return (
      <List.Item
        key={todo.id}
        style={{
          opacity: todo.completed ? 0.7 : 1,
          background: todo.completed ? '#f5f5f5' : 'white',
          borderRadius: 8,
          marginBottom: 8,
          padding: '12px 16px',
          border: '1px solid #f0f0f0',
          transition: 'all 0.3s ease',
        }}
        actions={[
          <Button
            key="edit"
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditStart(todo)}
            disabled={isDisabled}
            size="small"
          />,
          <Popconfirm
            key="delete"
            title="Delete Todo"
            description={`Are you sure you want to delete "${todo.task}"?`}
            onConfirm={(e) => {
              e?.stopPropagation();
              console.log('🔥 Popconfirm confirmed for todo ID:', todo.id);
              safeDeleteTodo(todo.id);
            }}
            onCancel={(e) => {
              e?.stopPropagation();
              console.log('🔥 Popconfirm cancelled for todo ID:', todo.id);
            }}
            okText="Yes"
            cancelText="No"
            disabled={isDisabled}
            trigger="click"
            placement="topRight"
            overlayStyle={{ zIndex: 1050 }}
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              disabled={isDisabled}
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                console.log('🔥 Delete button clicked for todo ID:', todo.id, 'isDisabled:', isDisabled);
              }}
            />
          </Popconfirm>,
        ]}
      >
        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <Checkbox
            checked={todo.completed}
            onChange={() => safeToggleTodo(todo.id)}
            disabled={isDisabled}
            style={{ marginRight: 12 }}
          />
          
          <div style={{ flex: 1 }}>
            {isEditing ? (
              <Space.Compact style={{ width: '100%' }}>
                <Input
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  onKeyDown={handleKeyPress}
                  maxLength={MAX_TASK_LENGTH}
                  autoFocus
                  placeholder="Enter task description..."
                />
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={handleEditSave}
                  disabled={!editingText.trim()}
                />
                <Button
                  icon={<CloseOutlined />}
                  onClick={handleEditCancel}
                />
              </Space.Compact>
            ) : (
              <div>
                <Text
                  style={{
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    fontSize: '16px',
                    display: 'block',
                    marginBottom: 4,
                    wordBreak: 'break-word',
                  }}
                >
                  {todo.task}
                </Text>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    ID: {todo.id}
                  </Text>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    •
                  </Text>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    Created: {formatDate(todo.created_at)}
                  </Text>
                  {todo.completed && (
                    <Tag color="green">
                      Completed
                    </Tag>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </List.Item>
    );
  }, [
    editingId,
    editingText,
    loading,
    handleEditStart,
    handleKeyPress,
    handleEditSave,
    handleEditCancel,
    safeToggleTodo,
    safeDeleteTodo,
    formatDate
  ]);

  return (
    <div>
      <Card 
        title={`Todo List (${todoStats.total} total, ${todoStats.pending} pending)`}
        loading={loading}
        style={{ marginBottom: 16 }}
        extra={
          todoStats.total > 0 && (
            <Tag color={todoStats.completionRate === 100 ? 'green' : 'blue'}>
              {todoStats.completionRate}% Complete
            </Tag>
          )
        }
      >
        {todos.length === 0 ? (
          EmptyState
        ) : (
          <List
            dataSource={sortedTodos}
            renderItem={renderTodoItem}
            style={{ maxHeight: '600px', overflowY: 'auto' }}
          />
        )}
      </Card>

      {CompletionSummary}
    </div>
  );
};

export default TodoList; 