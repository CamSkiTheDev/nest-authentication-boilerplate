import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/auth/roles/role.enum';

export type UserDocument = User & Document & UserFunctions;

@Schema()
export class User {
  @Prop({ unique: true, required: true, index: true })
  email: string;

  @Prop()
  password: string;

  @Prop({ required: true, default: [Role.User] })
  roles: Role[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.hashPassword = function (password: string): string {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(12));
};

UserSchema.methods.comparePassword = function (password: string): boolean {
  return bcrypt.compareSync(password, this.password);
};

export interface UserFunctions {
  hashPassword(password: string): string;
  comparePassword(password: string): boolean;
}
