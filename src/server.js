const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
app.get('/api/greeting', (req, res) => {
    res.json({
        message: '👋 Hello! Welcome to the API. This greeting came from your backend server running on localhost:3000'
    });
});

app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
        return res.status(400).json({
            message: 'All fields are required'
        });
    }

    // Here you could save to a database, send an email, etc.
    console.log('Message received:', { name, email, message });

    res.json({
        message: `Thank you, ${name}! Your message has been received. We'll get back to you at ${email} soon.`
    });
});

// Serve index.html for root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📝 Open http://localhost:${PORT} in your browser`);
});
