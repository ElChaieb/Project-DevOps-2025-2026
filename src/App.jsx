import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Check, X, Database } from 'lucide-react';

export default function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load tasks from storage on mount
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await window.storage.list('task:');
      
      if (result && result.keys) {
        const taskPromises = result.keys.map(async (key) => {
          try {
            const data = await window.storage.get(key);
            return data ? JSON.parse(data.value) : null;
          } catch {
            return null;
          }
        });
        
        const loadedTasks = (await Promise.all(taskPromises)).filter(Boolean);
        setTasks(loadedTasks.sort((a, b) => b.createdAt - a.createdAt));
      }
    } catch (err) {
      setError('Failed to load tasks');
      console.error('Load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async () => {
    if (!newTask.trim()) return;

    const task = {
      id: `task_${Date.now()}`,
      text: newTask.trim(),
      completed: false,
      createdAt: Date.now()
    };

    try {
      const result = await window.storage.set(`task:${task.id}`, JSON.stringify(task));
      if (result) {
        setTasks([task, ...tasks]);
        setNewTask('');
        setError('');
      } else {
        setError('Failed to save task');
      }
    } catch (err) {
      setError('Error saving task');
      console.error('Save error:', err);
    }
  };

  const deleteTask = async (id) => {
    try {
      const result = await window.storage.delete(`task:${id}`);
      if (result) {
        setTasks(tasks.filter(t => t.id !== id));
        setError('');
      } else {
        setError('Failed to delete task');
      }
    } catch (err) {
      setError('Error deleting task');
      console.error('Delete error:', err);
    }
  };

  const toggleComplete = async (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const updatedTask = { ...task, completed: !task.completed };

    try {
      const result = await window.storage.set(`task:${id}`, JSON.stringify(updatedTask));
      if (result) {
        setTasks(tasks.map(t => t.id === id ? updatedTask : t));
        setError('');
      } else {
        setError('Failed to update task');
      }
    } catch (err) {
      setError('Error updating task');
      console.error('Update error:', err);
    }
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditText(task.text);
  };

  const saveEdit = async (id) => {
    if (!editText.trim()) return;

    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const updatedTask = { ...task, text: editText.trim() };

    try {
      const result = await window.storage.set(`task:${id}`, JSON.stringify(updatedTask));
      if (result) {
        setTasks(tasks.map(t => t.id === id ? updatedTask : t));
        setEditingId(null);
        setEditText('');
        setError('');
      } else {
        setError('Failed to update task');
      }
    } catch (err) {
      setError('Error updating task');
      console.error('Update error:', err);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const clearAll = async () => {
    if (!window.confirm('Delete all tasks?')) return;

    try {
      const deletePromises = tasks.map(task => 
        window.storage.delete(`task:${task.id}`)
      );
      await Promise.all(deletePromises);
      setTasks([]);
      setError('');
    } catch (err) {
      setError('Error clearing tasks');
      console.error('Clear error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Database className="w-8 h-8 text-indigo-600" />
              <h1 className="text-3xl font-bold text-gray-800">DevOps Task Manager</h1>
            </div>
            {tasks.length > 0 && (
              <button
                onClick={clearAll}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Clear All
              </button>
            )}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTask()}
                placeholder="Add a new task..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={addTask}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-500">
              Loading tasks...
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No tasks yet. Add one to get started!
            </div>
          ) : (
            <div className="space-y-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleComplete(task.id)}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                  />
                  
                  {editingId === task.id ? (
                    <>
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && saveEdit(task.id)}
                        className="flex-1 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        autoFocus
                      />
                      <button
                        onClick={() => saveEdit(task.id)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="p-2 text-gray-600 hover:bg-gray-200 rounded"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <span
                        className={`flex-1 ${
                          task.completed
                            ? 'line-through text-gray-500'
                            : 'text-gray-800'
                        }`}
                      >
                        {task.text}
                      </span>
                      <button
                        onClick={() => startEdit(task)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-between text-sm text-gray-600">
              <span>{tasks.length} total tasks</span>
              <span>{tasks.filter(t => t.completed).length} completed</span>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>✓ Persistent storage using Claude's database API</p>
          <p>✓ Full CRUD operations (Create, Read, Update, Delete)</p>
          <p>✓ Perfect for DevOps CI/CD pipeline testing</p>
        </div>
      </div>
    </div>
  );
}