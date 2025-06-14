import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import App from './App';
import { describe, it, expect, afterEach, beforeEach } from 'vitest';
import '@testing-library/jest-dom';

describe('App', () => {
  afterEach(cleanup);

  // Test 1: Initial render
  describe('Initial render', () => {
    beforeEach(() => {
      render(<App />);
    });

    it('renders the main heading', () => {
      expect(screen.getByText('Todoリスト')).toBeInTheDocument();
    });

    it('renders the input field', () => {
      expect(screen.getByPlaceholderText('新しいTodoを入力')).toBeInTheDocument();
    });

    it('renders the "追加" (Add) button', () => {
      expect(screen.getByRole('button', { name: '追加' })).toBeInTheDocument();
    });

    it('initially renders an empty todo list', () => {
      const todoItems = screen.queryAllByRole('listitem');
      // We expect no items with the specific class 'todo-item',
      // or more generally, no list items if the list is meant to be empty.
      // Depending on App.tsx implementation, if the <ul> is always present,
      // we might need to check its children.
      // For now, let's assume queryAllByRole('listitem') is sufficient.
      expect(todoItems.length).toBe(0);
      // Or, if there's a specific way to identify todo items, e.g., by a test-id or class:
      expect(screen.queryAllByTestId('todo-item')).toHaveLength(0);
    });
  });

  // Test 2: Adding a todo
  describe('Adding a todo', () => {
    beforeEach(() => {
      render(<App />);
    });

    it('allows users to add a todo item', () => {
      const inputField = screen.getByPlaceholderText('新しいTodoを入力');
      const addButton = screen.getByRole('button', { name: '追加' });

      fireEvent.change(inputField, { target: { value: 'Test Todo 1' } });
      fireEvent.click(addButton);

      expect(screen.getByText('Test Todo 1')).toBeInTheDocument();
      // Check if the todo item is in a list item
      const listItem = screen.getByText('Test Todo 1').closest('li');
      expect(listItem).toBeInTheDocument();
      expect(listItem).toHaveClass('todo-item'); // Assuming 'todo-item' class is applied
      expect(inputField).toHaveValue(''); // Input field should be cleared
    });
  });

  // Test 3: Toggling a todo's completion status
  describe('Toggling a todo', () => {
    beforeEach(() => {
      render(<App />);
      const inputField = screen.getByPlaceholderText('新しいTodoを入力');
      const addButton = screen.getByRole('button', { name: '追加' });
      fireEvent.change(inputField, { target: { value: 'Test Todo 2' } });
      fireEvent.click(addButton);
    });

    it('allows users to toggle a todo item completion status', () => {
      const todoText = screen.getByText('Test Todo 2');
      const todoItem = todoText.closest('li');
      expect(todoItem).not.toHaveClass('completed');

      // Simulate clicking on the todo text (or a checkbox if available)
      // Assuming clicking the text toggles completion
      fireEvent.click(todoText);
      expect(todoItem).toHaveClass('completed');

      fireEvent.click(todoText);
      expect(todoItem).not.toHaveClass('completed');
    });
  });

  // Test 4: Deleting a todo
  describe('Deleting a todo', () => {
    beforeEach(() => {
      render(<App />);
      const inputField = screen.getByPlaceholderText('新しいTodoを入力');
      const addButton = screen.getByRole('button', { name: '追加' });
      fireEvent.change(inputField, { target: { value: 'Test Todo 3' } });
      fireEvent.click(addButton);
    });

    it('allows users to delete a todo item', () => {
      expect(screen.getByText('Test Todo 3')).toBeInTheDocument();

      // Find the delete button associated with "Test Todo 3"
      // This assumes the delete button is within the same list item and has text "削除"
      const todoItem = screen.getByText('Test Todo 3').closest('li');
      const deleteButton = todoItem ? todoItem.querySelector('button') : null; // More robust: use getByRole within the item

      if (!deleteButton) {
        throw new Error("Delete button not found for 'Test Todo 3'. Make sure it's rendered correctly.");
      }
      // A better way if delete button has a specific role or text within the item:
      // const deleteButton = within(todoItem).getByRole('button', { name: '削除' });

      fireEvent.click(deleteButton);
      expect(screen.queryByText('Test Todo 3')).not.toBeInTheDocument();
    });
  });

  // Test 5: Preventing empty todos
  describe('Preventing empty todos', () => {
    beforeEach(() => {
      render(<App />);
    });

    it('does not add an empty todo item', () => {
      const addButton = screen.getByRole('button', { name: '追加' });
      const initialTodoItems = screen.queryAllByTestId('todo-item');

      fireEvent.click(addButton);

      const currentTodoItems = screen.queryAllByTestId('todo-item');
      expect(currentTodoItems.length).toBe(initialTodoItems.length);
      // If the list was initially empty, it should remain empty
      if (initialTodoItems.length === 0) {
        expect(screen.queryAllByRole('listitem')).toHaveLength(0);
      }
    });

    it('does not add a todo with only whitespace', () => {
      // render(<App />); // Removed redundant render call
      const inputField = screen.getByPlaceholderText('新しいTodoを入力');
      const addButton = screen.getByRole('button', { name: '追加' });
      const initialTodoItems = screen.queryAllByTestId('todo-item');

      fireEvent.change(inputField, { target: { value: '   ' } }); // Input whitespace
      fireEvent.click(addButton);

      const currentTodoItems = screen.queryAllByTestId('todo-item');
      expect(currentTodoItems.length).toBe(initialTodoItems.length);
      expect(inputField).toHaveValue('   '); // Input field might or might not be cleared depending on implementation
    });
  });
});
