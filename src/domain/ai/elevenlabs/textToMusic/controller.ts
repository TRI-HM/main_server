import { wrapAsync } from "../../../../util/wrapAsync";
import { Request, Response } from "express";
import textToMusicService from "../../../../services/ai/elevenlabs/textToMusic.service";
import ioCustom from "../../../../util/ioCustom";
import { StatusCodes } from "http-status-codes";

export interface ITextToMusicRequest {
    prompt: string;      // Mô tả nhạc: "Piano bar jazz..."
    fileName?: string;   // Tên file mong muốn: "intro-song.mp3"
    duration?: number;   // Độ dài (giây)
}

export const textToMusic = wrapAsync(async (req: Request, res: Response) => {
    try {
        const data = req.body as ITextToMusicRequest;
        const music = await textToMusicService.textToMusic(data);
        res.status(200).json(ioCustom.toResponse(StatusCodes.OK, 'Music generated successfully', music));
    } catch (error) {
        throw new Error('Failed to generate music');
    }
});