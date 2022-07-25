import { Cache } from './cache';

export class CloudflareKv implements Cache {
  namespace: any;
  constructor(namespace: any) {
    this.namespace = namespace;
  }

  get(key: string, params?: any) {
    return this.namespace.get(key, params ?? {});
  }

  put(key: string, value: any, params?: any) {
    this.namespace.put(key, value, params ?? {});
  }

  delete(key: string) {
    this.namespace.delete(key);
  }
}
