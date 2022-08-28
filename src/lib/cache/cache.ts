export interface Cache {
  get(key: string, params?: any): Promise<any>;
  put(key: string, value: any, params?: any): Promise<void>;
  delete(key: string): Promise<void>;
}
