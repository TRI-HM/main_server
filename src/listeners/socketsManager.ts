import { Socket, Server } from "socket.io"
import userListener from "./sockets/user/controller"
import bigScreen from "./sockets/show-big-screen/controller"
import realEstate from "./sockets/realEstate"
import clickLogController from "./sockets/buttonLog"
import fightingGameController from "./sockets/fightingGame/fightingGame.controller"

const handleConnection = (socket: Socket) => {
  console.log("🌟 New socket connected with id:", socket.id)
  socket.on("disconnect", () => {
    console.log("❌ Disconnected from id:", socket.id)
  })
}

const pingEvent = (socket: Socket) => {
  socket.on('ping', () => {
    socket.emit('pong', 'pong');
  });
}

const SocketsManager = (socket: Socket, io: Server) => {
  handleConnection(socket);
  pingEvent(socket);
  userListener(socket, io);
  bigScreen(socket, io);
  realEstate(socket, io);
  clickLogController(socket, io);
  fightingGameController(socket, io);
}

export default SocketsManager