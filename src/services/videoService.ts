import { Model } from "sequelize";
import { VideoModelSequelize, VideoModelType } from "../models/videoModel";

const postVideo = async (video: VideoModelType): Promise<VideoModelType | null> => {
    let newVideo = await VideoModelSequelize.create({
        file_name: video.file_name,
        file_path: video.file_path,
        phone: video.phone || undefined,
        is_enabled: video.is_enabled,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,   
    });
    if (!newVideo) return null;
    return newVideo.dataValues as VideoModelType;
}
    
    
const videoService = {
    postVideo
}
export default videoService;
