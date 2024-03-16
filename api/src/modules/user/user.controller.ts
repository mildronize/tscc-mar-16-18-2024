import type { Request, Response } from 'express';

export class UserController {

  async getAll(req: Request, res: Response) {
    return res.send({
      message: 'Get all users',
    });
  }
}
