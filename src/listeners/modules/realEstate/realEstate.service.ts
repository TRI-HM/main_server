import realEstateUseCase, { IRealEstateUseCase } from "../../useCases/realEstate.useCase";

// Interface cho service với Higher-order functions
export interface IRealEstateService {
  ping: (service: IRealEstateService) => () => Promise<boolean>;
}

const ping = (service: IRealEstateService) =>
  async (): Promise<boolean> => {
    console.log('🏢 Service layer executing');

    // Service layer responsibilities:
    // - Input validation
    // - Business rules validation
    // - Logging & monitoring
    // - Rate limiting
    // - Permission checks
    // - etc.

    // Delegate to usecase layer with dependency injection
    return realEstateUseCase.ping(realEstateUseCase)();
  }

const realEstateService: IRealEstateService = {
  ping,
};

export default realEstateService;