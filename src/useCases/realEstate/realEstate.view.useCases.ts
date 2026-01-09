import { RealEstateViewsClientType, RealEstateViewsModelSequelize, RealEstateViewsModelType } from "../../models/realEstate.views";
import { IPaginationInfoType } from "../../types/paginationInfo.io";
import { paginate } from "../../util/pagination.util";

export interface IRealEstateViewUseCase {
  all: (page?: number, pageSize?: number) => Promise<{ data: RealEstateViewsModelType[], pagination: IPaginationInfoType } | null>;
  create: (data: Partial<RealEstateViewsClientType>) => Promise<RealEstateViewsModelType>;
}

const all = async (page?: number, pageSize?: number): Promise<{ data: RealEstateViewsModelType[], pagination: IPaginationInfoType } | null> => {
  return await paginate<RealEstateViewsModelType>(
    RealEstateViewsModelSequelize,
    { page: page || 1, pageSize: pageSize || 5, orderBy: 'createdAt', orderDirection: 'DESC' }
  );
};

const create = async (data: Partial<RealEstateViewsClientType>): Promise<RealEstateViewsModelType> => {
  let newView = await RealEstateViewsModelSequelize.create(data);
  if (!newView) throw new Error('Failed to create new view');
  return newView.dataValues as RealEstateViewsModelType;
}

const realEstateViewUseCase: IRealEstateViewUseCase = {
  all,
  create,
}

export default realEstateViewUseCase;