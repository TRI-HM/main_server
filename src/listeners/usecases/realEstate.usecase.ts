import { Server, Socket } from "socket.io";

// Interface cho service với Higher-order functions
export interface IRealEstateUseCase {
  ping: (socket: Socket, server: Server) => Promise<void>;
}

const ping = (useCase: IRealEstateUseCase) =>
  async (socket: Socket, io: Server): Promise<void> => {
    // Gọi xuống tầng dưới nếu cần thiết ở đây. 
    return new Promise<void>((resolve) => {
      console.log('realEstate:ping received');
      resolve();
    });
  }

const realEstateUseCase: IRealEstateUseCase = {
  ping
}

export default realEstateUseCase;