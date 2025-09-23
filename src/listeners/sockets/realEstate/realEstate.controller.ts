import { Server, Socket } from "socket.io";
import realEstateService from "../../modules/realEstate/realEstate.service";
import { wrapAsyncSocket } from "../../../middleware/wrapAsyncSocket";

const realEstate = wrapAsyncSocket(
  async (socket: Socket, io: Server) => {
    realEstateService.ping(socket, io);
  });

export default realEstate;