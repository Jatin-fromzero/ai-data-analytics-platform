'use server';

import { requireAdmin } from '@/lib/guards';
import { db } from '@/lib/db';
import { EnrollmentRepository } from '@/backend/repositories/enrollment.repository';
import { AuditService } from '@/lib/security/audit.service';
import { handleServerError, StandardResponse } from '@/lib/security/errors';
import { 
  createCouponSchema, 
  manualEnrollmentSchema, 
} from '@/backend/schemas/admin.schema';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import crypto from 'crypto';

const revokeEnrollmentSchema = z.object({
  userId: z.string().cuid('Invalid User ID'),
  courseId: z.string().cuid('Invalid Course ID'),
});

export async function getAdminEnrollmentsAction(
  searchQuery = '',
  page = 1,
  limit = 10
): Promise<StandardResponse> {
  try {
    await requireAdmin();
    
    const enrollments = await EnrollmentRepository.findAll(searchQuery, page, limit);
    const totalCount = await EnrollmentRepository.countAll(searchQuery);

    return {
      success: true,
      data: {
        enrollments: enrollments.map(e => ({
          id: e.id,
          studentName: e.user.name,
          studentEmail: e.user.email,
          userId: e.user.id,
          courseId: e.course.id,
          course: e.course.title,
          status: e.status.toLowerCase(),
          accessType: e.coupon ? 'coupon' : 'paid',
          couponCode: e.coupon?.code || null,
          date: e.createdAt.toISOString().split('T')[0],
        })),
        pagination: {
          totalCount,
          totalPages: Math.ceil(totalCount / limit),
          currentPage: page,
          limit,
        },
      },
    };
  } catch (error) {
    return handleServerError(error);
  }
}

export async function createCouponAction(formData: any): Promise<StandardResponse> {
  try {
    const admin = await requireAdmin();
    const validatedData = createCouponSchema.parse(formData);

    const coupon = await db.coupon.create({
      data: {
        id: `cpn_${validatedData.code.toLowerCase()}`,
        code: validatedData.code,
        discountPct: validatedData.discountPct,
        maxUses: validatedData.maxUses,
        validUntil: validatedData.validUntil ? new Date(validatedData.validUntil) : null,
      } as any,
    });

    AuditService.log(
      admin.id!, 
      'CREATE_COUPON', 
      coupon.id, 
      `Code: ${coupon.code}, Discount: ${coupon.discountPct}%`
    );

    revalidatePath('/admin/enrollments');
    return { success: true, data: coupon };
  } catch (error) {
    return handleServerError(error);
  }
}

export async function manualEnrollmentAction(formData: any): Promise<StandardResponse> {
  try {
    const admin = await requireAdmin();
    const validatedData = manualEnrollmentSchema.parse(formData);

    const enrollment = await EnrollmentRepository.enrollManually(
      validatedData.userId,
      validatedData.courseId,
      admin.id!,
      validatedData.reason
    );

    AuditService.log(
      admin.id!,
      'MANUAL_ENROLLMENT',
      enrollment.id,
      `User: ${validatedData.userId}, Course: ${validatedData.courseId}, Reason: ${validatedData.reason || 'None'}`
    );

    revalidatePath('/admin/enrollments');
    revalidatePath('/admin/users');
    revalidatePath('/dashboard');
    return { success: true, data: enrollment };
  } catch (error) {
    return handleServerError(error);
  }
}

export async function revokeEnrollmentAction(formData: { userId: string; courseId: string }): Promise<StandardResponse> {
  try {
    const admin = await requireAdmin();
    const validated = revokeEnrollmentSchema.parse(formData);

    await EnrollmentRepository.revoke(validated.userId, validated.courseId);

    AuditService.log(
      admin.id!,
      'REVOKE_ENROLLMENT',
      `${validated.userId}_${validated.courseId}`,
      `Revoked access for user ${validated.userId} to course ${validated.courseId}`
    );

    revalidatePath('/admin/enrollments');
    revalidatePath('/admin/users');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    return handleServerError(error);
  }
}
export async function getCoursesListAction(): Promise<StandardResponse> {
  try {
    await requireAdmin();
    const courses = await db.course.findMany({
      where: { status: 'PUBLISHED' },
      select: { id: true, title: true }
    });
    return { success: true, data: courses };
  } catch (error) {
    return handleServerError(error);
  }
}
