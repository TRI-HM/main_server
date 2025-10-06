import { RealEstateApartmentClientType, RealEstateApartmentModelType } from "../../../models/realEstate.apartment";
import realEstateApartmentUseCase, { IRealEstateApartmentUseCase } from "../../useCase/realEstate/realEstate.useCases";

export interface IRealEstateService extends IRealEstateApartmentUseCase { }

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

const findById = (service: IRealEstateService) =>
  async (id: string): Promise<RealEstateApartmentModelType | null> => {
    return service.findById(id);
  }

const realEstateApartmentService: IRealEstateService = {
  create: create(realEstateApartmentUseCase),
  all: all(realEstateApartmentUseCase),
  update: update(realEstateApartmentUseCase),
  findById: findById(realEstateApartmentUseCase)
};

export default realEstateApartmentService;