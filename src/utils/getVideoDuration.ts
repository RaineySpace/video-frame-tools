import { createVideoElement } from './createVideoElement';
import { awaitEvent } from './events';

/**
 * 获取视频时长
 * @param video - 视频 URL 或已存在的 HTMLVideoElement 元素
 * @param signal - 可选的 AbortSignal，用于取消操作
 * @returns Promise，返回视频时长（秒），如果无法获取则返回 0
 * @throws 当操作被取消时抛出错误
 */
export async function getVideoDuration(video: string | HTMLVideoElement, signal?: AbortSignal) {
  const videoEl = typeof video === 'string' ? createVideoElement(video) : video;
  if (videoEl.readyState < HTMLMediaElement.HAVE_METADATA) {
    await awaitEvent(videoEl, 'loadedmetadata', signal);
    signal?.throwIfAborted();
  }
  return Number.isFinite(videoEl.duration) ? videoEl.duration : 0;
}