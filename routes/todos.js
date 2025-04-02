const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');

// Get all todos
router.get('/', async (req, res) => {
    try {
        const todos = await Todo.find().sort({ createdAt: -1 });
        res.json(todos);
    } catch (error) {
        console.error('Error fetching todos:', error);
        res.status(500).json({ message: 'Error fetching todos' });
    }
});

// Create a todo
router.post('/', async (req, res) => {
    try {
        if (!req.body.text || req.body.text.trim() === '') {
            return res.status(400).json({ message: 'Todo text is required' });
        }

        const todo = new Todo({
            text: req.body.text.trim()
        });

        const newTodo = await todo.save();
        res.status(201).json(newTodo);
    } catch (error) {
        console.error('Error creating todo:', error);
        res.status(400).json({ message: 'Error creating todo' });
    }
});

// Update a todo
router.patch('/:id', async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ message: 'Todo ID is required' });
        }

        const todo = await Todo.findById(req.params.id);
        
        if (!todo) {
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
        res.json(updatedTodo);
    } catch (error) {
        console.error('Error updating todo:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid todo ID' });
        }
        res.status(500).json({ message: 'Error updating todo' });
    }
});

// Delete a todo
router.delete('/:id', async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ message: 'Todo ID is required' });
        }

        const todo = await Todo.findById(req.params.id);
        
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        await Todo.findByIdAndDelete(req.params.id);
        res.json({ message: 'Todo deleted successfully' });
    } catch (error) {
        console.error('Error deleting todo:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid todo ID' });
        }
        res.status(500).json({ message: 'Error deleting todo' });
    }
});

module.exports = router; 