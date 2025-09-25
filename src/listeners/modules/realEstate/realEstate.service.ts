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

const update = (service: IRealEstateService) =>
  async (data: Partial<RealEstateApartmentClientType>): Promise<RealEstateApartmentModelType | null> => {
    return service.update(data);
  }

const realEstateService: IRealEstateService = {
  create: create(realEstateUseCase),
  all: all(realEstateUseCase),
  update: update(realEstateUseCase),
};

export default realEstateService;