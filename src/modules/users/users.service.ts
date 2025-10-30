import { Injectable } from '@nestjs/common';

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
