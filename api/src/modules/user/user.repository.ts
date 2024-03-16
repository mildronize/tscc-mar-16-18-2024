import { Database } from '@tscc/core';
import { UserModel } from './user.model';

export class UserRepository {

  constructor(protected db: Database<UserModel>) {}

  async getAll() {
    return this.db.readAll();
  }

}
