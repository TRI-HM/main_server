import realEstateUseCase, { IRealEstateUseCase, RealEstate } from "../../useCases/realEstate.useCase";

export interface IRealEstateService extends IRealEstateUseCase { }

const ping = (service: IRealEstateService) =>
  async (): Promise<boolean> => {
    console.log('🏢 Service layer executing');

    // Delegate to usecase layer with dependency injection
    return realEstateUseCase.ping(realEstateUseCase)();
  }

const all = (service: IRealEstateService) =>
  async (): Promise<RealEstate[] | null> => {
    console.log('🏢 Service layer executing');
    return realEstateUseCase.all(realEstateUseCase)();
  }

const findById = (service: IRealEstateService) =>
  async (id: string): Promise<RealEstate | null> => {
    console.log('🏢 Service layer executing');
    return realEstateUseCase.findById(realEstateUseCase)(id);
  }

const create = (service: IRealEstateService) =>
  async (data: Partial<RealEstate>): Promise<RealEstate> => {
    console.log('🏢 Service layer executing');
    return realEstateUseCase.create(realEstateUseCase)(data);
  }

const update = (service: IRealEstateService) =>
  async (id: string, data: Partial<RealEstate>): Promise<RealEstate | null> => {
    console.log('🏢 Service layer executing');
    return realEstateUseCase.update(realEstateUseCase)(id, data);
  }

const deleteRealEstate = (service: IRealEstateService) =>
  async (id: string): Promise<boolean> => {
    console.log('🏢 Service layer executing');
    return realEstateUseCase.delete(realEstateUseCase)(id);
  }

const clicked = (service: IRealEstateService) =>
  async (id: string): Promise<number> => {
    console.log('🏢 Service layer executing');
    return realEstateUseCase.clicked(realEstateUseCase)(id);
  }

const timeSpent = (service: IRealEstateService) =>
  async (id: string, seconds: number): Promise<number> => {
    console.log('🏢 Service layer executing');
    return realEstateUseCase.timeSpent(realEstateUseCase)(id, seconds);
  }

const realEstateService: IRealEstateService = {
  ping,
  all,
  findById,
  create,
  update,
  delete: deleteRealEstate,
  clicked,
  timeSpent
};

export default realEstateService;