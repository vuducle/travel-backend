import {
  Controller,
  Get,
  Patch,
  UseGuards,
  Request,
  Body,
  UseInterceptors,
  UploadedFile,
  Query,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { avatarUploadConfig } from '../../common/helpers/multer.helper';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@Request() req: any) {
    return this.usersService.getProfile(req.user.id);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Update user profile with optional avatar upload' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Linh Chi Nguyễn' },
        bio: { type: 'string', example: 'Travel enthusiast' },
        location: { type: 'string', example: 'Nam Định, Việt Nam' },
        avatar: {
          type: 'string',
          format: 'binary',
          description: 'Avatar image (jpg, jpeg, png, max 5MB)',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('avatar', avatarUploadConfig))
  async updateProfile(
    @Request() req: any,
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const avatarUrl = file ? `/uploads/avatars/${file.filename}` : undefined;
    return this.usersService.updateProfile(
      req.user.id,
      updateProfileDto,
      avatarUrl,
    );
  }

  @Get('search')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Search users by username' })
  @ApiQuery({
    name: 'username',
    required: true,
    description: 'Username to search for (case-insensitive partial match)',
    example: 'armin',
  })
  async searchUsers(@Query('username') username: string) {
    if (!username || username.trim().length === 0) {
      throw new BadRequestException('Username query parameter is required');
    }
    return this.usersService.searchByUsername(username);
  }
}
