import type { Request, Response, NextFunction } from 'express';
import express from 'express';
import { BaseResponse } from './response';
import { MaybePromise } from './types';

export type RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => MaybePromise<BaseResponse>;

export const catchAsync =
  (fn: (...args: any[]) => any) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };

export class Router {
  constructor(public readonly instance: express.Router = express.Router()) {}

  private extractHandlers(handlers: RequestHandler[]) {
    const handler = handlers[handlers.length - 1];
    const middlewares = handlers.slice(0, handlers.length - 1);
    return { handler, middlewares };
  }

  private preRequest(handler: RequestHandler) {
    const invokeHandler = async (req: Request, res: Response, next: NextFunction) => {
      const result = await handler(req, res, next);
      return res.send({
        success: true,
        message: 'Request successful',
        ...result,
      } satisfies BaseResponse);
    };
    return catchAsync(invokeHandler);
  }

  get(path: string, ...handlers: RequestHandler[]) {
    const { handler, middlewares } = this.extractHandlers(handlers);
    this.instance.get(path, middlewares, this.preRequest(handler));
  }

  post(path: string, ...handlers: RequestHandler[]) {
    const { handler, middlewares } = this.extractHandlers(handlers);
    this.instance.post(path, middlewares, this.preRequest(handler));
  }

  put(path: string, ...handlers: RequestHandler[]) {
    const { handler, middlewares } = this.extractHandlers(handlers);
    this.instance.put(path, middlewares, this.preRequest(handler));
  }

  delete(path: string, ...handlers: RequestHandler[]) {
    const { handler, middlewares } = this.extractHandlers(handlers);
    this.instance.delete(path, middlewares, this.preRequest(handler));
  }
}
