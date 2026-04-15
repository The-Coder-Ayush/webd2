const express = require('express');
const session = require('express-session');
const app = express();

app.use(express.json());
app.use(session({
    secret: 'my secretly 123',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.post('/api/session/login', (req, res) => {
    req.session.user = req.body.username;
    res.json({ message: 'Session created successfully', username: req.session.user });
});

app.get('/api/session/check', (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, username: req.session.user });
    } else {
        res.json({ loggedIn: false });
    }
});

app.post('/api/session/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) throw err;
        res.json({ message: 'Session destroyed successfully' });
    });
});

app.listen(3000, () => {
    console.log('Session Management API running on port 3000');
});