import { RealEstateApartmentClientType, RealEstateApartmentModelType } from "../../../models/realEstate.apartment";
import realEstateUseCase, { IRealEstateUseCase } from "../../useCases/realEstate.useCases";

export interface IRealEstateService extends IRealEstateUseCase { }

const create = (service: IRealEstateService) =>
  async (data: Partial<RealEstateApartmentClientType>): Promise<RealEstateApartmentModelType> => {
    return service.create(data);
  }

const all = (service: IRealEstateService) =>
  async (): Promise<RealEstateApartmentModelType[] | null> => {
    return service.all();
  }

const update = (useCase: IRealEstateService) =>
  async (id: string, data: Partial<RealEstateApartmentClientType>): Promise<boolean> => {
    console.log('🏢 Service layer executing update for ID:', id);
    return useCase.update(id, data);
  };

const realEstateService: IRealEstateService = {
  create: create(realEstateUseCase),
  all: all(realEstateUseCase),
  update: update(realEstateUseCase),
};

export default realEstateService;