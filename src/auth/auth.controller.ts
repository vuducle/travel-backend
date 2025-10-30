import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body(new ValidationPipe()) registerDto: RegisterDto,
  ): Promise<any> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body(new ValidationPipe()) loginDto: LoginDto): Promise<any> {
    return this.authService.login(loginDto);
  }
}
