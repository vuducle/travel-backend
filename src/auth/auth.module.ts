import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.register({
      global: false,
      secret: process.env.JWT_SECRET ?? 'change_this_secret',
      // signOptions accepts number | string; keep as string for durations like '1h'
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN ?? ('1h' as any) },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
