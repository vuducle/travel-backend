import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.module';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

interface UserResponse {
  id: string;
  email: string;
  name: string | null;
  bio?: string | null;
  location?: string | null;
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
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<RegisterResponse> {
    const { email, password, name, bio, location } = registerDto;

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
        bio,
        location,
      },
      select: {
        id: true,
        email: true,
        name: true,
        bio: true,
        location: true,
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

  /**
   * Validate user credentials. Returns the user without password on success.
   */
  private async validateUser(
    email: string,
    password: string,
  ): Promise<UserResponse | null> {
    // include password for comparison
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const userWithPassword = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        avatarUrl: true,
        role: true,
        createdAt: true,
      },
    });

    if (!userWithPassword) return null;

    const match = await bcrypt.compare(password, userWithPassword.password);
    if (!match) return null;

    // strip password before returning
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _pw, ...safeUser } = userWithPassword;
    return safeUser as UserResponse;
  }

  /**
   * Login user and return JWT access token along with the user info.
   */
  async login(
    loginDto: LoginDto,
  ): Promise<{ accessToken: string; user: UserResponse }> {
    const { email, password } = loginDto;
    const user = await this.validateUser(email, password);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken, user };
  }

  /**
   * Logout user by adding token to blacklist
   */
  async logout(token: string): Promise<{ message: string }> {
    // Decode token to get expiration time
    const decoded = this.jwtService.decode(token) as { exp?: number };

    if (!decoded || !decoded.exp) {
      throw new UnauthorizedException('Invalid token');
    }

    const expiresAt = new Date(decoded.exp * 1000);

    // Add token to blacklist
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    await this.prisma.tokenBlacklist.create({
      data: {
        token,
        expiresAt,
      },
    });

    return { message: 'Logged out successfully' };
  }

  /**
   * Check if token is blacklisted
   */
  async isTokenBlacklisted(token: string): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const blacklisted = await this.prisma.tokenBlacklist.findUnique({
      where: { token },
    });

    return !!blacklisted;
  }
}
