import { useState, useCallback } from 'react';
import { Card, Input, Button, Space, Form, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Text } = Typography;

// Types
interface AddTodoProps {
  onAddTodo: (task: string) => Promise<void>;
  loading: boolean;
}

// Constants
const MAX_TASK_LENGTH = 280;
const MIN_TASK_LENGTH = 1;

const AddTodo = ({ onAddTodo, loading }: AddTodoProps) => {
  const [task, setTask] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Validate task input
  const validateTask = useCallback((taskText: string): boolean => {
    const trimmed = taskText.trim();
    return trimmed.length >= MIN_TASK_LENGTH && trimmed.length <= MAX_TASK_LENGTH;
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(async () => {
    const trimmedTask = task.trim();
    
    if (!validateTask(trimmedTask)) {
      return;
    }

    setSubmitting(true);
    
    try {
      await onAddTodo(trimmedTask);
      setTask(''); // Clear input on success
    } catch (error) {
      console.error('Error adding todo:', error);
      // Error is handled in parent component
    } finally {
      setSubmitting(false);
    }
  }, [task, onAddTodo, validateTask]);

  // Handle Enter key press
  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }, [handleSubmit]);

  // Handle input change with validation
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow typing but don't exceed max length
    if (value.length <= MAX_TASK_LENGTH) {
      setTask(value);
    }
  }, []);

  // Calculate character count and validation status
  const characterCount = task.length;
  const isValid = validateTask(task);
  const isDisabled = loading || submitting || !isValid;
  const remainingChars = MAX_TASK_LENGTH - characterCount;
  
  // Dynamic placeholder text
  const placeholderText = loading 
    ? "Loading..." 
    : "What needs to be done? (Press Enter to add)";

  return (
    <Card title="Add New Todo" style={{ marginBottom: 16 }}>
      <Form layout="vertical">
        <Space.Compact style={{ width: '100%' }}>
          <Input
            placeholder={placeholderText}
            value={task}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            disabled={loading || submitting}
            style={{ flex: 1 }}
            size="large"
            maxLength={MAX_TASK_LENGTH}
            showCount={{
              formatter: ({ count, maxLength }) => (
                <Text 
                  type={remainingChars < 20 ? 'warning' : 'secondary'}
                  style={{ fontSize: '12px' }}
                >
                  {count}/{maxLength}
                </Text>
              ),
            }}
            status={characterCount > 0 && !isValid ? 'error' : undefined}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleSubmit}
            loading={submitting}
            disabled={isDisabled}
            size="large"
          >
            Add Todo
          </Button>
        </Space.Compact>
        
        {/* Helper text */}
        {characterCount > 0 && (
          <div style={{ marginTop: 8 }}>
            {!isValid && characterCount < MIN_TASK_LENGTH && (
              <Text type="danger" style={{ fontSize: '12px' }}>
                Task must be at least {MIN_TASK_LENGTH} character
              </Text>
            )}
            {remainingChars < 20 && remainingChars >= 0 && (
              <Text type="warning" style={{ fontSize: '12px' }}>
                {remainingChars} characters remaining
              </Text>
            )}
          </div>
        )}
      </Form>
    </Card>
  );
};

export default AddTodo; 