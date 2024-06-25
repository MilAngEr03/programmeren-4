const express = require('express');
const userRoutes = require('./src/routes/user.routes');
const { routes: authRoutes } = require('./src/routes/authentication.routes');
const logger = require('./src/util/logger');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/api/info', (req, res) => {
    console.log('GET /api/info');
    const info = {
        name: 'My Nodejs Express server',
        version: '0.0.1',
        description: 'This is a simple Nodejs Express server'
    };
    res.json(info);
});

// Add logging for route registration
console.log('Registering auth routes at /api/auth');
app.use('/api/auth', authRoutes);
console.log('Registering user routes at /');
app.use('/', userRoutes);

app.use((req, res, next) => {
    next({
        status: 404,
        message: 'Route not found',
        data: {}
    });
});

app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        status: error.status || 500,
        message: error.message || 'Internal Server Error',
        data: {}
    });
});

app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
});

module.exports = app;