const express = require('express');
const app = express();

app.use(express.json());

const users = [
    { id: 1, username: 'admin', password: 'admin' }
];

app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        res.status(200).json({
            success: true,
            message: 'Authentication successful',
            userId: user.id
        });
    } else {
        res.status(401).json({
            success: false,
            message: 'Invalid credentials'
        });
    }
});

app.listen(3000, () => {
    console.log('Authentication API running on port 3000');
});