const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const users = require('../data/users');
const secret = require('../crypto/config');
const verifyToken = require('../middlewares/authMiddleware');

function generateToken(user) {
    return jwt.sign({ user: user.id }, secret, {
        expiresIn: '1h',
    });
}

router.get('/', (req, res) => {
    const loginForm = `
    <form action="/login" method="post">
        <label for="username">Usuario :</label>
        <input type="text" id="username" name="username" required><br>

        <label for="password">Contraseña :</label>
        <input type="password" id="password" name="password" required><br>

        <button type="submit">Iniciar sesión</button>
    </form>
    <a href="/dashboard">dashboard</a>
`;

    res.send(loginForm)
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(
        (user) => user.username === username && user.password
    );

    if (user) {
        const token = generateToken(user);
        req.session.token = token;
        req.session.save();
        res.redirect('/dashboard');
    } else {
        res.status(401).json({ message: 'Incorrect Credentials' });
    }
});

router.get('/dashboard', verifyToken, (req, res) => {
    const userId = req.user;
    const user = users.find((user) => user.id === userId);
    if (user) {
        res.send(`
        <h1>Welcome, ${user.name}!</h1>
        <p>Id: ${user.id}</p>
        <p>Username: ${user.username}</p>
        <a href="/">Home</a>
        <form action="/logout" method="post">
        <button type="submit">Log Out</button>
        </form>
        `);
    } else {
        res.status(401).json({ message: 'User not found.' });
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;