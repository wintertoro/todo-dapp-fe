import {
  Aptos,
  AptosConfig,
  Network
} from "@aptos-labs/ts-sdk";

// Types
export interface TodoItem {
  id: number;
  task: string;
  completed: boolean;
  created_at: number;
}

interface TransactionResponse {
  hash: string;
}

type SignAndSubmitTransaction = (transaction: any) => Promise<TransactionResponse>;

// Constants
const FUNCTION_PATHS = {
  GET_TODOS: 'get_todos',
  GET_TODO_COUNT: 'get_todo_count',
  HAS_TODO_LIST: 'has_todo_list',
  CREATE_TODO: 'create_todo',
  COMPLETE_TODO: 'complete_todo',
  UPDATE_TODO: 'update_todo',
  DELETE_TODO: 'delete_todo',
} as const;

const MAX_TASK_LENGTH = 280;

export class AptosService {
  private readonly aptos: Aptos;
  private readonly contractAddress: string;
  private readonly signAndSubmitTransaction?: SignAndSubmitTransaction;
  private readonly accountAddress?: string;

  constructor(signAndSubmitTransaction?: SignAndSubmitTransaction, accountAddress?: string) {
    // Network configuration with validation
    const networkString = import.meta.env.VITE_APTOS_NETWORK || 'testnet';
    const network = networkString as Network;
    
    if (!Object.values(Network).includes(network)) {
      throw new Error(`Invalid network: ${networkString}. Must be one of: ${Object.values(Network).join(', ')}`);
    }

    const config = new AptosConfig({ network });
    this.aptos = new Aptos(config);
    
    // Contract address validation
    this.contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
    if (!this.contractAddress) {
      throw new Error('Contract address not configured. Please set VITE_CONTRACT_ADDRESS in your .env file.');
    }

    this.signAndSubmitTransaction = signAndSubmitTransaction;
    this.accountAddress = accountAddress;
  }

  // Helper method to build function path
  private buildFunctionPath(functionName: string): `${string}::${string}::${string}` {
    return `${this.contractAddress}::todo_list::${functionName}` as `${string}::${string}::${string}`;
  }

  // Helper method for error handling
  private handleError(error: unknown, operation: string): never {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Error in ${operation}:`, error);
    throw new Error(`Failed to ${operation}: ${message}`);
  }

  // Get todos for a specific user
  async getTodos(userAddress: string): Promise<TodoItem[]> {
    if (!userAddress) {
      throw new Error('User address is required');
    }

    try {
      const response = await this.aptos.view({
        payload: {
          function: this.buildFunctionPath(FUNCTION_PATHS.GET_TODOS),
          functionArguments: [userAddress],
        }
      });

      // Transform and validate the response
      const todos = response[0] as any[];
      if (!Array.isArray(todos)) {
        return [];
      }

      return todos.map((todo: any) => ({
        id: Number(todo.id),
        task: String(todo.task),
        completed: Boolean(todo.completed),
        created_at: Number(todo.created_at),
      }));
    } catch (error) {
      console.error('Error fetching todos:', error);
      return []; // Return empty array instead of throwing for getter methods
    }
  }

  // Get todo count for a user
  async getTodoCount(userAddress: string): Promise<number> {
    if (!userAddress) {
      return 0;
    }

    try {
      const response = await this.aptos.view({
        payload: {
          function: this.buildFunctionPath(FUNCTION_PATHS.GET_TODO_COUNT),
          functionArguments: [userAddress],
        }
      });
      
      return Number(response[0]) || 0;
    } catch (error) {
      console.error('Error fetching todo count:', error);
      return 0;
    }
  }

  // Create a new todo
  async createTodo(task: string): Promise<void> {
    this.validateTransaction();
    this.validateTask(task);

    if (!this.signAndSubmitTransaction || !this.accountAddress) {
      throw new Error('Wallet not connected or account address not available');
    }

    const functionPath = this.buildFunctionPath(FUNCTION_PATHS.CREATE_TODO);
    console.log('Creating todo with:', {
      function: functionPath,
      task: task.trim(),
      contractAddress: this.contractAddress,
      sender: this.accountAddress
    });

    try {
      const transaction = {
        sender: this.accountAddress,
        data: {
          function: functionPath,
          typeArguments: [],
          functionArguments: [task.trim()],
        }
      };

      console.log('Submitting transaction...', transaction);
      const response = await this.signAndSubmitTransaction(transaction);
      console.log('Transaction submitted:', response.hash);
      
      await this.waitForTransaction(response.hash);
      console.log('Transaction confirmed:', response.hash);
    } catch (error) {
      console.error('Detailed error in createTodo:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        contractAddress: this.contractAddress
      });
      this.handleError(error, 'create todo');
    }
  }

  // Toggle todo completion status
  async completeTodo(todoId: number): Promise<void> {
    this.validateTransaction();
    this.validateTodoId(todoId);

    if (!this.signAndSubmitTransaction || !this.accountAddress) {
      throw new Error('Wallet not connected or account address not available');
    }

    try {
              const transaction = {
          sender: this.accountAddress,
          data: {
            function: this.buildFunctionPath(FUNCTION_PATHS.COMPLETE_TODO),
            typeArguments: [],
            functionArguments: [todoId],
          }
        };

      const response = await this.signAndSubmitTransaction(transaction);
      await this.waitForTransaction(response.hash);
    } catch (error) {
      this.handleError(error, 'complete todo');
    }
  }

  // Update todo task
  async updateTodo(todoId: number, newTask: string): Promise<void> {
    this.validateTransaction();
    this.validateTodoId(todoId);
    this.validateTask(newTask);

    if (!this.signAndSubmitTransaction || !this.accountAddress) {
      throw new Error('Wallet not connected or account address not available');
    }

    try {
              const transaction = {
          sender: this.accountAddress,
          data: {
            function: this.buildFunctionPath(FUNCTION_PATHS.UPDATE_TODO),
            typeArguments: [],
            functionArguments: [todoId, newTask.trim()],
          }
        };

      const response = await this.signAndSubmitTransaction(transaction);
      await this.waitForTransaction(response.hash);
    } catch (error) {
      this.handleError(error, 'update todo');
    }
  }

  // Delete a todo
  async deleteTodo(todoId: number): Promise<void> {
    this.validateTransaction();
    this.validateTodoId(todoId);

    if (!this.signAndSubmitTransaction || !this.accountAddress) {
      throw new Error('Wallet not connected or account address not available');
    }

    const functionPath = this.buildFunctionPath(FUNCTION_PATHS.DELETE_TODO);
    console.log('🗑️ Deleting todo with:', {
      function: functionPath,
      todoId,
      contractAddress: this.contractAddress,
      sender: this.accountAddress
    });

    try {
              const transaction = {
          sender: this.accountAddress,
          data: {
            function: functionPath,
            typeArguments: [],
            functionArguments: [todoId],
          }
        };

      console.log('🗑️ Submitting delete transaction...', transaction);
      const response = await this.signAndSubmitTransaction(transaction);
      console.log('🗑️ Delete transaction submitted:', response.hash);
      
      await this.waitForTransaction(response.hash);
      console.log('🗑️ Delete transaction confirmed:', response.hash);
    } catch (error) {
      console.error('🗑️ Detailed error in deleteTodo:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        todoId,
        contractAddress: this.contractAddress
      });
      this.handleError(error, 'delete todo');
    }
  }

  // Check if user has a todo list
  async hasTodoList(userAddress: string): Promise<boolean> {
    if (!userAddress) {
      return false;
    }

    try {
      const response = await this.aptos.view({
        payload: {
          function: this.buildFunctionPath(FUNCTION_PATHS.HAS_TODO_LIST),
          functionArguments: [userAddress],
        }
      });
      
      return Boolean(response[0]);
    } catch (error) {
      console.error('Error checking todo list:', error);
      return false;
    }
  }

  // Private validation methods
  private validateTransaction(): void {
    if (!this.signAndSubmitTransaction) {
      throw new Error('Wallet not connected. Please connect your wallet to perform this action.');
    }
  }

  private validateTodoId(todoId: number): void {
    if (!Number.isInteger(todoId) || todoId <= 0) {
      throw new Error('Invalid todo ID. Must be a positive integer.');
    }
  }

  private validateTask(task: string): void {
    if (!task || task.trim().length === 0) {
      throw new Error('Task cannot be empty');
    }

    if (task.length > MAX_TASK_LENGTH) {
      throw new Error(`Task is too long (max ${MAX_TASK_LENGTH} characters)`);
    }
  }

  // Wait for transaction confirmation with timeout
  private async waitForTransaction(transactionHash: string): Promise<void> {
    try {
      await this.aptos.waitForTransaction({
        transactionHash,
      });
    } catch (error) {
      throw new Error(`Transaction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Utility methods
  isConfigured(): boolean {
    return Boolean(this.contractAddress && this.aptos);
  }

  getNetwork(): string {
    return import.meta.env.VITE_APTOS_NETWORK || 'testnet';
  }

  getContractAddress(): string {
    return this.contractAddress;
  }

  // Debug method to verify configuration
  async verifyConfiguration(userAddress?: string): Promise<void> {
    console.log('🔍 Verifying Aptos Service Configuration:');
    console.log('- Network:', this.getNetwork());
    console.log('- Contract Address:', this.contractAddress);
    console.log('- Sign Function Available:', Boolean(this.signAndSubmitTransaction));
    console.log('- Service Configured:', this.isConfigured());
    
    if (userAddress) {
      console.log('- User Address:', userAddress);
      
      try {
        const hasList = await this.hasTodoList(userAddress);
        console.log('- User has todo list:', hasList);
        
        const todoCount = await this.getTodoCount(userAddress);
        console.log('- Todo count:', todoCount);
      } catch (error) {
        console.error('- Error checking user data:', error);
      }
    }
  }
} 