// Vercel catch-all API entry point for the existing Express application.
import handler from '../server/index.js';

export default function apiHandler(req, res) {
  // vercel.json forwards the original API path in __path so Express can
  // continue matching its existing /api/* routes after routing to this file.
  const requestUrl = new URL(req.url, 'http://vercel.local');
  const forwardedPath = requestUrl.searchParams.get('__path');

  if (forwardedPath) {
    requestUrl.searchParams.delete('__path');
    req.url = `/api/${forwardedPath}${requestUrl.search}`;
  }

  return handler(req, res);
}
