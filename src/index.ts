import { createVideoElement } from './utils/createVideoElement';
import { awaitEvent } from './utils/events';

/**
 * 捕获视频指定时间点截图
 * @param video - 视频 URL
 * @param time - 时间点
 * @param signal - AbortSignal 用于取消操作
 * @returns Blob
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
}
