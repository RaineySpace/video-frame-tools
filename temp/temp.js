const image = document.createElement('img');
image.style = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;';
document.body.appendChild(image);

const videoUrl = 'https://material-extraction.oss-cn-hangzhou.aliyuncs.com/xhs/555aaa25e58d130be7597686/68eb01090000000005011ced.mp4';
const videoEl = document.createElement('video');
videoEl.crossOrigin = 'anonymous';
videoEl.preload = 'metadata';
videoEl.muted = true;
videoEl.playsInline = true;
videoEl.src = videoUrl;
videoEl.load();


(async () => {
  const waitForEvent = (target, event) =>
    new Promise((resolve, reject) => {
      const onEvent = () => cleanup(resolve);
      const onError = (err) => cleanup(() => reject(err));
      const cleanup = (done) => {
        target.removeEventListener(event, onEvent);
        target.removeEventListener('error', onError);
        done();
      };
      target.addEventListener(event, onEvent, { once: true });
      target.addEventListener('error', onError, { once: true });
    });

  if (videoEl.readyState < 1) {
    await waitForEvent(videoEl, 'loadedmetadata');
  }

  if (videoEl.readyState < 2) {
    videoEl.currentTime = 1;
    await waitForEvent(videoEl, 'seeked');
    if (videoEl.readyState < 2) {
      await waitForEvent(videoEl, 'loadeddata');
    }
  }

  const canvas =
    typeof OffscreenCanvas === 'undefined'
      ? Object.assign(document.createElement('canvas'), {
          width: videoEl.videoWidth,
          height: videoEl.videoHeight,
        })
      : new OffscreenCanvas(videoEl.videoWidth, videoEl.videoHeight);
  canvas.getContext('2d').drawImage(videoEl, 0, 0);
  const blob =
    typeof canvas.convertToBlob === 'function'
      ? await canvas.convertToBlob()
      : await new Promise((resolve) => canvas.toBlob(resolve));
  image.src = URL.createObjectURL(blob);
})();



