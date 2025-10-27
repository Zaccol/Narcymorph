import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    email: string;
    username: string;
    password: string;
  }): Promise<User> {
    return this.prisma.user.create({
      data: {
        ...data,
        profile: {
          create: {
            completionPercentage: 0,
          },
        },
      },
      include: {
        profile: true,
      },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: {
          include: {
            associations: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateUser(userId: string, data: { username?: string; email?: string }) {
    return this.prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  async deleteUser(userId: string) {
    // Soft delete
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        deletedAt: new Date(),
        email: `deleted_${userId}@deleted.com`,
        username: `deleted_${userId}`,
      },
    });
  }
}
