// Khi báo phần model
export type RealEstate = {
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
  all: (useCase: IRealEstateUseCase) => () => Promise<RealEstate[] | null>;
  findById: (useCase: IRealEstateUseCase) => (id: string) => Promise<RealEstate | null>;
  create: (useCase: IRealEstateUseCase) => (data: Partial<RealEstate>) => Promise<RealEstate>;
  update: (useCase: IRealEstateUseCase) => (id: string, data: Partial<RealEstate>) => Promise<RealEstate | null>;
  delete: (useCase: IRealEstateUseCase) => (id: string) => Promise<boolean>;

  // useCase tracking
  clicked: (useCase: IRealEstateUseCase) => (id: string) => Promise<number>;
  timeSpent: (useCase: IRealEstateUseCase) => (id: string, seconds: number) => Promise<number>;
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

const all = (useCase: IRealEstateUseCase) =>
  async (): Promise<RealEstate[] | null> => {
    console.log('💼 UseCase layer executing - pure business logic');
    return null;
  }

const findById = (useCase: IRealEstateUseCase) =>
  async (id: string): Promise<RealEstate | null> => {
    console.log('💼 UseCase layer executing - pure business logic');
    return null;
  }

const create = (useCase: IRealEstateUseCase) =>
  async (data: Partial<RealEstate>): Promise<RealEstate> => {
    console.log('💼 UseCase layer executing - pure business logic');
    return { id: 'new-id', block: '', floor: '', apartment: '', location: '', status: '' };
  }

const update = (useCase: IRealEstateUseCase) =>
  async (id: string, data: Partial<RealEstate>): Promise<RealEstate | null> => {
    console.log('💼 UseCase layer executing - pure business logic');
    return null;
  }

const deleteRealEstate = (useCase: IRealEstateUseCase) =>
  async (id: string): Promise<boolean> => {
    console.log('💼 UseCase layer executing - pure business logic');
    return false;
  }

const clicked = (useCase: IRealEstateUseCase) =>
  async (id: string): Promise<number> => {
    console.log('💼 UseCase layer executing - pure business logic');
    return 0;
  }

const timeSpent = (useCase: IRealEstateUseCase) =>
  async (id: string, seconds: number): Promise<number> => {
    console.log('💼 UseCase layer executing - pure business logic');
    return 0;
  }

const realEstateUseCase: IRealEstateUseCase = {
  ping,
  all,
  findById,
  create,
  update,
  delete: deleteRealEstate,
  clicked,
  timeSpent
}

export default realEstateUseCase; 