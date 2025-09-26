import { RealEstateApartmentClientType } from "../models/realEstate.apartment";

interface IValidationError {
  field: string;
  message: string;
}

enum VALIDATION_STATUS {
  READY = 'READY',
  PENDING = 'PENDING',
  SOLD = 'SOLD'
}

enum VALIDATION_LOCATION {
  SHOPHOUSE = 'SHOPHOUSE',
  APARTMENT = 'APARTMENT',
  PENTHOUSE = 'PENTHOUSE'
}

export const validateApartmentData = (data: Partial<RealEstateApartmentClientType>): {
  isValid: boolean; errors: IValidationError[];
  validatedData: Partial<RealEstateApartmentClientType>;
} => {
  const errors: IValidationError[] = [];

  // const requiredFields: (keyof RealEstateApartmentClientType)[] = ['idStaff', 'block', 'floor', 'apartment', 'location', 'status'];
  // requiredFields.forEach(field => {
  //   if (!data[field] || data[field]?.toString().trim() === '') {
  //     errors.push({
  //       field,
  //       message: `${field} is required and cannot be empty`
  //     })
  //   }
  // });

  if (data.status && data.status.toString().trim() !== '' && !Object.values(VALIDATION_STATUS).includes(data.status as VALIDATION_STATUS)) {
    errors.push({
      field: 'status',
      message: `status must be one of ${Object.values(VALIDATION_STATUS).join(', ')}`
    });
  }
  if (data.location && data.location.toString().trim() !== '' && !Object.values(VALIDATION_LOCATION).includes(data.location as VALIDATION_LOCATION)) {
    errors.push({
      field: 'location',
      message: `location must be one of ${Object.values(VALIDATION_LOCATION).join(', ')}`
    });
  }

  if (errors.length > 0) {
    return {
      isValid: false, errors, validatedData: {}
    };
  }

  const validatedData: Partial<RealEstateApartmentClientType> = {
    id: data.id?.toString().trim(),
    idStaff: data.idStaff?.toString().trim(),
    block: data.block?.toString().trim(),
    floor: data.floor?.toString().trim(),
    apartment: data.apartment?.toString().trim(),
    location: data.location?.toString().trim(),
    status: data.status?.toString().trim(),
    note: data.note?.toString().trim(),
  };

  return { isValid: true, errors: [], validatedData };
}