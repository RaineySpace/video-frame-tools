/**
 * 创建配置好的视频元素
 * @param src - 视频 URL 地址
 * @returns HTMLVideoElement - 配置了跨域、预加载元数据、静音等属性的视频元素
 */
export function createVideoElement(src: string) {
  const videoEl = document.createElement('video');
  videoEl.crossOrigin = 'anonymous';
  videoEl.preload = 'auto';
  videoEl.muted = true;
  videoEl.playsInline = true;
  videoEl.src = src;
  return videoEl;
}
