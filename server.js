require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const todoRoutes = require('./routes/todos');

const app = express();

// Middleware
app.use(cors());  // Allow all origins with default configuration
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.error('MongoDB connection error:', error));

// Welcome route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the Todo API',
        endpoints: {
            getAllTodos: 'GET /api/todos',
            createTodo: 'POST /api/todos',
            updateTodo: 'PATCH /api/todos/:id',
            deleteTodo: 'DELETE /api/todos/:id'
        },
        documentation: 'Access /api/todos to interact with the Todo API'
    });
});

// Enable pre-flight requests for all routes
app.options('*', cors());

// Routes
app.use('/api/todos', todoRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Handle 404
app.use((req, res) => {
    res.status(404).json({ 
        message: 'Route not found',
        path: req.path
    });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 