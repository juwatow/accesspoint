"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const authService_1 = require("../services/authService");
const authRoutes = (app) => {
    app.post('/register', async ({ body }) => {
        const { email, password } = body;
        // Manual validation
        if (typeof email !== 'string' || typeof password !== 'string') {
            return { error: 'Invalid request body' };
        }
        try {
            const token = await (0, authService_1.registerUser)(email, password);
            return { token };
        }
        catch (error) {
            return { error: 'Registration failed' };
        }
    });
    app.post('/login', async ({ body }) => {
        const { email, password } = body;
        // Manual validation
        if (typeof email !== 'string' || typeof password !== 'string') {
            return { error: 'Invalid request body' };
        }
        try {
            const token = await (0, authService_1.loginUser)(email, password);
            return { token };
        }
        catch (error) {
            return { error: 'Login failed' };
        }
    });
};
exports.authRoutes = authRoutes;
