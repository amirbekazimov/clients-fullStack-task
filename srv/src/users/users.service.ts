import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UsersEntity)
    private usersRepo: Repository<UsersEntity>,
  ) {}

  async findAll(page = 1, limit = 10): Promise<{ users: UsersEntity[]; totalPages: number }> {
    const skip = (page - 1) * limit;
    const [users, total] = await this.usersRepo.findAndCount({ skip, take: limit });
    const totalPages = Math.ceil(total / limit);
    return { users, totalPages };
  }
}
