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
