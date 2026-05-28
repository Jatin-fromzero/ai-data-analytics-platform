'use server';

import { requireAdmin } from '@/lib/guards';
import { UserRepository } from '@/backend/repositories/user.repository';
import { AuditService } from '@/lib/security/audit.service';
import { handleServerError, StandardResponse } from '@/lib/security/errors';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const updateRoleSchema = z.object({
  targetUserId: z.string().cuid('Invalid User ID'),
  role: z.enum(['STUDENT', 'ADMIN', 'DEMO', 'SUPER_ADMIN']),
});

export async function getAdminUsersAction(
  searchQuery = '',
  roleFilter = 'all',
  page = 1,
  limit = 10
): Promise<StandardResponse> {
  try {
    await requireAdmin();
    
    const users = await UserRepository.findAll(searchQuery, roleFilter, page, limit);
    const totalCount = await UserRepository.countAll(searchQuery, roleFilter);
    
    return {
      success: true,
      data: {
        users,
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

export async function updateUserRoleAction(formData: { targetUserId: string; role: string }): Promise<StandardResponse> {
  try {
    const admin = await requireAdmin();
    const validated = updateRoleSchema.parse(formData);

    const updatedUser = await UserRepository.updateRole(validated.targetUserId, validated.role);

    AuditService.log(
      admin.id!,
      'UPDATE_USER_ROLE',
      validated.targetUserId,
      `Changed role to: ${validated.role} for user ${updatedUser.email}`
    );

    revalidatePath('/admin/users');
    return { success: true, data: updatedUser };
  } catch (error) {
    return handleServerError(error);
  }
}
