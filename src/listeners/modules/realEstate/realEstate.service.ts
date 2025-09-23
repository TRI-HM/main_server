import { Server, Socket } from "socket.io";
import realEstateUseCase, { IRealEstateUseCase } from "../../useCases/realEstate.useCase";

// Interface riêng cho service layer - quan trọng cho dự án lớn!
export interface IRealEstateService extends IRealEstateUseCase {
  // Service layer có thể có thêm methods mà UseCase không có
  // validatePermission: (userId: string) => Promise<boolean>;
  // logActivity: (action: string) => void;
}

const ping = (service: IRealEstateService) =>
  async (socket: Socket, io: Server): Promise<void> => {
    console.log('🏢 Service layer executing');

    // Service layer responsibilities trong dự án lớn:
    // - Input validation
    // - Business rules validation  
    // - Logging & monitoring
    // - Caching strategy
    // - Rate limiting
    // - Permission checks

    // Delegate to usecase layer
    return realEstateUseCase.ping(realEstateUseCase)(socket, io);
  }

const realEstateService: IRealEstateService = {
  ping,
};

export default realEstateService;