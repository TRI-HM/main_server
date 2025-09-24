import { RealEstateApartmentClientType, RealEstateApartmentModelSequelize, RealEstateApartmentModelType } from "../../models/realEstate.apartment";

export interface IRealEstateUseCase {
  create: (data: Partial<RealEstateApartmentClientType>) => Promise<RealEstateApartmentModelType>;
  // useCase tracking
  // clicked: (useCase: IRealEstateUseCase) => (id: string) => Promise<number>;
  // timeSpent: (useCase: IRealEstateUseCase) => (id: string, seconds: number) => Promise<number>;
}

const create = async (data: Partial<RealEstateApartmentClientType>): Promise<RealEstateApartmentModelType> => {
  let newApartment = await RealEstateApartmentModelSequelize.create(data);
  if (!newApartment) throw new Error('Failed to create new apartment');
  return newApartment.dataValues as RealEstateApartmentModelType;
}

const realEstateUseCase: IRealEstateUseCase = {
  create,
}

export default realEstateUseCase; 