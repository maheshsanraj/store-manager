export class BaseService<T> {
  protected repository: any;

  constructor(repository: any) {
    this.repository = repository;
  }

  async create(data: any): Promise<T> {
    return this.repository.create(data);
  }

  async bulkCreate(data: Partial<T>[]): Promise<T[]> {
    return this.repository.bulkCreate(data as any[]);
  }

  async findById(id: string): Promise<T | null> {
    return this.repository.findById(id);
  }

  async findAll(): Promise<T[]> {
    return this.repository.findAll();
  }

  async update(id: string, data: any) {
    return this.repository.update(id, data);
  }

  async delete(id: string) {
    return this.repository.delete(id);
  }
}