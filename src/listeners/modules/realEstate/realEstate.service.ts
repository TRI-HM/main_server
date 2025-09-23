import { Server, Socket } from "socket.io";
import realEstateUseCase, { IRealEstateUseCase } from "../../useCases/realEstate.useCase";

const ping = (service: IRealEstateUseCase) =>
  async (socket: Socket, io: Server): Promise<void> => {
    // Gọi xuống usecase layer
    console.log('realEstate:ping received at service');
    return realEstateUseCase.ping(realEstateUseCase)(socket, io);
  }

const realEstateService: IRealEstateUseCase = {
  ping,
};

export default realEstateService;