import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'armindorri@test.de' })
  email!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'password123' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Armin Dorri' })
  name!: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Travel enthusiast and photographer',
    required: false,
  })
  bio?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Jakarta Java, Indonesia', required: false })
  location?: string;
}
