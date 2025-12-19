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

        // Sử dụng music.composeDetailed() để tạo nhạc với metadata chi tiết
        // Method này trả về audio data cùng với metadata và composition plan
        const musicLengthMs = data.duration ? data.duration * 1000 : 10000;

        // Đảm bảo độ dài trong khoảng hợp lệ (tối thiểu 3000ms = 3 giây)
        const validLengthMs = Math.max(3000, Math.min(300000, musicLengthMs));

        console.log(`Generating music with length: ${validLengthMs}ms (${validLengthMs / 1000}s)...`);

        // Gọi API composeDetailed để generate audio với metadata chi tiết
        const response = await elevenlabs.music.composeDetailed({
            prompt: data.prompt,
            musicLengthMs: validLengthMs,
        });

        console.log('Music generation completed, processing response...');

        // composeDetailed() trả về object với structure:
        // - response.audio: audio data (có thể là Buffer, Uint8Array, hoặc stream)
        // - response.json: metadata và composition plan
        // - response.filename: tên file được đề xuất

        // Cast response để TypeScript hiểu structure
        const detailedResponse = response as any;

        // Log metadata nếu có
        if (detailedResponse.json) {
            console.log('Song metadata:', {
                title: detailedResponse.json.songMetadata?.title,
                genres: detailedResponse.json.songMetadata?.genres,
                sections: detailedResponse.json.compositionPlan?.sections?.length || 0
            });
        }

        // Xử lý audio data từ response
        let nodeStream: Readable;

        // Kiểm tra response.audio (audio data) hoặc response chính nó nếu không có property audio
        const audioData = detailedResponse.audio || response;

        if (audioData instanceof ReadableStream) {
            // Nếu là Web ReadableStream, convert sang Node.js stream
            nodeStream = Readable.fromWeb(audioData as any);
            console.log('Converted Web ReadableStream to Node.js stream');
        } else if (audioData && typeof audioData === 'object' && 'pipe' in audioData && typeof (audioData as any).pipe === 'function') {
            // Nếu đã là Node.js stream
            nodeStream = audioData as Readable;
            console.log('Response is already Node.js stream');
        } else if (Buffer.isBuffer(audioData)) {
            // Nếu là Buffer
            nodeStream = Readable.from(audioData);
            console.log('Audio data is Buffer');
        } else if (audioData instanceof Uint8Array) {
            // Nếu là Uint8Array
            const buffer = Buffer.from(audioData);
            nodeStream = Readable.from(buffer);
            console.log('Audio data is Uint8Array');
        } else if (audioData instanceof ArrayBuffer) {
            // Nếu là ArrayBuffer
            const buffer = Buffer.from(new Uint8Array(audioData));
            nodeStream = Readable.from(buffer);
            console.log('Audio data is ArrayBuffer');
        } else {
            // Log để debug nếu response không đúng format
            console.error('Unexpected response type:', typeof response);
            console.error('Response keys:', response && typeof response === 'object' ? Object.keys(response) : 'N/A');
            console.error('Audio data type:', typeof audioData);
            throw new Error(`Không thể xử lý audio data. Response type: ${typeof response}, Audio type: ${typeof audioData}`);
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