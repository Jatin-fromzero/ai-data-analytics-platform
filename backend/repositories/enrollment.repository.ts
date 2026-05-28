import { db } from '@/lib/db';
import crypto from 'crypto';

export class EnrollmentRepository {
  static async findActiveEnrollment(userId: string, courseId: string) {
    return db.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });
  }

  static async findAdminGrantedAccess(userId: string, courseId: string) {
    return db.courseaccess.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });
  }

  static async findCoupon(code: string) {
    return db.coupon.findUnique({
      where: { code },
    });
  }

  static async enrollWithCoupon(userId: string, courseId: string, couponCode: string) {
    return db.$transaction(async (tx) => {
      const coupon = await tx.coupon.findUnique({
        where: { code: couponCode },
      });

      if (!coupon) throw new Error('Coupon not found');
      if (coupon.validUntil && new Date() > coupon.validUntil) {
        throw new Error('Coupon has expired');
      }
      if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
        throw new Error('Coupon usage limit reached');
      }

      // Increment coupon usage
      await tx.coupon.update({
        where: { id: coupon.id },
        data: { usedCount: { increment: 1 } },
      });

      // Create enrollment
      return tx.enrollment.create({
        data: {
          id: `enr_${crypto.randomUUID()}`,
          userId,
          courseId,
          couponId: coupon.id,
          status: 'ACTIVE',
          updatedAt: new Date(),
        } as any,
      });
    });
  }

  static async enrollManually(userId: string, courseId: string, grantedBy: string, reason?: string) {
    return db.$transaction(async (tx) => {
      // Create manual course access record
      await tx.courseaccess.create({
        data: {
          id: `acc_${crypto.randomUUID()}`,
          userId,
          courseId,
          grantedBy,
          reason,
          createdAt: new Date(),
        } as any,
      });

      // Create main active enrollment
      return tx.enrollment.create({
        data: {
          id: `enr_${crypto.randomUUID()}`,
          userId,
          courseId,
          status: 'ACTIVE',
          updatedAt: new Date(),
        } as any,
      });
    });
  }

  static async findAll(searchQuery = '', page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (searchQuery) {
      where.OR = [
        { user: { name: { contains: searchQuery } } },
        { course: { title: { contains: searchQuery } } },
      ];
    }
    return db.enrollment.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
          },
        },
        coupon: {
          select: {
            code: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  static async countAll(searchQuery = '') {
    const where: any = {};
    if (searchQuery) {
      where.OR = [
        { user: { name: { contains: searchQuery } } },
        { course: { title: { contains: searchQuery } } },
      ];
    }
    return db.enrollment.count({ where });
  }

  static async revoke(userId: string, courseId: string) {
    return db.$transaction(async (tx) => {
      // Delete or update enrollment
      await tx.enrollment.delete({
        where: {
          userId_courseId: { userId, courseId }
        }
      });
      // Delete CourseAccess overrides if any
      await tx.courseaccess.deleteMany({
        where: {
          userId,
          courseId
        }
      });
    });
  }
}
