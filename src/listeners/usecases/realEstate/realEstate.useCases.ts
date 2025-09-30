import { RealEstateApartmentClientType, RealEstateApartmentModelSequelize, RealEstateApartmentModelType } from "../../../models/realEstate.apartment";

export interface IRealEstateApartmentUseCase {
  create: (data: Partial<RealEstateApartmentClientType>) => Promise<RealEstateApartmentModelType>;
  all: () => Promise<RealEstateApartmentModelType[] | null>;
  update: (id: string, data: Partial<RealEstateApartmentClientType>) => Promise<boolean>;
  findById: (id: string) => Promise<RealEstateApartmentModelType | null>;
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

const update = async (id: string, data: Partial<RealEstateApartmentClientType>): Promise<boolean> => {
  let [updated] = await RealEstateApartmentModelSequelize.update(data, { where: { id } });
  console.log('💼 UseCase layer executing - pure business logic', updated);
  return updated > 0;
}

const findById = async (id: string): Promise<RealEstateApartmentModelType | null> => {
  let apartment = await RealEstateApartmentModelSequelize.findOne({ where: { id } });
  if (!apartment) return null;
  return apartment.dataValues as RealEstateApartmentModelType;
}

const realEstateApartmentUseCase: IRealEstateApartmentUseCase = {
  create,
  all,
  update,
  findById
}

export default realEstateApartmentUseCase; 