import { useEffect, useState, useRef, useMemo } from 'react';
import { getScreenshotTimeline } from '../utils';

/**
 * React Hook：生成视频截图时间轴
 * @param video - 视频 URL 或已存在的 HTMLVideoElement 元素，支持 null 或 undefined
 * @param count - 截图数量，默认为 10
 * @returns (string | null)[] - 截图数组，会随着截图生成逐步更新  null 表示该时间点截图还未生成
 * @example
 * ```tsx
 * const frames = useScreenshotTimeline('video.mp4', 10);
 * return (
 *   <div>
 *     {frames.map((frame, i) => (
 *       <img key={i} src={URL.createObjectURL(frame)} />
 *     ))}
 *   </div>
 * );
 * ```
 */
export function useScreenshotTimeline(video: string | HTMLVideoElement | null | undefined, count = 10): string[] {
  const blobUrlCollectorRef = useRef<Set<string>>(new Set());
  const [screenshotTimeline, setScreenshotTimeline] = useState<string[]>([]);

  useEffect(() => {
    return () => {
      for (const url of blobUrlCollectorRef.current) {
        URL.revokeObjectURL(url);
      }
      blobUrlCollectorRef.current.clear();
    };
  }, []);

  useEffect(() => {
    if (!video || count <= 0) {
      setScreenshotTimeline([]);
      return undefined;
    }

    let isActive = true;
    const controller = new AbortController();

    setScreenshotTimeline([]);

    (async () => {
      for await (const frame of getScreenshotTimeline(video, count, controller.signal)) {
        if (!isActive) return;
        const url = URL.createObjectURL(frame)
        setScreenshotTimeline((prev) => ([...prev, url]));
        blobUrlCollectorRef.current.add(url);
      }
    })();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [video, count]);

  return useMemo(() => Array(count).fill(null).map((_, index) => screenshotTimeline[index] ?? null), [screenshotTimeline, count]);
}