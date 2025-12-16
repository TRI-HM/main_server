import { ButtonLogClientType, ButtonLogModelType } from "../../../models/buttonLog/buttonLog.model";
import buttonLogUseCase, { IButtonLogUseCase } from "../../../useCases/buttonLog/buttonLog.useCase";
import { IPaginationInfoType } from "../../../types/paginationInfo.io";

export interface IButtonLogService extends IButtonLogUseCase { }

const logButtonClick = (service: IButtonLogService) =>
  async (data: ButtonLogClientType): Promise<ButtonLogModelType | null> => {
    return service.logButtonClick(data);
  }

const all = (service: IButtonLogService) =>
  async (page?: number, pageSize?: number): Promise<{ data: ButtonLogModelType[], pagination: IPaginationInfoType } | null> => {
    return service.all(page, pageSize || 5);
  }

const buttonLogService: IButtonLogService = {
  logButtonClick: logButtonClick(buttonLogUseCase),
  all: all(buttonLogUseCase)
};

export default buttonLogService;