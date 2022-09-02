import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/CreateUserDto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) return null;

    if (!user.comparePassword(pass)) return null;

    return user;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user._id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signup(user: CreateUserDto) {
    const existingUser = await this.usersService.findOneByEmail(user.email);

    if (existingUser)
      throw new BadRequestException(
        'Sorry a user with that email already exist.',
      );

    const newUser = await this.usersService.create(user);

    return {
      user: newUser,
      ...(await this.login(newUser)),
    };
  }
}
