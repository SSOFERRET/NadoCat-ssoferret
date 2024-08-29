import express, { Request, Response } from "express";
import morgan from "morgan";
import helmet from "helmet";
import MissingRouter from "./routes/missings";
import CommunitiesRouter from "./routes/communities";
import StreetCatsRouter from "./routes/streetCats";
import UserRouter from "./routes/users";
import http, { METHODS } from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";
import ChatRouter from "./routes/chat";
import EventsRouter from "./routes/events";
import NotificationsRouter from "./routes/notifications";
import SearchesRouter from "./routes/searches";
import { handleJoinRoom, handleMessage } from "./controller/chat/Chat";
import LikesRouter from "./routes/likes";
import cookieParser from "cookie-parser";
import { FRONTEND_URL, IP, PORT } from "./constants/ip";
import dotenv from "dotenv";
dotenv.config();


//chat 관련
const app = express();
const server = http.createServer(app);
app.set('trust proxy', 1);  // 프록시 서버 뒤에서의 신뢰 설정

const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ['GET', 'POST'],
    credentials: true,
  }
});

io.on("connection", (socket: Socket) => {

  handleJoinRoom(socket, io)
  handleMessage(socket, io);

  socket.on('disconnect', () => {
  });
})

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CORS_ALLOW_ORIGIN,
    credentials: true,
  })
);
// app.use(helmet()) // NOTE 개발중이라 주석 처리해뒀음
app.use(morgan("tiny"));

app.use(`${process.env.REVERSE_PROXY || ""}/boards/communities`, CommunitiesRouter);
app.use(`${process.env.REVERSE_PROXY || ""}/boards/street-cats`, StreetCatsRouter);
app.use(`${process.env.REVERSE_PROXY || ""}/boards/missings`, MissingRouter);
app.use(`${process.env.REVERSE_PROXY || ""}/users`, UserRouter);
app.use(`${process.env.REVERSE_PROXY || ""}/boards/events`, EventsRouter);
app.use(`${process.env.REVERSE_PROXY || ""}/notifications`, cors({
  origin: FRONTEND_URL,
  methods: ['GET', 'PATCH'],
  allowedHeaders: ["Content-Type"],
}), NotificationsRouter);
app.use(`${process.env.REVERSE_PROXY || ""}/searches`, SearchesRouter);
app.use(`${process.env.REVERSE_PROXY || ""}/chats`, ChatRouter(io))
app.use(`${process.env.REVERSE_PROXY || ""}/posts`, LikesRouter);

app.use((_req: Request, res: Response) => {
  res.sendStatus(404);
});

app.use((error: any, _req: Request, res: Response) => {
  console.error(error);
  res.sendStatus(500);
});

server.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`${IP}:${PORT}`);
});
