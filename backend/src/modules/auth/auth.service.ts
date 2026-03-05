import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/common/database/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await (this.prisma as any).user.findUnique({
      where: { email },
      include: { profile: true },
    });

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  async login(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwt.sign(payload as any, {
      expiresIn: this.config.get<string>('JWT_EXPIRES_IN') || '15m',
    } as any);

    const refreshToken = this.jwt.sign(payload as any, {
      secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d',
    } as any);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.profile?.firstName,
        lastName: user.profile?.lastName,
        role: user.role,
      },
    };
  }

  async register(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phone?: string,
    location?: string,
  ) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await (this.prisma as any).user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        profile: {
          create: {
            firstName,
            lastName,
            location,
            // Note: phone field not yet in schema, can be added to Profile in future migration
          },
        },
      },
      include: { profile: true },
    });

    return this.login(user);
  }

  async refreshAccessToken(refreshToken: string) {
    const payload = this.jwt.verify(refreshToken, {
      secret: this.config.get<string>('JWT_REFRESH_SECRET'),
    }) as any;

    const accessToken = this.jwt.sign(
      { sub: payload.sub, email: payload.email, role: payload.role } as any,
      {
        expiresIn: this.config.get<string>('JWT_EXPIRES_IN') || '15m',
      } as any,
    );

    return { accessToken };
  }
}
