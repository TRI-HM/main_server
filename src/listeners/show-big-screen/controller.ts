import { Server, Socket } from "socket.io";

const bigScreen = (socket: Socket, io: Server) => {
  socket.on('get/bigScreen/heineken/vote/france', () => {
    socket.emit('bigScreen/heineken/vote/france', 1234);
  });

  //Client
  socket.on('post/bigScreen/heineken/vote/france', (data) => {
    // TODO: ghi vào database
    // TODO: Count database với điều kiện
    // Gửi lại cho client kết quả
    socket.emit('bigScreen/heineken/vote/france', 1234);
  });

}

export default bigScreen;