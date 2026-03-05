import { Controller, Get, Post, UseGuards, Body, HttpCode, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '@/common/guards/local-auth.guard';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { PrismaService } from '@/common/database/prisma.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private prisma: PrismaService,
  ) {}

  @Post('register')
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
  })
  async register(@Body() registerDto: RegisterDto) {
    try {
      const existingUser = await (this.prisma as any).user.findUnique({
        where: { email: registerDto.email },
      });

      if (existingUser) {
        throw new BadRequestException('User already exists');
      }

      const result = await this.authService.register(
        registerDto.email,
        registerDto.password,
        registerDto.firstName,
        registerDto.lastName,
        registerDto.phone,
        registerDto.location,
        registerDto.latitude,
        registerDto.longitude,
      );
      
      return result;
    } catch (error: any) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  @Post('login')
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully',
  })
  async login(@CurrentUser() user: any) {
    return this.authService.login(user);
  }

  @Post('refresh')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Access token refreshed',
  })
  async refreshToken(@Body() { refreshToken }: RefreshTokenDto) {
    return this.authService.refreshAccessToken(refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: 'User logged out successfully',
  })
  logout() {
    // Logic for token blacklisting can be added here (Redis)
    return;
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Current user info',
  })
  getCurrentUser(@CurrentUser() user: any) {
    return user;
  }
}
