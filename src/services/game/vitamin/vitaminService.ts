import { GameVitaminClientType, GameVitaminModelType, gameVitaminUseCase, IGameVitaminUseCase } from "../../../models/game/vitamin";

const create = (useCase: IGameVitaminUseCase) =>
  async (win: GameVitaminClientType): Promise<GameVitaminModelType | null> => {
    let newRow = await useCase.create(win);
    if (!newRow) return null;
    return newRow;
  }

const getOne = (useCase: IGameVitaminUseCase) =>
  async (id: number): Promise<GameVitaminModelType | null> => {
    let row = await useCase.getOne(id);
    if (!row) return null;
    return row;
  }

const getAll = (useCase: IGameVitaminUseCase) =>
  async (): Promise<GameVitaminModelType[] | null> => {
    let table = await useCase.getAll();
    if (!table) return null;
    return table;
  }

const vitaminService: IGameVitaminUseCase = {
  create: create(gameVitaminUseCase),
  getOne: getOne(gameVitaminUseCase),
  getAll: getAll(gameVitaminUseCase),
}

export default vitaminService;
