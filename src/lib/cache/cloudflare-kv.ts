import { Cache } from './cache';

export class CloudflareKv implements Cache {
  namespace: any;
  constructor(namespace: any) {
    this.namespace = namespace;
  }

  get(key: string, params?: any): Promise<any> {
    return this.namespace.get(key, params ?? {});
  }

  put(key: string, value: any, params?: any): Promise<void> {
    return this.namespace.put(key, value, params ?? {});
  }

  delete(key: string): Promise<void> {
    return this.namespace.delete(key);
  }
}
