"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const db_1 = require("../db");
const user_1 = require("../models/user");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const drizzle_orm_1 = require("drizzle-orm");
const JWT_SECRET = process.env.JWT_SECRET;
const registerUser = async (email, password) => {
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    const newUser = { email, password: hashedPassword };
    await db_1.db.insert(user_1.users).values(newUser);
    return generateToken(newUser);
};
exports.registerUser = registerUser;
const loginUser = async (email, password) => {
    // Correct Drizzle ORM query to find the user by email using the eq() function
    const user = await db_1.db
        .select()
        .from(user_1.users)
        .where((0, drizzle_orm_1.eq)(user_1.users.email, email))
        .limit(1)
        .then(rows => rows[0]);
    if (!user || !(await bcryptjs_1.default.compare(password, user.password))) {
        throw new Error('Invalid email or password');
    }
    return generateToken(user);
};
exports.loginUser = loginUser;
const generateToken = (user) => {
    return jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
};
