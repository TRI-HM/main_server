import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import fs from "fs";
import path from "path";
import { pipeline } from "stream/promises";
import { Readable } from "stream";
import { ITextToMusicRequest } from "../../../domain/ai/elevenlabs/textToMusic/controller";
import ioCustom from "../../../util/ioCustom";
import { StatusCodes } from "http-status-codes";

const ensureDirectoryExists = (dirPath: string) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

const textToMusic = async (data: ITextToMusicRequest) => {
    try {
        if (!data.prompt) {
            throw new Error('Prompt is required');
        }

        const client = new ElevenLabsClient({
            // apiKey: process.env.ELEVENLABS_API_KEY,
            apiKey: 'sk_b54c2d08b105e229dcde46a4bc7b6129c23eed58bbe0abd9',
        });

        // Setup đường dẫn
        const rootDir = process.cwd();
        const audioDir = path.join(rootDir, 'public', 'audio');

        const safeFileName = data.fileName
            ? data.fileName.replace(/[^a-z0-9]/gi, '_').toLowerCase() + (data.fileName.endsWith('.mp3') ? '' : '.mp3')
            : `music_${Date.now()}.mp3`;

        ensureDirectoryExists(audioDir);
        const filePath = path.join(audioDir, safeFileName);

        console.log(`Generating music for: "${data.prompt}"...`);

        // Gọi API - Trả về Web Stream
        const audioStream = await client.textToSoundEffects.convert({
            text: data.prompt,
            durationSeconds: data.duration || 10,
            promptInfluence: 0.5,
        });

        // Convert sang Node Stream
        // Lưu ý: SDK trả về dòng dữ liệu chuẩn Web, cần ép sang chuẩn Node
        const nodeStream = Readable.fromWeb(audioStream as any);

        const fileStream = fs.createWriteStream(filePath);

        // Pipeline giờ sẽ hoạt động trơn tru
        await pipeline(nodeStream, fileStream);

        console.log(`✅ File saved successfully at: ${filePath}`);

        return ioCustom.toResponse(StatusCodes.OK, 'Music generated successfully', {
            filePath: filePath,
            publicUrl: `/audio/${safeFileName}`
        });

    } catch (error: any) {
        console.error('Error generating music:', error);
        throw new Error(error.message || 'Internal Server Error');
    }
}

const textToMusicService = {
    textToMusic,
}

export default textToMusicService;