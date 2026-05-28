import { db } from '@/lib/db';
import { Prisma } from '@prisma/client';
import crypto from 'crypto';

export class UserRepository {
  static async findByEmail(email: string) {
    return db.user.findUnique({ where: { email } });
  }

  static async findById(id: string) {
    return db.user.findUnique({ where: { id } });
  }

  static async create(data: any) {
    return db.user.create({
      data: {
        id: `usr_${crypto.randomUUID()}`,
        updatedAt: new Date(),
        ...data,
      },
    });
  }

  static async findAll(searchQuery = '', roleFilter = 'all', page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    
    const where: any = {};
    
    if (searchQuery) {
      where.OR = [
        { name: { contains: searchQuery } },
        { email: { contains: searchQuery } },
      ];
    }
    
    if (roleFilter !== 'all') {
      const serverRoleMap: Record<string, any> = {
        students: 'STUDENT',
        admins: 'ADMIN',
        demo: 'DEMO',
      };
      if (serverRoleMap[roleFilter]) {
        where.role = serverRoleMap[roleFilter];
      }
    }

    return db.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        avatarUrl: true,
        _count: {
          select: { enrollment: true },
        },
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  static async countAll(searchQuery = '', roleFilter = 'all') {
    const where: any = {};
    
    if (searchQuery) {
      where.OR = [
        { name: { contains: searchQuery } },
        { email: { contains: searchQuery } },
      ];
    }
    
    if (roleFilter !== 'all') {
      const serverRoleMap: Record<string, any> = {
        students: 'STUDENT',
        admins: 'ADMIN',
        demo: 'DEMO',
      };
      if (serverRoleMap[roleFilter]) {
        where.role = serverRoleMap[roleFilter];
      }
    }

    return db.user.count({ where });
  }

  static async updateRole(id: string, role: any) {
    return db.user.update({
      where: { id },
      data: { role },
    });
  }
}
