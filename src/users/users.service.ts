import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findOneByEmail(email: string): Promise<any> {
    return await this.userModel.findOne({ email });
  }

  async create(createUserInput: any) {
    const user = new this.userModel(createUserInput);

    user.password = user.hashPassword(user.password);

    if (await user.save()) return user;

    return null;
  }
}
