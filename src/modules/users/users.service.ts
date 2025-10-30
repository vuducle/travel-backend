import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.module';
import { UpdateProfileDto } from './dto/update-profile.dto';

interface User {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  role: string;
  bio?: string | null;
  location?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async updateProfile(
    userId: string,
    updateProfileDto: UpdateProfileDto,
    avatarUrl?: string,
  ) {
    const updateData: any = { ...updateProfileDto };

    if (avatarUrl) {
      updateData.avatarUrl = avatarUrl;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        bio: true,
        location: true,
        avatarUrl: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async getProfile(userId: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        bio: true,
        location: true,
        avatarUrl: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  private readonly users: User[] = [
    {
      id: '1',
      email: 'julianguyen@test.com',
      name: 'Julian Nguyen',
      avatarUrl: null,
      role: 'ADMIN',
      bio: null,
      location: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      email: 'wendyredvelvet@test.com',
      name: 'Wendy Ameilya',
      avatarUrl: null,
      role: 'USER',
      bio: null,
      location: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  async findAll(): Promise<User[]> {
    return this.users;
  }

  async findById(id: string): Promise<User | undefined> {
    return this.users.find((user) => user.id === id);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find((user) => user.email === email);
  }

  async findByName(name: string): Promise<User | undefined> {
    return this.users.find((user) => user.name === name);
  }
}
