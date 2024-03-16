import type { Request, Response } from 'express';
import { UserRepository } from './user.repository';

export class UserController {

  constructor(public userRepository: UserRepository) {}

  async getAll(req: Request, res: Response) {
    return res.json(await this.userRepository.getAll());
  }


}
