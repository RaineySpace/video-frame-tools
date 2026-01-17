import { createVideoElement } from './createVideoElement';
import { awaitEvent } from './events';

/**
 * 捕获视频指定时间点的截图
 * @param video - 视频 URL 或已存在的 HTMLVideoElement 元素
 * @param time - 截图时间点（秒）
 * @param signal - 可选的 AbortSignal，用于取消操作
 * @returns Promise，返回截图的 Blob 对象
 * @throws 当 Canvas 初始化失败或导出失败时抛出错误
 * @example
 * ```ts
 * const blob = await captureVideoFrame('video.mp4', 1.5);
 * const url = URL.createObjectURL(blob);
 * ```
 */
export async function captureVideoFrame(
  video: string | HTMLVideoElement,
  time: number,
  signal?: AbortSignal,
) {
  const videoEl = typeof video === 'string' ? createVideoElement(video) : video;
  
  // 确保视频元数据加载完成
  if (videoEl.readyState < HTMLMediaElement.HAVE_METADATA) {
    await awaitEvent(videoEl, 'loadedmetadata', signal);
    signal?.throwIfAborted();
  }

  const duration = Number.isFinite(videoEl.duration) ? videoEl.duration : time;
  const clampedTime = Math.min(Math.max(time, 0), duration);

  if (Math.abs(videoEl.currentTime - clampedTime) > 0.01) {
    videoEl.currentTime = clampedTime;
    await awaitEvent(videoEl, 'seeked', signal);
  } else if (videoEl.readyState < 2) {
    await awaitEvent(videoEl, 'loadeddata', signal);
  }

  signal?.throwIfAborted();

  const bitmap = await createImageBitmap(videoEl);
  try {
    signal?.throwIfAborted();
    const canvas =
      typeof OffscreenCanvas !== 'undefined'
        ? new OffscreenCanvas(bitmap.width, bitmap.height)
        : Object.assign(document.createElement('canvas'), {
            width: bitmap.width,
            height: bitmap.height,
          });

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Canvas 初始化失败，无法生成封面');
    }
    ctx.drawImage(bitmap, 0, 0);
    const blob =
    canvas instanceof OffscreenCanvas
      ? await canvas.convertToBlob()
      : await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob((result) => {
            if (result) {
              resolve(result);
            } else {
              reject(new Error('Canvas 导出失败，无法生成封面'));
            }
          });
        });
    signal?.throwIfAborted();
    return blob;
  } finally {
    bitmap.close();
  }
}
