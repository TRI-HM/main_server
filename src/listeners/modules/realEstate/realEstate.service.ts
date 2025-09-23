import { Server, Socket } from "socket.io";
import { IRealEstateUseCase } from "../../usecases/realEstate.usecase";

const ping = (useCase: IRealEstateUseCase) =>
  async (socket: Socket, io: Server): Promise<void> => {
    // Gọi xuống tầng dưới nếu cần thiết ở đây. 
    return new Promise<void>((resolve) => {
      console.log('realEstate:ping received');
      resolve();
    });
  }

const realEstateService: IRealEstateUseCase = {
  ping,
};
export default realEstateService;