module todo_addr::todo_list {
    use std::signer;
    use std::string::{Self, String};
    use std::vector;
    use aptos_framework::account;
    use aptos_framework::event;
    use aptos_framework::timestamp;

    /// Error codes
    const E_TODO_DOESNT_EXIST: u64 = 1;
    const E_TODO_LIST_DOESNT_EXIST: u64 = 2;
    const E_INVALID_TODO_ID: u64 = 3;

    /// Todo item structure
    struct TodoItem has store, drop, copy {
        id: u64,
        task: String,
        completed: bool,
        created_at: u64,
    }

    /// Todo list resource for each user
    struct TodoList has key {
        todos: vector<TodoItem>,
        next_id: u64,
        set_todo_event: event::EventHandle<TodoItem>,
        task_counter: u64,
    }

    /// Initialize the todo list for a user
    public entry fun create_list(account: &signer) {
        let todo_list = TodoList {
            todos: vector::empty<TodoItem>(),
            next_id: 1,
            set_todo_event: account::new_event_handle<TodoItem>(account),
            task_counter: 0,
        };
        move_to(account, todo_list);
    }

    /// Add a new todo item
    public entry fun create_todo(account: &signer, task: string::String) acquires TodoList {
        let signer_address = signer::address_of(account);
        
        // Initialize todo list if it doesn't exist
        if (!exists<TodoList>(signer_address)) {
            create_list(account);
        };

        let todo_list = borrow_global_mut<TodoList>(signer_address);
        let new_todo = TodoItem {
            id: todo_list.next_id,
            task,
            completed: false,
            created_at: timestamp::now_seconds(),
        };

        vector::push_back(&mut todo_list.todos, new_todo);
        todo_list.next_id = todo_list.next_id + 1;
        todo_list.task_counter = todo_list.task_counter + 1;

        event::emit_event<TodoItem>(&mut todo_list.set_todo_event, new_todo);
    }

    /// Mark a todo as completed or uncompleted
    public entry fun complete_todo(account: &signer, todo_id: u64) acquires TodoList {
        let signer_address = signer::address_of(account);
        assert!(exists<TodoList>(signer_address), E_TODO_LIST_DOESNT_EXIST);

        let todo_list = borrow_global_mut<TodoList>(signer_address);
        let todos_len = vector::length(&todo_list.todos);
        
        let i = 0;
        while (i < todos_len) {
            let todo_ref = vector::borrow_mut(&mut todo_list.todos, i);
            if (todo_ref.id == todo_id) {
                todo_ref.completed = !todo_ref.completed;
                return
            };
            i = i + 1;
        };
        
        abort E_TODO_DOESNT_EXIST
    }

    /// Update a todo's task description
    public entry fun update_todo(account: &signer, todo_id: u64, new_task: String) acquires TodoList {
        let signer_address = signer::address_of(account);
        assert!(exists<TodoList>(signer_address), E_TODO_LIST_DOESNT_EXIST);

        let todo_list = borrow_global_mut<TodoList>(signer_address);
        let todos_len = vector::length(&todo_list.todos);
        
        let i = 0;
        while (i < todos_len) {
            let todo_ref = vector::borrow_mut(&mut todo_list.todos, i);
            if (todo_ref.id == todo_id) {
                todo_ref.task = new_task;
                return
            };
            i = i + 1;
        };
        
        abort E_TODO_DOESNT_EXIST
    }

    /// Delete a todo item
    public entry fun delete_todo(account: &signer, todo_id: u64) acquires TodoList {
        let signer_address = signer::address_of(account);
        assert!(exists<TodoList>(signer_address), E_TODO_LIST_DOESNT_EXIST);

        let todo_list = borrow_global_mut<TodoList>(signer_address);
        let todos_len = vector::length(&todo_list.todos);
        
        let i = 0;
        while (i < todos_len) {
            let todo_ref = vector::borrow(&todo_list.todos, i);
            if (todo_ref.id == todo_id) {
                vector::remove(&mut todo_list.todos, i);
                if (todo_list.task_counter > 0) {
                    todo_list.task_counter = todo_list.task_counter - 1;
                };
                return
            };
            i = i + 1;
        };
        
        abort E_TODO_DOESNT_EXIST
    }

    /// Get all todos for a user (view function)
    #[view]
    public fun get_todos(user_address: address): vector<TodoItem> acquires TodoList {
        if (!exists<TodoList>(user_address)) {
            return vector::empty<TodoItem>()
        };
        
        let todo_list = borrow_global<TodoList>(user_address);
        todo_list.todos
    }

    /// Get the number of todos for a user (view function)
    #[view]
    public fun get_todo_count(user_address: address): u64 acquires TodoList {
        if (!exists<TodoList>(user_address)) {
            return 0
        };
        
        let todo_list = borrow_global<TodoList>(user_address);
        todo_list.task_counter
    }

    /// Check if user has a todo list (view function)
    #[view]
    public fun has_todo_list(user_address: address): bool {
        exists<TodoList>(user_address)
    }
} 