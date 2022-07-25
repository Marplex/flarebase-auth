import { Cache } from './cache';

export class TestCache implements Cache {
  cache = {};

  get(key: string, _params?: any) {
    return this.cache[key];
  }

  put(key: string, value: any, _params?: any) {
    this.cache[key] = value;
  }

  delete(key: string) {
    delete this.cache[key];
  }
}
