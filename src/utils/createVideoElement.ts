/**
 * 创建视频元素
 * @param src 视频地址
 * @returns 视频元素
 */
export function createVideoElement(src: string) {
  const videoEl = document.createElement('video');
  videoEl.crossOrigin = 'anonymous';
  videoEl.preload = 'metadata';
  videoEl.muted = true;
  videoEl.playsInline = true;
  videoEl.src = src;
  return videoEl;
}
