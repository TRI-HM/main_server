import { Socket, Server } from "socket.io"

const SocketsManager = (socket: Socket, io: Server) => {
  console.log("🌟 New socket connected with id:", socket.id)
  socket.on("disconnect", () => {
    console.log("❌ Disconnected from id:", socket.id)
  })

  socket.on('ping', (msg) => {
    console.log('ping received:', msg);
    socket.emit('pong', 'pong');
  });
}

export default SocketsManager