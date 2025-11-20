import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';

const API_URL = 'http://localhost:3001/api';

export default function TodoApp() {
  const [categories, setCategories] = useState([]);
  const [todos, setTodos] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#6b7280');
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  useEffect(() => {
    fetchCategories();
    fetchTodos();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/categories`);
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchTodos = async () => {
    try {
      const res = await fetch(`${API_URL}/todos`);
      const data = await res.json();
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const addCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    try {
      const res = await fetch(`${API_URL}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName, color: newCategoryColor })
      });
      const data = await res.json();
      setCategories([...categories, data]);
      setNewCategoryName('');
      setNewCategoryColor('#6b7280');
      setShowCategoryForm(false);
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const deleteCategory = async (id) => {
    try {
      await fetch(`${API_URL}/categories/${id}`, { method: 'DELETE' });
      setCategories(categories.filter(c => c.id !== id));
      setTodos(todos.filter(t => t.categoryId !== id));
      if (selectedCategory === id) setSelectedCategory(null);
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodoTitle.trim() || !selectedCategory) return;

    try {
      const res = await fetch(`${API_URL}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTodoTitle, categoryId: selectedCategory })
      });
      const data = await res.json();
      setTodos([...todos, data]);
      setNewTodoTitle('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const toggleTodo = async (id, completed) => {
    try {
      const res = await fetch(`${API_URL}/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !completed })
      });
      const data = await res.json();
      setTodos(todos.map(t => t.id === id ? data : t));
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  const startEditTodo = (todo) => {
    setEditingTodo(todo.id);
    setEditTitle(todo.title);
  };

  const saveEditTodo = async (id) => {
    if (!editTitle.trim()) return;

    try {
      const res = await fetch(`${API_URL}/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editTitle })
      });
      const data = await res.json();
      setTodos(todos.map(t => t.id === id ? data : t));
      setEditingTodo(null);
      setEditTitle('');
    } catch (error) {
      console.error('Error editing todo:', error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await fetch(`${API_URL}/todos/${id}`, { method: 'DELETE' });
      setTodos(todos.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const filteredTodos = selectedCategory
    ? todos.filter(t => t.categoryId === selectedCategory)
    : todos;

  const getCategoryById = (id) => categories.find(c => c.id === id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          To-Do App with Categories
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Categories Sidebar */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-700">Categories</h2>
              <button
                onClick={() => setShowCategoryForm(!showCategoryForm)}
                className="p-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition"
              >
                <Plus size={20} />
              </button>
            </div>

            {showCategoryForm && (
              <form onSubmit={addCategory} className="mb-4 p-3 bg-gray-50 rounded">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Category name"
                  className="w-full px-3 py-2 border rounded mb-2"
                />
                <input
                  type="color"
                  value={newCategoryColor}
                  onChange={(e) => setNewCategoryColor(e.target.value)}
                  className="w-full h-10 rounded mb-2"
                />
                <button
                  type="submit"
                  className="w-full bg-indigo-500 text-white py-2 rounded hover:bg-indigo-600"
                >
                  Add Category
                </button>
              </form>
            )}

            <button
              onClick={() => setSelectedCategory(null)}
              className={`w-full text-left px-4 py-3 rounded mb-2 transition ${
                selectedCategory === null
                  ? 'bg-indigo-100 border-2 border-indigo-500'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <span className="font-medium">All Tasks</span>
              <span className="ml-2 text-sm text-gray-600">({todos.length})</span>
            </button>

            {categories.map(category => (
              <div
                key={category.id}
                className={`flex items-center justify-between px-4 py-3 rounded mb-2 transition cursor-pointer ${
                  selectedCategory === category.id
                    ? 'bg-indigo-100 border-2 border-indigo-500'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <div className="flex items-center">
                  <div
                    className="w-4 h-4 rounded-full mr-3"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="font-medium">{category.name}</span>
                  <span className="ml-2 text-sm text-gray-600">
                    ({todos.filter(t => t.categoryId === category.id).length})
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteCategory(category.id);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Todos Main Area */}
          <div className="md:col-span-2 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              {selectedCategory
                ? getCategoryById(selectedCategory)?.name
                : 'All Tasks'}
            </h2>

            {selectedCategory && (
              <form onSubmit={addTodo} className="mb-6 flex gap-2">
                <input
                  type="text"
                  value={newTodoTitle}
                  onChange={(e) => setNewTodoTitle(e.target.value)}
                  placeholder="Add a new task..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
                >
                  <Plus size={20} />
                </button>
              </form>
            )}

            {!selectedCategory && categories.length > 0 && (
              <p className="text-gray-500 text-center mb-6">
                Select a category to add tasks
              </p>
            )}

            {categories.length === 0 && (
              <p className="text-gray-500 text-center">
                Create a category to get started!
              </p>
            )}

            <div className="space-y-2">
              {filteredTodos.map(todo => {
                const category = getCategoryById(todo.categoryId);
                return (
                  <div
                    key={todo.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id, todo.completed)}
                      className="w-5 h-5 rounded"
                    />
                    
                    {editingTodo === todo.id ? (
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="flex-1 px-2 py-1 border rounded"
                        autoFocus
                      />
                    ) : (
                      <span
                        className={`flex-1 ${
                          todo.completed ? 'line-through text-gray-400' : 'text-gray-700'
                        }`}
                      >
                        {todo.title}
                      </span>
                    )}

                    {!selectedCategory && category && (
                      <span
                        className="px-2 py-1 text-xs rounded"
                        style={{
                          backgroundColor: category.color + '20',
                          color: category.color
                        }}
                      >
                        {category.name}
                      </span>
                    )}

                    <div className="flex gap-2">
                      {editingTodo === todo.id ? (
                        <>
                          <button
                            onClick={() => saveEditTodo(todo.id)}
                            className="text-green-500 hover:text-green-700"
                          >
                            <Check size={18} />
                          </button>
                          <button
                            onClick={() => setEditingTodo(null)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <X size={18} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEditTodo(todo)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => deleteTodo(todo.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredTodos.length === 0 && selectedCategory && (
              <p className="text-center text-gray-400 mt-8">
                No tasks yet. Add one above!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

