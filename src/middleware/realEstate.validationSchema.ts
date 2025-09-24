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

  const requiredFields: (keyof RealEstateApartmentClientType)[] = ['idStaff', 'block', 'floor', 'apartment', 'location', 'status'];
  requiredFields.forEach(field => {
    if (!data[field] || data[field]?.toString().trim() === '') {
      errors.push({
        field,
        message: `${field} is required and cannot be empty`
      })
    }
  });

  validateEnumFieldApartment(data, errors, ['status', 'location']);


  const validatedData: Partial<RealEstateApartmentClientType> = { ...data };

  return { isValid: true, errors, validatedData };
}

function validateEnumFieldApartment(
  data: Partial<RealEstateApartmentClientType>,
  errors: IValidationError[],
  fieldsToValidate: (keyof RealEstateApartmentClientType)[],
  validationEnum: typeof VALIDATION_STATUS // TODO: thêm enum khác
): void {

  fieldsToValidate = fieldsToValidate || ['status', 'location'];
  fieldsToValidate.forEach(field => {
    if (data[field] && !Object.values(VALIDATION_STATUS).includes(data[field] as VALIDATION_STATUS)) {
      errors.push({
        field,
        message: `${field} must be one of ${Object.values(VALIDATION_STATUS).join(', ')}`
      });
    }
  });
}

