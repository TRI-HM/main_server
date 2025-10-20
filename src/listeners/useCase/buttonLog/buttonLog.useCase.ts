import ButtonLogModelSequelize, { ButtonLogClientType, ButtonLogModelType } from "../../../models/buttonLog/buttonLog.model";
import { IPaginationInfoType } from "../../../types/paginationInfo.io";
import { paginate } from "../../../util/pagination.util";


export interface IButtonLogUseCase {
  logButtonClick: (data: ButtonLogClientType) => Promise<ButtonLogModelType | null>;
  all: (page?: number, pageSize?: number) => Promise<{ data: ButtonLogModelType[], pagination: IPaginationInfoType } | null>;
}

const logButtonClick = async (data: ButtonLogClientType): Promise<ButtonLogModelType | null> => {
  let newLog = await ButtonLogModelSequelize.create(data);
  if (newLog) return newLog.dataValues as ButtonLogModelType;
  return null;
}

const all = async (page?: number, pageSize?: number): Promise<{ data: ButtonLogModelType[], pagination: IPaginationInfoType } | null> => {
  return await paginate<ButtonLogModelType>(
    ButtonLogModelSequelize,
    { page: page || 1, pageSize: pageSize || 5, orderBy: 'createdAt', orderDirection: 'DESC' }
  );
}

const buttonLogUseCase: IButtonLogUseCase = {
  logButtonClick,
  all
}

export default buttonLogUseCase;