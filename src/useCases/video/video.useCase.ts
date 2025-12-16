import { VideoClientType, VideoModelSequelize, VideoModelType } from "../../models/video.model";

export interface IVideoUseCase {
    create: (video: Partial<VideoClientType>) => Promise<VideoModelType | null>;
    getOneById: (id: string) => Promise<VideoModelType | null>;
    getAll: () => Promise<VideoModelType[] | null>;
    updateById: (id: string, video: Partial<VideoClientType>) => Promise<boolean>;
    deleteById: (id: string) => Promise<boolean>;
}

const create = async (video: Partial<VideoClientType>): Promise<VideoModelType | null> => {
    let newVideo = await VideoModelSequelize.create(video);
    if (!newVideo) return null;
    return newVideo.dataValues as VideoModelType;
}

const getOneById = async (id: string): Promise<VideoModelType | null> => {
    let video = await VideoModelSequelize.findByPk(id);
    if (!video) return null;
    return video.dataValues as VideoModelType;
}

const getAll = async (): Promise<VideoModelType[] | null> => {
    let videos = await VideoModelSequelize.findAll();
    if (!videos) return null;
    return videos.map(v => v.dataValues as VideoModelType);
}

const updateById = async (id: string, video: Partial<VideoClientType>): Promise<boolean> => {
    let [updated] = await VideoModelSequelize.update(video, { where: { id } })
    if (updated === 0) return false;
    return true;
}

const deleteById = async (id: string): Promise<boolean> => {
    let deleted = await VideoModelSequelize.destroy({ where: { id } })
    if (deleted === 0) return false;
    return true;
}

const videoUseCase: IVideoUseCase = {
    create,
    getOneById,
    getAll,
    updateById,
    deleteById,
}
export default videoUseCase;