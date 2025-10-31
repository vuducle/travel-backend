import {
  Controller,
  Post,
  Patch,
  Delete,
  Get,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { AssignAdminDto } from './dto/assign-admin.dto';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth('jwt')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new admin user (Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Admin created successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin privileges required',
  })
  @ApiResponse({
    status: 409,
    description: 'User with this email or username already exists',
  })
  async createAdmin(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.createAdmin(createAdminDto);
  }

  @Patch('assign')
  @ApiOperation({ summary: 'Promote an existing user to admin (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'User promoted to admin successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin privileges required',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 409,
    description: 'User is already an admin',
  })
  async assignAdminRole(@Body() assignAdminDto: AssignAdminDto) {
    return this.adminService.assignAdminRole(assignAdminDto.userId);
  }

  @Delete('revoke/:userId')
  @ApiOperation({ summary: 'Revoke admin role from a user (Admin only)' })
  @ApiParam({
    name: 'userId',
    description: 'The ID of the user to revoke admin role from',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Admin role revoked successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin privileges required',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 409,
    description: 'User is not an admin',
  })
  async revokeAdminRole(@Param('userId') userId: string) {
    return this.adminService.revokeAdminRole(userId);
  }

  @Get('list')
  @ApiOperation({ summary: 'Get all admin users (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'List of all admin users',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin privileges required',
  })
  async getAllAdmins() {
    return this.adminService.getAllAdmins();
  }
}
