
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Check, Circle } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  type: 'note' | 'mindmap' | 'todo';
  createdAt: Date;
  updatedAt: Date;
}

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

interface TodoListProps {
  note: Note;
  onUpdate: (note: Note) => void;
}

const TodoList: React.FC<TodoListProps> = ({ note, onUpdate }) => {
  const [title, setTitle] = useState(note.title);
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    setTitle(note.title);
    try {
      const parsedTodos = note.content ? JSON.parse(note.content) : [];
      setTodos(parsedTodos.map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt)
      })));
    } catch (e) {
      console.error('Error parsing todo data:', e);
      setTodos([]);
    }
  }, [note]);

  const updateTodos = (newTodos: TodoItem[]) => {
    setTodos(newTodos);
    onUpdate({ ...note, content: JSON.stringify(newTodos) });
  };

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo: TodoItem = {
        id: Math.random().toString(36).substr(2, 9),
        text: newTodo.trim(),
        completed: false,
        createdAt: new Date()
      };
      updateTodos([...todos, todo]);
      setNewTodo('');
    }
  };

  const toggleTodo = (todoId: string) => {
    const updatedTodos = todos.map(todo =>
      todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
    );
    updateTodos(updatedTodos);
  };

  const deleteTodo = (todoId: string) => {
    const updatedTodos = todos.filter(todo => todo.id !== todoId);
    updateTodos(updatedTodos);
  };

  const updateTodoText = (todoId: string, newText: string) => {
    const updatedTodos = todos.map(todo =>
      todo.id === todoId ? { ...todo, text: newText } : todo
    );
    updateTodos(updatedTodos);
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    onUpdate({ ...note, title: newTitle });
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div className="h-full flex flex-col">
      {/* Title and Progress */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <input
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="w-full text-2xl font-bold bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none mb-4"
          placeholder="Todo list title..."
        />
        
        {totalCount > 0 && (
          <div className="flex items-center space-x-4">
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              />
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {completedCount}/{totalCount} completed
            </span>
          </div>
        )}
      </div>

      {/* Add New Todo */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-3">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Add a new todo..."
          />
          <button
            onClick={addTodo}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* Todo List */}
      <div className="flex-1 overflow-y-auto p-6">
        {todos.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <Check className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No todos yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Add your first todo item above
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {todos.map((todo) => (
              <div
                key={todo.id}
                className={`group flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200 ${
                  todo.completed
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md'
                }`}
              >
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                    todo.completed
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-gray-300 dark:border-gray-600 hover:border-green-500'
                  }`}
                >
                  {todo.completed ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <Circle className="h-3 w-3 opacity-0" />
                  )}
                </button>

                <input
                  type="text"
                  value={todo.text}
                  onChange={(e) => updateTodoText(todo.id, e.target.value)}
                  className={`flex-1 bg-transparent focus:outline-none ${
                    todo.completed
                      ? 'text-gray-500 dark:text-gray-400 line-through'
                      : 'text-gray-900 dark:text-white'
                  }`}
                />

                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all duration-200"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoList;
