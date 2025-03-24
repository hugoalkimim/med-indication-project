import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {}

  async create(data: Partial<User>): Promise<User> {
    const newUser = new this.userModel(data);
    return newUser.save();
  }

  async findByEmail(email: string): Promise<User | undefined> {
    // @ts-ignore
    return this.userModel.findOne({ email });
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  async findById(id: string): Promise<User | undefined> {
    // @ts-ignore
    return this.userModel.findById(id);
  }
}