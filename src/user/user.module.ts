import { Module } from '@nestjs/common';
import { UsersController } from '../modules/users/users.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [UsersController],
})
export class UserModule {}
