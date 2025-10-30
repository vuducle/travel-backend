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
}

@Injectable()
export class UsersService {}
