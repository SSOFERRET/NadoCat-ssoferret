import express, { Request, Response } from "express";
import cors from 'cors';
import morgan from 'morgan'
import helmet from "helmet";
import MissingRouter from "./routes/missings";
import CommunitiesRouter from "./routes/communities";
import StreetCatsRouter from "./routes/streetCats";
// import UserRouter from "./routes/users";
import InterestsRouter from "./routes/interest";
import EventsRouter from "./routes/events";
import { Socket } from "socket.io";
import http, { METHODS } from "http";
const PORT = process.env.PORT || 8080;

//chat 관련
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket: Socket) => {
  socket.on("채팅 메세지", (msg) => {
    console.log("message:", msg);
    io.emit(msg);
  })
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
})
app.get('/', (req, res) => {
  res.send("서버 돌아가는중");
})


app.use(express.json());
app.use(cors());
// app.use(helmet()) // NOTE 개발중이라 주석 처리해뒀음
app.use(morgan("tiny"));

app.use("/boards/communities", CommunitiesRouter);
app.use("/boards/street-cats", StreetCatsRouter);
app.use("/boards/Interests", InterestsRouter);
app.use('/boards/missings', MissingRouter);
// app.use("/users", UserRouter);
app.use("/boards/events", EventsRouter);


app.use((_req: Request, res: Response) => {
  res.sendStatus(404);
});

app.use((error: any, _req: Request, res: Response) => {
  console.error(error);
  res.sendStatus(500);
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
