import { RealEstateApartmentModelSequelize } from "../../../models/realEstate.apartment";
import { RealEstateViewsClientType, RealEstateViewsModelSequelize, RealEstateViewsModelType } from "../../../models/realEstate.views";

export interface IRealEstateViewUseCase {
  all: () => Promise<RealEstateViewsModelType[] | null>;
  create: (data: Partial<RealEstateViewsClientType>) => Promise<RealEstateViewsModelType>;
}

const all = async (): Promise<RealEstateViewsModelType[] | null> => {
  let views = await RealEstateViewsModelSequelize.findAll();
  return views.map(v => v.dataValues as RealEstateViewsModelType);
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