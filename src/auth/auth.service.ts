import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.module';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';

interface UserResponse {
  id: number;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  role: Role;
  createdAt: Date;
}

interface RegisterResponse {
  message: string;
  user: UserResponse;
}

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(registerDto: RegisterDto): Promise<RegisterResponse> {
    const { email, password, name } = registerDto;

    // Check if user already exists
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword: string = await bcrypt.hash(password, saltRounds);

    // Create user
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const user: UserResponse = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        role: true,
        createdAt: true,
      },
    });

    return {
      message: 'User registered successfully',
      user,
    };
  }
}
