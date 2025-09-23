import { Server, Socket } from "socket.io";

// Interface cho usecase với Higher-order functions
export interface IRealEstateUseCase {
  ping: (useCase: IRealEstateUseCase) => (socket: Socket, server: Server) => Promise<void>;
}

const ping = (useCase: IRealEstateUseCase) =>
  async (socket: Socket, io: Server): Promise<void> => {
    console.log('realEstateUseCase.ping called');
    // Gọi xuống tầng dưới nếu cần thiết ở đây. 
    return new Promise<void>((resolve) => {
      console.log('realEstate:ping received from usecase');
      resolve();
      socket.emit('realEstate:pingResponse', { message: 'Pong from useCase' });
    });
  }

const realEstateUseCase: IRealEstateUseCase = {
  ping
}

export default realEstateUseCase; 