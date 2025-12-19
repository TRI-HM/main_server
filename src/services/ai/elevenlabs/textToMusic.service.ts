import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import fs from "fs";
import path from "path";
import { pipeline } from "stream/promises";
import { Readable } from "stream";
import { ITextToMusicRequest } from "../../../domain/ai/elevenlabs/textToMusic/controller";
import ioCustom from "../../../util/ioCustom";
import { StatusCodes } from "http-status-codes";
import dotenv from "dotenv";
dotenv.config();

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

        const elevenlabs = new ElevenLabsClient();

        // Setup đường dẫn
        const rootDir = process.cwd();
        const audioDir = path.join(rootDir, 'public', 'audio');

        const safeFileName = data.fileName
            ? data.fileName.replace(/[^a-z0-9]/gi, '_').toLowerCase() + (data.fileName.endsWith('.mp3') ? '' : '.mp3')
            : `music_${Date.now()}.mp3`;

        ensureDirectoryExists(audioDir);
        const filePath = path.join(audioDir, safeFileName);

        console.log(`Generating music for: "${data.prompt}"...`);

        // Sử dụng music.compose() để tạo nhạc trực tiếp từ prompt
        // Đây là cách đơn giản và đúng nhất theo documentation của ElevenLabs
        const musicLengthMs = data.duration ? data.duration * 1000 : 10000;

        // Đảm bảo độ dài trong khoảng hợp lệ (tối thiểu 3000ms = 3 giây)
        const validLengthMs = Math.max(3000, Math.min(300000, musicLengthMs));

        console.log(`Generating music with length: ${validLengthMs}ms (${validLengthMs / 1000}s)...`);

        // Gọi API compose để generate audio trực tiếp
        const response = await elevenlabs.music.compose({
            prompt: data.prompt,
            musicLengthMs: validLengthMs,
        });

        console.log('Music generation completed, processing response...');

        // music.compose() trả về ReadableStream (Web Stream)
        // Cần convert sang Node.js Readable stream để ghi file
        let nodeStream: Readable;

        if (response instanceof ReadableStream) {
            // Convert Web ReadableStream sang Node.js Readable stream
            nodeStream = Readable.fromWeb(response as any);
            console.log('Converted Web ReadableStream to Node.js stream');
        } else if (response && typeof response === 'object' && 'pipe' in response && typeof (response as any).pipe === 'function') {
            // Nếu đã là Node.js stream
            nodeStream = response as Readable;
            console.log('Response is already Node.js stream');
        } else {
            // Log để debug nếu response không đúng format
            console.error('Unexpected response type:', typeof response);
            console.error('Response:', response);
            throw new Error(`Response không phải là ReadableStream. Type: ${typeof response}`);
        }

        const fileStream = fs.createWriteStream(filePath);

        // Pipeline để ghi file
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