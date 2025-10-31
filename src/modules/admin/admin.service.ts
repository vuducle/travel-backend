import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.module';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CreateAdminDto } from './dto/create-admin.dto';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async createAdmin(createAdminDto: CreateAdminDto) {
    const { email, username, password, name, bio, location } = createAdminDto;

    // Check if user already exists
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw new ConflictException('User with this email already exists');
      }
      if (existingUser.username === username) {
        throw new ConflictException('Username is already taken');
      }
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword: string = await bcrypt.hash(password, saltRounds);

    // Create admin user
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const admin = await this.prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        name,
        bio,
        location,
        role: Role.ADMIN,
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        bio: true,
        location: true,
        avatarUrl: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      message: 'Admin created successfully',
      admin,
    };
  }

  async assignAdminRole(userId: string) {
    // Check if user exists
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role === Role.ADMIN) {
      throw new ConflictException('User is already an admin');
    }

    // Update user role to ADMIN
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { role: Role.ADMIN },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        bio: true,
        location: true,
        avatarUrl: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      message: 'User promoted to admin successfully',
      admin: updatedUser,
    };
  }

  async revokeAdminRole(userId: string) {
    // Check if user exists
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role !== Role.ADMIN) {
      throw new ConflictException('User is not an admin');
    }

    // Update user role to USER
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { role: Role.USER },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        bio: true,
        location: true,
        avatarUrl: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      message: 'Admin role revoked successfully',
      user: updatedUser,
    };
  }

  async getAllAdmins() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const admins = await this.prisma.user.findMany({
      where: { role: Role.ADMIN },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        bio: true,
        location: true,
        avatarUrl: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return admins;
  }
}
