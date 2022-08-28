import { Cache } from './cache';

export class TestCache implements Cache {
  cache = {};

  get(key: string, _params?: any): Promise<any> {
    return Promise.resolve(this.cache[key]);
  }

  put(key: string, value: any, _params?: any): Promise<void> {
    this.cache[key] = value;
    return Promise.resolve();
  }

  delete(key: string): Promise<void> {
    delete this.cache[key];
    return Promise.resolve();
  }
}
