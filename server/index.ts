import express, { Request, Response } from "express";
import morgan from "morgan";
import helmet from "helmet";
import MissingRouter from "./routes/missings";
// import CommunitiesRouter from "./routes/communities";
import StreetCatsRouter from "./routes/streetCats";
// import UserRouter from "./routes/users";
import InterestsRouter from "./routes/interest";
// import EventsRouter from "./routes/events";
// import NotificationsRouter from "./routes/notifications";
import http, { METHODS } from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";
import ChatRouter from "./routes/chat";

const PORT = process.env.PORT || 8080;

//chat 관련
const app = express();
const server = http.createServer(app);

app.use("/chat", ChatRouter);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ['GET', 'POST'],
  }
});

io.on("connection", (socket: Socket) => {
  console.log("새로운 유저가 접속했습니다. ");

  socket.on("join", ({ name, roomId}) => {
    socket.join(roomId);

    socket.to(roomId).emit('message', {
    user: 'admin',
    message: `${name} has joined the chat`,
    time: new Date().toLocaleTimeString(),
  });
  })
  
  socket.on("sendMessage", ({ time, message, user, roomId }) => {
    const newMessage = { user, message, time};
    io.to(roomId).emit("message", newMessage);
  })

  socket.on('disconnect', () => {
    console.log('유저가 나감.');
  });
})

app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ALLOW_ORIGIN, 
    credentials: true,
  })
);
// app.use(helmet()) // NOTE 개발중이라 주석 처리해뒀음
app.use(morgan("tiny"));

// app.use("/boards/communities", CommunitiesRouter);
app.use("/boards/street-cats", StreetCatsRouter);
app.use("/boards/Interests", InterestsRouter);
app.use("/boards/missings", MissingRouter);
// app.use("/users", UserRouter);
// app.use("/boards/events", EventsRouter);
// app.use("/notifications", NotificationsRouter);

app.use((_req: Request, res: Response) => {
  res.sendStatus(404);
});

app.use((error: any, _req: Request, res: Response) => {
  console.error(error);
  res.sendStatus(500);
});

server.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
