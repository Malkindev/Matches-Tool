// Vercel serverless entry point for the existing Express API.
// Keep all authentication and API routes in server/index.js so local and
// deployed requests use the same implementation.
export { default } from '../server/index.js';
