import { Database } from '@tscc/core';
import { UserModel } from './user.model';

export class UserRepository {

  constructor(protected db: Database<UserModel>) {}

  async getAll() {
    return this.db.readAll();
  }

  async get(id: string) {
    return this.db.read(id);
  }

  async create(input: UserModel) {
    return this.db.insert(input);
  }

  async update(input: UserModel) {
    return this.db.update(input);
  }

  async delete(id: string) {
    return this.db.delete(id);
  }

}
