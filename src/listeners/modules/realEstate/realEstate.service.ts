import { RealEstateApartmentClientType, RealEstateApartmentModelType } from "../../../models/realEstate.apartment";
import realEstateUseCase, { IRealEstateUseCase } from "../../useCases/realEstate.useCases";

export interface IRealEstateService extends IRealEstateUseCase { }

const create = (service: IRealEstateService) =>
  async (data: Partial<RealEstateApartmentClientType>): Promise<RealEstateApartmentModelType> => {
    return service.create(data);
  }

const realEstateService: IRealEstateService = {
  create: create(realEstateUseCase),
};

export default realEstateService;