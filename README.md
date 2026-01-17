# video-frame-tools

一个用于提取视频帧的工具，提供浏览器端的封面截图能力。

## 安装

```bash
pnpm add video-frame-tools
# or
npm i video-frame-tools
# or
yarn add video-frame-tools
```

## 使用

```ts
import { captureVideoFrame } from 'video-frame-tools';

const blob = await captureVideoFrame(
  'https://example.com/video.mp4',
  1.5,
);

// 例如：生成 object URL
const url = URL.createObjectURL(blob);
```

## API

### captureVideoFrame(video, time, signal?)

- `video`: `string | HTMLVideoElement`，视频 URL 或已存在的 `HTMLVideoElement`
- `time`: `number`，截图时间点（秒）
- `signal`: `AbortSignal`，可选，用于取消操作
- 返回: `Promise<Blob>`

## 运行环境

仅支持浏览器环境（依赖 `HTMLVideoElement`、`createImageBitmap`、`Canvas`/`OffscreenCanvas`）。

## License

MIT
