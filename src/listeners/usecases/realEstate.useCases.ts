import { RealEstateApartmentClientType, RealEstateApartmentModelSequelize, RealEstateApartmentModelType } from "../../models/realEstate.apartment";

export interface IRealEstateUseCase {
  create: (data: Partial<RealEstateApartmentClientType>) => Promise<RealEstateApartmentModelType>;
  all: () => Promise<RealEstateApartmentModelType[] | null>;
  update: (data: Partial<RealEstateApartmentClientType>) => Promise<RealEstateApartmentModelType | null>;
}

const create = async (data: Partial<RealEstateApartmentClientType>): Promise<RealEstateApartmentModelType> => {
  let newApartment = await RealEstateApartmentModelSequelize.create(data);
  if (!newApartment) throw new Error('Failed to create new apartment');
  return newApartment.dataValues as RealEstateApartmentModelType;
}

const all = async (): Promise<RealEstateApartmentModelType[] | null> => {
  let apartments = await RealEstateApartmentModelSequelize.findAll();
  return apartments.map(a => a.dataValues as RealEstateApartmentModelType);
}

const update = async (data: Partial<RealEstateApartmentClientType>): Promise<RealEstateApartmentModelType | null> => {
  let apartment = await RealEstateApartmentModelSequelize.update(data, { where: { id: data.id }, returning: true }).then(([rowsUpdate, [updatedApartment]]) => updatedApartment);
  console.log('💼 UseCase layer executing - pure business logic', apartment);
  if (!apartment) return null;
  return apartment.dataValues as RealEstateApartmentModelType;
}

const realEstateUseCase: IRealEstateUseCase = {
  create,
  all,
  update,
}

export default realEstateUseCase; 