import { z } from 'zod';

export const createCouponSchema = z.object({
  code: z.string().min(3, 'Coupon code must be at least 3 characters').toUpperCase(),
  discountPct: z.number().min(1, 'Discount must be at least 1%').max(100, 'Discount cannot exceed 100%'),
  maxUses: z.number().int().positive().nullable().optional(),
  validUntil: z.string().datetime({ message: "Invalid ISO date string" }).nullable().optional(),
});

export const manualEnrollmentSchema = z.object({
  userId: z.string().cuid('Invalid User ID format'),
  courseId: z.string().cuid('Invalid Course ID format'),
  reason: z.string().min(5, 'Reason must be at least 5 characters').optional(),
});

export const updateAIMentorConfigSchema = z.object({
  globalPrompt: z.string().min(10, 'Prompt must be at least 10 characters'),
  lessonAware: z.boolean(),
  codeVerify: z.boolean(),
  socraticMethod: z.boolean(),
});

export const updateSettingsSchema = z.object({
  platformName: z.string().min(2, 'Platform name must be at least 2 characters'),
  supportEmail: z.string().email('Invalid support email address'),
  maintenanceMode: z.boolean().optional(),
});

export type CreateCouponInput = z.infer<typeof createCouponSchema>;
export type ManualEnrollmentInput = z.infer<typeof manualEnrollmentSchema>;
export type UpdateAIMentorConfigInput = z.infer<typeof updateAIMentorConfigSchema>;
export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
