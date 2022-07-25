export interface Cache {
  get(key: string, params?: any): any;
  put(key: string, value: any, params?: any): any;
  delete(key: string);
}
