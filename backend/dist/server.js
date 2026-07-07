"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const batch_routes_1 = __importDefault(require("./routes/batch.routes"));
const webhook_routes_1 = __importDefault(require("./routes/webhook.routes"));
const settlement_routes_1 = __importDefault(require("./routes/settlement.routes"));
const allocation_routes_1 = __importDefault(require("./routes/allocation.routes"));
const consumer_routes_1 = __importDefault(require("./routes/consumer.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/batches', batch_routes_1.default);
app.use('/api/webhooks', webhook_routes_1.default);
app.use('/api/settlements', settlement_routes_1.default);
app.use('/api/allocations', allocation_routes_1.default);
app.use('/api/consumer', consumer_routes_1.default);
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'PayTrace API' });
});
app.listen(PORT, () => {
    console.log(`[Server] running on http://localhost:${PORT}`);
});
