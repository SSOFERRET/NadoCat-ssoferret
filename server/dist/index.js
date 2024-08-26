"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const missings_1 = __importDefault(require("./routes/missings"));
const communities_1 = __importDefault(require("./routes/communities"));
const streetCats_1 = __importDefault(require("./routes/streetCats"));
const users_1 = __importDefault(require("./routes/users"));
const interest_1 = __importDefault(require("./routes/interest"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const chat_1 = __importDefault(require("./routes/chat"));
const events_1 = __importDefault(require("./routes/events"));
const notifications_1 = __importDefault(require("./routes/notifications"));
const searches_1 = __importDefault(require("./routes/searches"));
const Chat_1 = require("./controller/chat/Chat");
const likes_1 = __importDefault(require("./routes/likes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const PORT = process.env.PORT || 8080;
//chat 관련
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:5173", // 클라이언트 돌아가고 있는 경로
        methods: ['GET', 'POST'],
        credentials: true,
    }
});
io.on("connection", (socket) => {
    console.log("새로운 유저가 접속했습니다. ");
    (0, Chat_1.handleJoinRoom)(socket, io);
    (0, Chat_1.handleMessage)(socket, io);
    socket.on('disconnect', () => {
        console.log('유저가 나감.');
    });
});
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.CORS_ALLOW_ORIGIN,
    credentials: true,
}));
// app.use(helmet()) // NOTE 개발중이라 주석 처리해뒀음
app.use((0, morgan_1.default)("tiny"));
app.use("/boards/communities", communities_1.default);
app.use("/boards/street-cats", streetCats_1.default);
app.use("/boards/Interests", interest_1.default);
app.use("/boards/missings", missings_1.default);
app.use("/users", users_1.default);
app.use("/boards/events", events_1.default);
app.use("/notifications", (0, cors_1.default)({
    origin: 'http://localhost:5173',
    methods: ['GET', 'PATCH'],
    allowedHeaders: ["Content-Type"],
}), notifications_1.default);
app.use("/searches", searches_1.default);
app.use("/chats", (0, chat_1.default)(io));
app.use("/posts", likes_1.default);
app.use((_req, res) => {
    res.sendStatus(404);
});
app.use((error, _req, res) => {
    console.error(error);
    res.sendStatus(500);
});
server.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
