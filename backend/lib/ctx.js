import { AsyncLocalStorage } from 'node:async_hooks';
export const ctx = new AsyncLocalStorage(); // holds { requestId, userId? }
export const getCtx = () => ctx.getStore();