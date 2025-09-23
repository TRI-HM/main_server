import { Socket, Server } from "socket.io"
import userListener from "./sockets/user/controller"
import bigScreen from "./sockets/show-big-screen/controller"
import realEstate from "./sockets/realEstate"

const handleConnection = (socket: Socket) => {
  console.log("🌟 New socket connected with id:", socket.id)
  socket.on("disconnect", () => {
    console.log("❌ Disconnected from id:", socket.id)
  })
}

const SocketsManager = (socket: Socket, io: Server) => {
  handleConnection(socket);

  userListener(socket, io);
  bigScreen(socket, io);
  realEstate(socket, io);

}

export default SocketsManager