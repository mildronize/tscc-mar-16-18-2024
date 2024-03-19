import type { Request, Response } from 'express';
import { UserRepository } from './user.repository';
import { BaseController } from '@tscc/core';
import { BaseResponse } from 'core/src/response';
import { UserModel } from './user.model';
import { z } from 'zod';
import { route } from './user.bootstrap';

const schemaUserGet =  z.object({
  username: z.string(),
  password: z.string(),
  email: z.string().email(),
})

export class UserController extends BaseController {
  constructor(public userRepository: UserRepository) {
    super();
  }

  /**
   * Read a list of users
   */
  async getAll(
    req: Request,
    res: Response
  ): Promise<BaseResponse<UserModel[]>> {
    return {
      data: await this.userRepository.getAll(),
    };
  }

  /**
   * Read a single user
   */
  async get(req: Request, res: Response): Promise<BaseResponse<UserModel>> {
    const schemaParams = z.object({
      id: z.string(),
    });
    const params = schemaParams.parse(req.params);
    return {
      data: await this.userRepository.get(params.id),
    };
  }

  /**
   * Create a new user
   */
  create = route
    .post('/')
    .query(
      z.object({
        username: z.string(),
        password: z.string(),
        email: z.string().email(),
      })
    )
    .body(
      z.object({
        name: z.string(),
      })
    )
    .handler(async ({ body }) => {

      return {
        data: await this.userRepository.create(body),
      }
    });
  // async create(req: Request, res: Response): Promise<BaseResponse<UserModel>> {
  //   await this.userRepository.create(req.body);
  //   return {
  //     message: 'User created successfully',
  //   };
  // }

  /**
   * Update a user
   */
  async update(req: Request, res: Response): Promise<BaseResponse> {
    await this.userRepository.update({
      ...req.body,
      id: req.params.id,
    });
    return {
      message: 'User updated successfully',
    };
  }

  /**
   * Delete a user
   */
  async delete(req: Request, res: Response) {
    await this.userRepository.delete(req.params.id);
    return {
      message: 'User deleted successfully',
    };
  }
}
