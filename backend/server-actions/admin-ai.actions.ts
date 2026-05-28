'use server';

import { requireAdmin } from '@/lib/guards';
import { db } from '@/lib/db';
import { AuditService } from '@/lib/security/audit.service';
import { handleServerError, StandardResponse } from '@/lib/security/errors';
import { updateAIMentorConfigSchema } from '@/backend/schemas/admin.schema';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';

export async function getAdminAIMentorAction(): Promise<StandardResponse> {
  try {
    await requireAdmin();
    let config = await db.aimentorcontext.findFirst();
    if (!config) {
      config = await db.aimentorcontext.create({
        data: {
          id: 'default-mentor',
          globalPrompt: 'You are an AI Data Analytics Mentor. Guide students using the Socratic method.',
          lessonAware: true,
          codeVerify: true,
          socraticMethod: true,
          updatedAt: new Date(),
        } as any,
      });
    }
    return { success: true, data: config };
  } catch (error) {
    return handleServerError(error);
  }
}

export async function updateAIMentorConfigAction(formData: any): Promise<StandardResponse> {
  try {
    const admin = await requireAdmin();
    const validatedData = updateAIMentorConfigSchema.parse(formData);

    const config = await db.aimentorcontext.findFirst();
    let updatedConfig;

    if (config) {
      updatedConfig = await db.aimentorcontext.update({
        where: { id: config.id },
        data: validatedData,
      });
    } else {
      updatedConfig = await db.aimentorcontext.create({
        data: {
          id: 'default-mentor',
          globalPrompt: validatedData.globalPrompt,
          lessonAware: validatedData.lessonAware ?? true,
          codeVerify: validatedData.codeVerify ?? false,
          socraticMethod: validatedData.socraticMethod ?? true,
          updatedAt: new Date(),
        } as any,
      });
    }

    AuditService.log(
      admin.id!,
      'UPDATE_AI_MENTOR_CONFIG',
      updatedConfig.id,
      `Prompt Length: ${validatedData.globalPrompt.length}`
    );

    revalidatePath('/admin/ai-mentor');
    return { success: true, data: updatedConfig };
  } catch (error) {
    return handleServerError(error);
  }
}
