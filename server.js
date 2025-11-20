// server.js
import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

// In-memory data store
let categories = [
  { id: 1, name: 'Work', color: '#3b82f6' },
  { id: 2, name: 'Personal', color: '#10b981' },
  { id: 3, name: 'Shopping', color: '#f59e0b' }
];

let todos = [
  { id: 1, title: 'Complete project proposal', completed: false, categoryId: 1 },
  { id: 2, title: 'Buy groceries', completed: false, categoryId: 3 },
  { id: 3, title: 'Call dentist', completed: true, categoryId: 2 }
];

let nextCategoryId = 4;
let nextTodoId = 4;

// Categories endpoints
app.get('/api/categories', (req, res) => {
  res.json(categories);
});

app.post('/api/categories', (req, res) => {
  const { name, color } = req.body;
  const newCategory = {
    id: nextCategoryId++,
    name,
    color: color || '#6b7280'
  };
  categories.push(newCategory);
  res.status(201).json(newCategory);
});

app.put('/api/categories/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, color } = req.body;
  const category = categories.find(c => c.id === id);
  
  if (!category) {
    return res.status(404).json({ error: 'Category not found' });
  }
  
  if (name) category.name = name;
  if (color) category.color = color;
  
  res.json(category);
});

app.delete('/api/categories/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = categories.findIndex(c => c.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Category not found' });
  }
  
  // Delete all todos in this category
  todos = todos.filter(t => t.categoryId !== id);
  categories.splice(index, 1);
  
  res.status(204).send();
});

// Todos endpoints
app.get('/api/todos', (req, res) => {
  const { categoryId } = req.query;
  
  if (categoryId) {
    const filtered = todos.filter(t => t.categoryId === parseInt(categoryId));
    return res.json(filtered);
  }
  
  res.json(todos);
});

app.post('/api/todos', (req, res) => {
  const { title, categoryId } = req.body;
  
  if (!title || !categoryId) {
    return res.status(400).json({ error: 'Title and categoryId are required' });
  }
  
  const newTodo = {
    id: nextTodoId++,
    title,
    completed: false,
    categoryId: parseInt(categoryId)
  };
  
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

app.put('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { title, completed, categoryId } = req.body;
  const todo = todos.find(t => t.id === id);
  
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  
  if (title !== undefined) todo.title = title;
  if (completed !== undefined) todo.completed = completed;
  if (categoryId !== undefined) todo.categoryId = parseInt(categoryId);
  
  res.json(todo);
});

app.delete('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex(t => t.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  
  todos.splice(index, 1);
  res.status(204).send();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});