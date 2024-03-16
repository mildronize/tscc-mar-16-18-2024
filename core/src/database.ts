import path from 'path';
import fs from 'fs/promises';
import fsSync from 'fs';
import { v4 as uuidv4 } from 'uuid';

const databasePrefix = 'data';

export interface DatabaseOptions {
  defaultData: object;
}

export class Database {
  private databasePath: string;

  constructor(
    collectionName: string,
    protected options?: DatabaseOptions
  ) {
    this.databasePath = path.join(databasePrefix, collectionName + '.json');
  }

  async init() {
    const defaultData = this.options?.defaultData ?? [];
    if (!fsSync.existsSync(this.databasePath)) {
      await fs.mkdir(databasePrefix, { recursive: true });
      await fs.writeFile(
        this.databasePath,
        JSON.stringify(defaultData, null, 2),
        'utf8'
      );
    }
    return this;
  }

  async readAll() {
    await this.init();
    const data = await fs.readFile(this.databasePath, 'utf-8');
    return JSON.parse(data) as any[];
  }

  async read(id: string) {
    const data = await this.readAll();
    return data.find((item) => item.id === id);
  }

  async update(input: any) {
    const data = await this.readAll();
    const index = data.findIndex((item) => item.id === input.id);
    data[index] = {
      ...data[index],
      ...input
    } as any;
    await fs.writeFile(this.databasePath, JSON.stringify(data, null, 2));
  }

  async delete(id: string) {
    const data = await this.readAll();
    const index = data.findIndex((item) => item.id === id);
    data.splice(index, 1);
    await fs.writeFile(this.databasePath, JSON.stringify(data, null, 2));
  }

  async insert(input: any) {
    const data = await this.readAll();
    // Add a new change
    data.push({
      ...input,
      id: uuidv4()
    } as any);
    await fs.writeFile(this.databasePath, JSON.stringify(data, null, 2));
  }

}

