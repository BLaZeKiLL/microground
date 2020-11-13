export const loadBundle = (url : string, cache = false) : Promise<Event> => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script') as HTMLScriptElement;

    if (!cache) url = `${url}?time=${Date.now()}`

    script.src = url;
    script.type = 'text/javascript';

    document.body.appendChild(script);

    script.onload = resolve;
    script.onerror = reject;
  });
}