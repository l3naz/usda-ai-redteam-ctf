import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  // Never log secrets / PII
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'req.body.password',
      'req.body.token',
      'req.body.apiKey',
      '*.secret',
      '*.flag' // just in case
    ],
    censor: '[REDACTED]'
  },
  formatters: {
    level(label) { return { level: label }; },
    bindings(b) { return { pid: b.pid, host: b.hostname }; }
  }
});
