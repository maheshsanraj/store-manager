import {
  Model,
  ModelStatic,
  WhereOptions,
  FindOptions,
  CreateOptions,
  Transaction,
} from "sequelize";

export class BaseRepository<T extends Model> {
  protected model: ModelStatic<T>;

  constructor(model: ModelStatic<T>) {
    this.model = model;
  }

  async create(
    data: Partial<T>,
    options: CreateOptions = {}
  ): Promise<T> {
    return this.model.create(data as any, options);
  }

  async bulkCreate(data: Partial<T>[]): Promise<T[]> {
    return this.model.bulkCreate(data as any[], { ignoreDuplicates: true });
  }

  async findById(id: string, transaction?: Transaction): Promise<T | null> {
    return this.model.findByPk(id, { transaction });
  }

  async findOne(options: FindOptions): Promise<T | null> {
    return this.model.findOne(options);
  }

  async findAll(options: FindOptions = {}): Promise<T[]> {
    return this.model.findAll(options);
  }

  async update(
    where: WhereOptions,
    data: Partial<T>,
    transaction?: Transaction
  ): Promise<number> {

    const [affectedCount] = await this.model.update(
      data as any,
      {
        where,
        transaction
      }
    );

    return affectedCount;
  }

  async delete(where: WhereOptions, transaction: Transaction): Promise<number> {
    return this.model.destroy({ where, transaction });
  }
  async count(
    where: WhereOptions = {},
    transaction?: Transaction
  ): Promise<number> {

    return this.model.count({
      where,
      transaction
    });

  }
}