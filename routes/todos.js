const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');

// Get all todos
router.get('/', async (req, res) => {
    try {
        console.log('GET /todos - Fetching all todos');
        const todos = await Todo.find().sort({ createdAt: -1 });
        console.log(`Found ${todos.length} todos`);
        res.json(todos);
    } catch (error) {
        console.error('Error fetching todos:', error);
        res.status(500).json({ message: 'Error fetching todos', error: error.message });
    }
});

// Create a todo
router.post('/', async (req, res) => {
    try {
        console.log('POST /todos - Creating new todo:', req.body);
        if (!req.body.text || req.body.text.trim() === '') {
            return res.status(400).json({ message: 'Todo text is required' });
        }

        const todo = new Todo({
            text: req.body.text.trim()
        });

        const newTodo = await todo.save();
        console.log('Created new todo:', newTodo);
        res.status(201).json(newTodo);
    } catch (error) {
        console.error('Error creating todo:', error);
        res.status(400).json({ message: 'Error creating todo', error: error.message });
    }
});

// Update a todo
router.patch('/:id', async (req, res) => {
    try {
        console.log(`PATCH /todos/${req.params.id} - Updating todo:`, req.body);
        const todo = await Todo.findById(req.params.id);
        
        if (!todo) {
            console.log('Todo not found:', req.params.id);
            return res.status(404).json({ message: 'Todo not found' });
        }

        if (req.body.text !== undefined) {
            if (req.body.text.trim() === '') {
                return res.status(400).json({ message: 'Todo text cannot be empty' });
            }
            todo.text = req.body.text.trim();
        }

        if (req.body.completed !== undefined) {
            todo.completed = Boolean(req.body.completed);
        }

        const updatedTodo = await todo.save();
        console.log('Updated todo:', updatedTodo);
        res.json(updatedTodo);
    } catch (error) {
        console.error('Error updating todo:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid todo ID' });
        }
        res.status(500).json({ message: 'Error updating todo', error: error.message });
    }
});

// Delete a todo
router.delete('/:id', async (req, res) => {
    try {
        console.log(`DELETE /todos/${req.params.id} - Deleting todo`);
        const todo = await Todo.findById(req.params.id);
        
        if (!todo) {
            console.log('Todo not found:', req.params.id);
            return res.status(404).json({ message: 'Todo not found' });
        }

        await Todo.findByIdAndDelete(req.params.id);
        console.log('Todo deleted successfully');
        res.json({ message: 'Todo deleted successfully' });
    } catch (error) {
        console.error('Error deleting todo:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid todo ID' });
        }
        res.status(500).json({ message: 'Error deleting todo', error: error.message });
    }
});

module.exports = router; 