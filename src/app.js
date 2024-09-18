"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const elysia_1 = require("elysia");
const auth_1 = require("./routes/auth");
const app = new elysia_1.Elysia();
exports.app = app;
// Register the routes
(0, auth_1.authRoutes)(app);
// Start the server (conditionally for testing)
if (require.main === module) {
    app.listen(3000, () => {
        console.log(`Server is running at http://localhost:3000`);
    });
}
