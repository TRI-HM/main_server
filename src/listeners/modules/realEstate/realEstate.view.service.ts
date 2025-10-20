import { RealEstateViewsClientType, RealEstateViewsModelType } from "../../../models/realEstate.views";
import { IPaginationInfoType } from "../../../types/paginationInfo.io";
import realEstateViewUseCase, { IRealEstateViewUseCase } from "../../useCase/realEstate/realEstate.view.useCases";

export interface IRealEstateViewService extends IRealEstateViewUseCase { }

const create = (service: IRealEstateViewService) =>
  async (data: Partial<RealEstateViewsClientType>): Promise<RealEstateViewsModelType> => {
    return service.create(data);
  }

const all = (service: IRealEstateViewService) =>
  async (page?: number, pageSize?: number): Promise<{ data: RealEstateViewsModelType[], pagination: IPaginationInfoType } | null> => {
    return service.all(page, pageSize || 5);
  }

const realEstateViewService: IRealEstateViewService = {
  create: create(realEstateViewUseCase),
  all: all(realEstateViewUseCase),
};

export default realEstateViewService;