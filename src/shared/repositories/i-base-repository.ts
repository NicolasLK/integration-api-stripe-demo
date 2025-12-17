export interface IFullBaseGateways<T> {
  create(postDto: T): Promise<T>;
  findAll(): Promise<T | null>;
  findById(id: number): Promise<T[]>;
  update(entity: T): Promise<T>;
  delete(id: string): Promise<void>;
}

export interface ICreateGateway<T> {
  create(postDto: T): Promise<T>;
}

export interface IFindAllGateway<T> {
  findAll(): Promise<T[] | null>;
}

export interface IFindByIdGateway<T> {
  findById(id: number): Promise<T | null>;
}

export interface IUpdateGateway<T> {
  update(entity: T): Promise<T>;
}

export interface IDeleteGateway {
  delete(id: string): Promise<void>;
}
