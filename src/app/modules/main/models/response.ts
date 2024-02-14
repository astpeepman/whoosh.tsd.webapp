export interface IListResponse<T>{
  readonly count: number;
  readonly page: number;
  readonly next: boolean;
  readonly results: T[];
}

export interface IResponseError{
  readonly code: string;
  readonly detail: {[key:string]: string}
}
