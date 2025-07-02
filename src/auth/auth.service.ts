import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { AuthDto } from './dto/auth.dto';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.getUserByEmail(email);
    if (user && (await compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(loginDto: AuthDto, res: Response) {
    const { email, password } = loginDto;
    const user: User | null = await this.validateUser(email, password);
    if (!user) {
      res.status(401).send({ message: 'Invalid credentials' });
      return;
    }
    const payload = {
      sub: user.id,
      name: user.name,
      email: user.email,
    };
    const access_token = await this.jwtService.signAsync(payload, {
      expiresIn: process.env.JWT_EXPIRESIN,
      secret: process.env.JWT_SECRET,
    });
    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: true,
    });
    res.send('Login Successful!');
  }
}
