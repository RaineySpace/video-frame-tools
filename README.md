# video-frame-tools

一个用于提取视频帧的工具，提供浏览器端的封面截图能力。

[![npm version](https://img.shields.io/npm/v/video-frame-tools.svg)](https://www.npmjs.com/package/video-frame-tools)
[![npm downloads](https://img.shields.io/npm/dm/video-frame-tools.svg)](https://www.npmjs.com/package/video-frame-tools)
[![license](https://img.shields.io/npm/l/video-frame-tools.svg)](https://github.com/RaineySpace/video-frame-tools/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.1-blue.svg)](https://www.typescriptlang.org/)

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

```tsx
import { useScreenshotTimeline } from 'video-frame-tools';

const frames = useScreenshotTimeline('https://example.com/video.mp4', 10);
return (
  <div>
    {frames.map((frame, i) => (
      <img key={i} src={frame ?? undefined} />
    ))}
  </div>
);
```

## API

### captureVideoFrame(video, time, signal?)

- `video`: `string | HTMLVideoElement`，视频 URL 或已存在的 `HTMLVideoElement`
- `time`: `number`，截图时间点（秒）
- `signal`: `AbortSignal`，可选，用于取消操作
- 返回: `Promise<Blob>`

### useScreenshotTimeline(video, count?)

- `video`: `string | HTMLVideoElement | null | undefined`，视频 URL 或已存在的 `HTMLVideoElement`
- `count`: `number`，截图数量，默认 10
- 返回: `(string | null)[]`，截图对应的 `object URL` 数组，`null` 表示尚未生成该帧

## 运行环境

仅支持浏览器环境（依赖 `HTMLVideoElement`、`createImageBitmap`、`Canvas`/`OffscreenCanvas`）。

## License

MIT
