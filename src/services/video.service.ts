import { VideoClientType, VideoModelType } from "../models/video.model";
import videoUseCase, { IVideoUseCase } from "../useCases/video/video.useCase";

interface IVideoService extends IVideoUseCase { }

const create = (service: IVideoService) =>
    async (video: Partial<VideoClientType>): Promise<VideoModelType | null> => {
        return service.create(video);
    }

const getOneById = (service: IVideoService) =>
    async (id: string): Promise<VideoModelType | null> => {
        return service.getOneById(id);
    }

const getAll = (service: IVideoService) =>
    async (): Promise<VideoModelType[] | null> => {
        return service.getAll();
    }

const updateById = (service: IVideoService) =>
    async (id: string, video: Partial<VideoClientType>): Promise<boolean> => {
        return service.updateById(id, video);
    }

const deleteById = (service: IVideoService) =>
    async (id: string): Promise<boolean> => {
        return service.deleteById(id);
    }

const videoService: IVideoService = {
    create: create(videoUseCase),
    getOneById: getOneById(videoUseCase),
    getAll: getAll(videoUseCase),   
    updateById: updateById(videoUseCase),
    deleteById: deleteById(videoUseCase),
}

export default videoService;