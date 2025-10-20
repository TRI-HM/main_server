import ButtonLogModelSequelize, { ButtonLogClientType, ButtonLogModelType } from "../../../models/buttonLog/buttonLog.model";

export interface IButtonLogUseCase {
  logButtonClick: (data: ButtonLogClientType) => Promise<ButtonLogModelType | null>;
  all: (page?: number, pageSize?: number) => Promise<ButtonLogModelType[] | null>;
}

const logButtonClick = async (data: ButtonLogClientType): Promise<ButtonLogModelType | null> => {
  let newLog = await ButtonLogModelSequelize.create(data);
  if (newLog) return newLog.dataValues as ButtonLogModelType;
  return null;
}

const all = async (page?: number, pageSize?: number): Promise<ButtonLogModelType[] | null> => {
  let _page = page || 1;
  let _pageSize = pageSize || 5;
  let logs = await ButtonLogModelSequelize.findAll({
    limit: _pageSize,
    offset: (_page - 1) * _pageSize
  });
  return logs.map(log => log.dataValues as ButtonLogModelType);
}

const buttonLogUseCase: IButtonLogUseCase = {
  logButtonClick,
  all
}

export default buttonLogUseCase;