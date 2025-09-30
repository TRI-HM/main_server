import ButtonLogModelSequelize, { ButtonLogClientType, ButtonLogModelType } from "../../../models/buttonLog/buttonLog.model";

export interface IButtonLogUseCase {
  logButtonClick: (data: ButtonLogClientType) => Promise<ButtonLogModelType | null>;
  all: () => Promise<ButtonLogModelType[] | null>;
}

const logButtonClick = async (data: ButtonLogClientType): Promise<ButtonLogModelType | null> => {
  let newLog = await ButtonLogModelSequelize.create(data);
  if (newLog) return newLog.dataValues as ButtonLogModelType;
  return null;
}

const all = async (): Promise<ButtonLogModelType[] | null> => {
  let logs = await ButtonLogModelSequelize.findAll();
  return logs.map(log => log.dataValues as ButtonLogModelType);
}

const buttonLogUseCase: IButtonLogUseCase = {
  logButtonClick,
  all
}

export default buttonLogUseCase;