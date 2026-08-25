export default {
  async fetch(request, env) {
    if (!env.ASSETS?.fetch) {
      return new Response('MindBridge assets are unavailable.', { status: 503 });
    }

    const assetResponse = await env.ASSETS.fetch(request);
    if (assetResponse.status !== 404 || request.method !== 'GET') {
      return assetResponse;
    }

    const acceptsHtml = request.headers.get('accept')?.includes('text/html');
    if (!acceptsHtml) return assetResponse;

    const fallbackUrl = new URL(request.url);
    fallbackUrl.pathname = '/index.html';
    return env.ASSETS.fetch(new Request(fallbackUrl, request));
  },
};

