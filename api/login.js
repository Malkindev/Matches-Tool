// Explicit Vercel function for POST /api/login.
// The shared Express app keeps the existing authentication implementation.
import handler from '../server/index.js';

export default function loginHandler(req, res) {
  // Vercel's file-based function route is /api/login; normalize the URL so
  // the shared Express router reaches its existing /api/login handler.
  req.url = '/api/login';
  return handler(req, res);
}
