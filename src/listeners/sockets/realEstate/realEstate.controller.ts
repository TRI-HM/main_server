import { Server, Socket } from "socket.io";
import realEstateService from "../../modules/realEstate/realEstate.service";
import { wrapAsyncSocket } from "../../../middleware/wrapAsyncSocket";

const realEstate = wrapAsyncSocket(
  async (socket: Socket, io: Server) => {
    // Sử dụng higher-order function của service
    socket.on('realEstate:ping', async () => {
      // Kiểm tra data nếu cần thiết ở đây
      // Gọi service với dependency injection
      await realEstateService.ping(realEstateService)(socket, io);
    });
  });

export default realEstate;