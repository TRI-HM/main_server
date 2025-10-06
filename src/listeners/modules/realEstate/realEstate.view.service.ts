import { RealEstateViewsClientType, RealEstateViewsModelType } from "../../../models/realEstate.views";
import realEstateViewUseCase, { IRealEstateViewUseCase } from "../../useCase/realEstate/realEstate.view.useCases";

export interface IRealEstateViewService extends IRealEstateViewUseCase { }

const create = (service: IRealEstateViewService) =>
  async (data: Partial<RealEstateViewsClientType>): Promise<RealEstateViewsModelType> => {
    return service.create(data);
  }

const all = (service: IRealEstateViewService) =>
  async (): Promise<RealEstateViewsModelType[] | null> => {
    return service.all();
  }

const realEstateViewService: IRealEstateViewService = {
  create: create(realEstateViewUseCase),
  all: all(realEstateViewUseCase),
};

export default realEstateViewService;