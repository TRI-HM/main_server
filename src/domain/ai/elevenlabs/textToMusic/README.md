# Hướng dẫn sử dụng Text to Music API

API này cho phép tạo nhạc từ mô tả văn bản sử dụng ElevenLabs Music Generation API.

## Endpoint

```
POST /api/ai/elevenlabs/text-to-music
```

## Request

### Headers

```javascript
Content-Type: application/json
```

### Body Parameters

| Tham số | Kiểu | Bắt buộc | Mô tả | Mặc định |
|---------|------|----------|-------|----------|
| `prompt` | string | ✅ Có | Mô tả nhạc cần tạo (ví dụ: "Piano bar jazz with soft drums", "Upbeat electronic dance music") | - |
| `fileName` | string | ❌ Không | Tên file mong muốn (không cần đuôi .mp3, sẽ tự động thêm). Ký tự đặc biệt sẽ được thay thế bằng dấu gạch dưới | `music_{timestamp}.mp3` |
| `duration` | number | ❌ Không | Độ dài nhạc tính bằng giây | `10` (10 giây) |

### Ví dụ Request Body

```json
{
  "prompt": "Piano bar jazz with soft drums",
  "fileName": "my-jazz-song",
  "duration": 30
}
```

## Response

### Response Format

```typescript
{
  statusCode: number;
  message: string;
  data: {
    filePath: string;      // Đường dẫn file trên server
    publicUrl: string;     // URL công khai để truy cập file
  }
}
```

### Ví dụ Response (Thành công)

```json
{
  "statusCode": 200,
  "message": "Music generated successfully",
  "data": {
    "filePath": "D:\\project\\main_server\\public\\audio\\my_jazz_song.mp3",
    "publicUrl": "/audio/my_jazz_song.mp3"
  }
}
```

### Ví dụ Response (Lỗi)

```json
{
  "statusCode": 400,
  "message": "Prompt is required",
  "data": null
}
```

## Ví dụ sử dụng

### JavaScript/TypeScript (Fetch API)

```javascript
async function generateMusic(prompt, fileName, duration) {
  try {
    const response = await fetch('http://localhost:3000/api/ai/elevenlabs/text-to-music', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        fileName: fileName,
        duration: duration
      })
    });

    const result = await response.json();
    
    if (result.statusCode === 200) {
      console.log('Music generated successfully!');
      console.log('Public URL:', result.data.publicUrl);
      console.log('File path:', result.data.filePath);
      
      // Sử dụng publicUrl để phát nhạc
      const audioUrl = `http://localhost:3000${result.data.publicUrl}`;
      return audioUrl;
    } else {
      console.error('Error:', result.message);
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
}

// Sử dụng
generateMusic('Upbeat electronic dance music', 'dance-track', 45)
  .then(audioUrl => {
    // Phát nhạc
    const audio = new Audio(audioUrl);
    audio.play();
  })
  .catch(error => {
    console.error('Failed to generate music:', error);
  });
```

### Axios

```javascript
import axios from 'axios';

async function generateMusic(prompt, fileName, duration) {
  try {
    const response = await axios.post(
      'http://localhost:3000/api/ai/elevenlabs/text-to-music',
      {
        prompt: prompt,
        fileName: fileName,
        duration: duration
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const result = response.data;
    
    if (result.statusCode === 200) {
      console.log('Music generated successfully!');
      return result.data.publicUrl;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    if (error.response) {
      console.error('API Error:', error.response.data);
    } else {
      console.error('Request Error:', error.message);
    }
    throw error;
  }
}
```

### cURL

```bash
curl -X POST http://localhost:3000/api/ai/elevenlabs/text-to-music \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Relaxing ambient music with nature sounds",
    "fileName": "ambient-nature",
    "duration": 60
  }'
```

### React Hook Example

```typescript
import { useState } from 'react';

interface MusicGenerationResponse {
  statusCode: number;
  message: string;
  data: {
    filePath: string;
    publicUrl: string;
  };
}

function useTextToMusic() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const generateMusic = async (
    prompt: string,
    fileName?: string,
    duration?: number
  ) => {
    setLoading(true);
    setError(null);
    setAudioUrl(null);

    try {
      const response = await fetch('/api/ai/elevenlabs/text-to-music', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          fileName,
          duration,
        }),
      });

      const result: MusicGenerationResponse = await response.json();

      if (result.statusCode === 200) {
        // Lấy base URL từ window.location hoặc từ environment variable
        const baseUrl = window.location.origin;
        const fullUrl = `${baseUrl}${result.data.publicUrl}`;
        setAudioUrl(fullUrl);
        return fullUrl;
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { generateMusic, loading, error, audioUrl };
}

// Sử dụng trong component
function MusicGenerator() {
  const { generateMusic, loading, error, audioUrl } = useTextToMusic();

  const handleGenerate = async () => {
    try {
      await generateMusic('Happy birthday song', 'birthday-song', 30);
    } catch (err) {
      console.error('Failed to generate music:', err);
    }
  };

  return (
    <div>
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? 'Đang tạo nhạc...' : 'Tạo nhạc'}
      </button>
      {error && <p style={{ color: 'red' }}>Lỗi: {error}</p>}
      {audioUrl && (
        <audio controls src={audioUrl}>
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
}
```

## Lưu ý quan trọng

### 1. Giới hạn độ dài nhạc

- **Tối thiểu**: 3 giây (3000ms)
- **Tối đa**: 300 giây (5 phút = 300000ms)
- Nếu bạn truyền `duration` ngoài khoảng này, hệ thống sẽ tự động điều chỉnh về giá trị gần nhất trong phạm vi hợp lệ

### 2. Xử lý tên file

- Tên file (`fileName`) sẽ được **sanitize tự động**:
  - Chuyển thành chữ thường
  - Thay thế ký tự đặc biệt bằng dấu gạch dưới (`_`)
  - Tự động thêm đuôi `.mp3` nếu chưa có
- **Ví dụ**:
  - Input: `"My Song #1!"` → Output: `"my_song__1_.mp3"`
  - Input: `"track-name.mp3"` → Output: `"track_name.mp3"`

### 3. Prompt (Mô tả nhạc)

- Cung cấp mô tả **rõ ràng và chi tiết** để có kết quả tốt hơn
- Có thể mô tả:
  - Thể loại nhạc (jazz, electronic, classical, etc.)
  - Nhạc cụ (piano, guitar, drums, etc.)
  - Tâm trạng (relaxing, upbeat, energetic, etc.)
  - Phong cách (ambient, baroque, modern, etc.)
- **Ví dụ prompt tốt**:
  - ✅ "Piano bar jazz with soft drums and bass"
  - ✅ "Upbeat electronic dance music with synthesizers"
  - ✅ "Relaxing ambient music with nature sounds and gentle piano"
- **Ví dụ prompt không tốt**:
  - ❌ "Nhạc" (quá chung chung)
  - ❌ "Music" (quá đơn giản)

### 4. URL truy cập file

- File được lưu trong thư mục `public/audio/`
- Sử dụng `publicUrl` từ response để truy cập file
- URL đầy đủ: `http://your-domain.com{publicUrl}`
- File có thể được truy cập trực tiếp qua URL mà không cần authentication

### 5. Xử lý lỗi

- API sẽ trả về status code HTTP tương ứng với lỗi
- Luôn kiểm tra `statusCode` trong response để xác định thành công hay thất bại
- Các lỗi phổ biến:
  - `400`: Missing prompt (thiếu prompt)
  - `500`: Internal server error (lỗi từ ElevenLabs API hoặc server)

### 6. Timeout và hiệu năng

- Việc tạo nhạc có thể **mất thời gian** (tùy thuộc vào độ dài nhạc)
- Nhạc càng dài, thời gian xử lý càng lâu
- Khuyến nghị:
  - Set timeout cho request tối thiểu **60 giây** cho nhạc ngắn (< 30s)
  - Set timeout tối thiểu **180 giây** (3 phút) cho nhạc dài (30s - 5 phút)
  - Hiển thị loading indicator cho người dùng

### 7. Giới hạn và chi phí

- API này sử dụng ElevenLabs API (có thể có giới hạn và chi phí)
- Kiểm tra quota và rate limit của ElevenLabs API key
- Không nên gọi API quá nhiều lần trong thời gian ngắn

### 8. CORS (Cross-Origin Resource Sharing)

- Nếu client chạy trên domain khác với server, đảm bảo server đã cấu hình CORS đúng cách
- Nếu gặp lỗi CORS, liên hệ backend developer để cấu hình

### 9. Storage

- File được lưu vĩnh viễn trên server
- Cần có cơ chế cleanup/delete file cũ nếu không còn sử dụng để tiết kiệm dung lượng

### 10. Ví dụ xử lý response đầy đủ

```typescript
async function generateMusicWithFullErrorHandling(
  prompt: string,
  fileName?: string,
  duration?: number
) {
  try {
    // Validate input
    if (!prompt || prompt.trim().length === 0) {
      throw new Error('Prompt không được để trống');
    }

    if (duration && (duration < 3 || duration > 300)) {
      console.warn(`Duration ${duration}s ngoài phạm vi 3-300s, sẽ được điều chỉnh tự động`);
    }

    // Set timeout cho request (ví dụ: 3 phút)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 180000); // 3 phút

    const response = await fetch('/api/ai/elevenlabs/text-to-music', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt.trim(),
        fileName,
        duration,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.statusCode === 200 && result.data) {
      // Thành công
      const baseUrl = window.location.origin;
      const fullAudioUrl = `${baseUrl}${result.data.publicUrl}`;
      
      return {
        success: true,
        audioUrl: fullAudioUrl,
        publicUrl: result.data.publicUrl,
        filePath: result.data.filePath,
      };
    } else {
      throw new Error(result.message || 'Unknown error');
    }

  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. Việc tạo nhạc mất quá nhiều thời gian.');
      }
      throw error;
    }
    throw new Error('Unknown error occurred');
  }
}
```

## Tóm tắt nhanh

```javascript
// Request đơn giản nhất (bắt buộc có prompt)
POST /api/ai/elevenlabs/text-to-music
{
  "prompt": "Your music description here"
}

// Request đầy đủ
POST /api/ai/elevenlabs/text-to-music
{
  "prompt": "Piano bar jazz with soft drums",
  "fileName": "jazz-song",
  "duration": 30
}

// Response thành công
{
  "statusCode": 200,
  "message": "Music generated successfully",
  "data": {
    "filePath": "...",
    "publicUrl": "/audio/jazz_song.mp3"
  }
}
```
