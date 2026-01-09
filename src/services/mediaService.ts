import { create } from "domain";
import { MediaModelType } from "../models/media";
import mediaUseCase from "../models/media";

const saveMedia = async (media: MediaModelType): Promise<MediaModelType | null> => {
    // Loại bỏ id nếu có để Sequelize tự động tạo
    const { id, ...mediaWithoutId } = media;
    let newMedia = await mediaUseCase.create({
        path: mediaWithoutId.path,
        type: mediaWithoutId.type,
        size: mediaWithoutId.size,
        mimeType: mediaWithoutId.mimeType,
        extension: mediaWithoutId.extension,
        name: mediaWithoutId.name,
    });
    if(!newMedia) return null;
    return newMedia;
}

const updateMedia = async (id: number, media: MediaModelType): Promise<boolean> => {
    let updatedMedia = await mediaUseCase.update(id, {
        path: media.path,
        type: media.type,
        size: media.size,
        mimeType: media.mimeType,
        extension: media.extension,
        name: media.name,
    });
    if(!updatedMedia) return false;
    return true;
}

const getAllMedia = async (): Promise<MediaModelType[] | null> => {
    let media = await mediaUseCase.getAll();
    if(!media) return null;
    return media;
}

const getOneMedia = async (id: number): Promise<MediaModelType | null> => {
    let media = await mediaUseCase.getOne(id);
    if(!media) return null;
    return media;
}

const deleteMedia = async (id: number): Promise<boolean> => {
    let deletedMedia = await mediaUseCase.delete(id);
    if(!deletedMedia) return false;
    return true;
}

const mediaService = {
    saveMedia: saveMedia,
    updateMedia: updateMedia,
    getAllMedia: getAllMedia,
    getOneMedia: getOneMedia,
    deleteMedia: deleteMedia,
}

export default mediaService;