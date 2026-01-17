import { captureVideoFrame } from './captureVideoFrame';
import { getVideoDuration } from './getVideoDuration';

/**
 * 生成视频截图时间轴
 * @param video - 视频 URL 或已存在的 HTMLVideoElement 元素
 * @param length - 截图数量
 * @param signal - 可选的 AbortSignal，用于取消操作
 * @yields Promise<Blob> - 每次 yield 返回一个截图的 Blob 对象
 * @throws 当操作被取消时抛出错误
 * @example
 * ```ts
 * for await (const frame of getScreenshotTimeline('video.mp4', 10)) {
 *   console.log('获取到一帧截图', frame);
 * }
 * ```
 */
export async function* getScreenshotTimeline(video: string | HTMLVideoElement, length: number, signal?: AbortSignal) {
  const duration = await getVideoDuration(video, signal);
  const step = duration / length;
  for (let i = 0; i < length; i++) {
    yield captureVideoFrame(video, i * step, signal);
    signal?.throwIfAborted();
  }
}