import pinoHttp from 'pino-http';
import { randomUUID } from 'node:crypto';
import { ctx } from '../lib/ctx.js';
import { logger } from '../lib/logger.js';

export function withContext(req, res, next) {
  const rid = req.headers['x-request-id'] || randomUUID();
  // open an ALS context for this request
  ctx.run({ requestId: rid }, () => {
    // propagate id to response for clients
    res.setHeader('X-Request-Id', rid);
    next();
  });
}

export const httpLogger = pinoHttp({
  logger,
  genReqId: (req) => req.headers['x-request-id'] || randomUUID(),
  customProps: () => {
    const store = ctx.getStore();
    return store ? { requestId: store.requestId } : {};
  },
  customSuccessMessage: (req, res) => `${req.method} ${req.url} -> ${res.statusCode}`,
  customErrorMessage: (req, res, err) =>
    `ERR ${req.method} ${req.url} -> ${res.statusCode}: ${err?.message}`
});
