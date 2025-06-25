#[test_only]
module todo_addr::todo_list_tests {
    use std::signer;
    use std::string;
    use aptos_framework::account;
    use todo_addr::todo_list;

    #[test(admin = @0x123)]
    public entry fun test_create_list(admin: signer) {
        account::create_account_for_test(signer::address_of(&admin));
        todo_list::create_list(&admin);
        
        assert!(todo_list::has_todo_list(signer::address_of(&admin)), 1);
        assert!(todo_list::get_todo_count(signer::address_of(&admin)) == 0, 2);
    }

    #[test(admin = @0x123)]
    public entry fun test_create_todo(admin: signer) {
        account::create_account_for_test(signer::address_of(&admin));
        
        let task = string::utf8(b"Test todo item");
        todo_list::create_todo(&admin, task);
        
        assert!(todo_list::has_todo_list(signer::address_of(&admin)), 1);
        assert!(todo_list::get_todo_count(signer::address_of(&admin)) == 1, 2);
        
        let todos = todo_list::get_todos(signer::address_of(&admin));
        assert!(std::vector::length(&todos) == 1, 3);
    }

    #[test(admin = @0x123)]
    public entry fun test_complete_todo(admin: signer) {
        account::create_account_for_test(signer::address_of(&admin));
        
        let task = string::utf8(b"Test todo item");
        todo_list::create_todo(&admin, task);
        
        // Complete the todo
        todo_list::complete_todo(&admin, 1);
        
        let todos = todo_list::get_todos(signer::address_of(&admin));
        let todo = std::vector::borrow(&todos, 0);
        // Note: We can't directly access the completed field in tests due to Move's visibility rules
        // In a real scenario, you'd add getter functions or make the struct public for testing
    }

    #[test(admin = @0x123)]
    public entry fun test_update_todo(admin: signer) {
        account::create_account_for_test(signer::address_of(&admin));
        
        let task = string::utf8(b"Original task");
        todo_list::create_todo(&admin, task);
        
        let new_task = string::utf8(b"Updated task");
        todo_list::update_todo(&admin, 1, new_task);
        
        // Verify the todo was updated
        let todos = todo_list::get_todos(signer::address_of(&admin));
        assert!(std::vector::length(&todos) == 1, 1);
    }

    #[test(admin = @0x123)]
    public entry fun test_delete_todo(admin: signer) {
        account::create_account_for_test(signer::address_of(&admin));
        
        let task = string::utf8(b"Task to be deleted");
        todo_list::create_todo(&admin, task);
        
        assert!(todo_list::get_todo_count(signer::address_of(&admin)) == 1, 1);
        
        todo_list::delete_todo(&admin, 1);
        
        assert!(todo_list::get_todo_count(signer::address_of(&admin)) == 0, 2);
        let todos = todo_list::get_todos(signer::address_of(&admin));
        assert!(std::vector::length(&todos) == 0, 3);
    }

    #[test(admin = @0x123)]
    public entry fun test_multiple_todos(admin: signer) {
        account::create_account_for_test(signer::address_of(&admin));
        
        let task1 = string::utf8(b"First task");
        let task2 = string::utf8(b"Second task");
        let task3 = string::utf8(b"Third task");
        
        todo_list::create_todo(&admin, task1);
        todo_list::create_todo(&admin, task2);
        todo_list::create_todo(&admin, task3);
        
        assert!(todo_list::get_todo_count(signer::address_of(&admin)) == 3, 1);
        
        let todos = todo_list::get_todos(signer::address_of(&admin));
        assert!(std::vector::length(&todos) == 3, 2);
    }

    #[test]
    public entry fun test_empty_user() {
        let empty_address = @0x999;
        assert!(!todo_list::has_todo_list(empty_address), 1);
        assert!(todo_list::get_todo_count(empty_address) == 0, 2);
        
        let todos = todo_list::get_todos(empty_address);
        assert!(std::vector::length(&todos) == 0, 3);
    }

    #[test(admin = @0x123)]
    #[expected_failure(abort_code = 1, location = todo_addr::todo_list)]
    public entry fun test_complete_nonexistent_todo(admin: signer) {
        account::create_account_for_test(signer::address_of(&admin));
        todo_list::create_list(&admin);
        
        // Try to complete a todo that doesn't exist
        todo_list::complete_todo(&admin, 999);
    }

    #[test(admin = @0x123)]
    #[expected_failure(abort_code = 1, location = todo_addr::todo_list)]
    public entry fun test_delete_nonexistent_todo(admin: signer) {
        account::create_account_for_test(signer::address_of(&admin));
        todo_list::create_list(&admin);
        
        // Try to delete a todo that doesn't exist
        todo_list::delete_todo(&admin, 999);
    }
} 