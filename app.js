const express = require('express');
const session = require('express-session');
const userRoutes = require('./routes/users');

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
    session({
        secret: 'secret_code_123',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
    })
);

app.use('/', userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});