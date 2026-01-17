/**
 * 等待目标对象触发指定事件
 * @param target - 事件目标对象
 * @param event - 事件名称
 * @param signal - 可选的 AbortSignal，用于取消等待
 * @returns Promise，在事件触发时 resolve，在取消时 reject
 * @throws 当操作被取消时抛出错误
 */
export async function awaitEvent(target: EventTarget, event: string, signal?: AbortSignal) {
  return new Promise<Event>((resolve, reject) => {
    const onEvent = (evt: Event) => {
      cleanup();
      resolve(evt);
    };

    const onAbort = () => {
      cleanup();
      reject(signal?.reason ?? new Error('操作已取消'));
    };

    const cleanup = () => {
      target.removeEventListener(event, onEvent);
      signal?.removeEventListener('abort', onAbort);
    };

    if (signal?.aborted) {
      cleanup();
      reject(signal?.reason ?? new Error('操作已取消'));
    }

    target.addEventListener(event, onEvent, { once: true });
    if (signal) {
      signal.addEventListener('abort', onAbort, { once: true });
    }
  });
}
