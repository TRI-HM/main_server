import { ButtonLogClientType, ButtonLogModelType } from "../../../models/buttonLog/buttonLog.model";
import buttonLogUseCase, { IButtonLogUseCase } from "../../useCase/buttonLog/buttonLog.useCase";

export interface IButtonLogService extends IButtonLogUseCase { }

const logButtonClick = (service: IButtonLogService) =>
  async (data: ButtonLogClientType): Promise<ButtonLogModelType | null> => {
    return service.logButtonClick(data);
  }

const all = (service: IButtonLogService) =>
  async (): Promise<ButtonLogModelType[] | null> => {
    return service.all();
  }

const buttonLogService: IButtonLogService = {
  logButtonClick: logButtonClick(buttonLogUseCase),
  all: all(buttonLogUseCase)
};

export default buttonLogService;