// Khi báo phần model
type RealEstate = {
  id: string;
  idEmployee?: string;
  block: string;
  floor: string;
  apartment: string;
  location: string;
  status: string;
  note?: string;
}

// Interface cho useCase với Higher-order functions
export interface IRealEstateUseCase {
  ping: (useCase: IRealEstateUseCase) => () => Promise<boolean>;
}

const ping = (useCase: IRealEstateUseCase) =>
  async (): Promise<boolean> => {
    console.log('💼 UseCase layer executing - pure business logic');

    // Pure business logic here:
    // - Data processing
    // - Business rules
    // - Domain logic
    // - No socket, no HTTP, no external concerns

    // Simulate some business logic
    const isSystemHealthy = true;

    return isSystemHealthy;
  }

const realEstateUseCase: IRealEstateUseCase = {
  ping
}

export default realEstateUseCase; 