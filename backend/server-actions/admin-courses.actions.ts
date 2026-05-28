'use server';

import { requireAdmin } from '@/lib/guards';
import { db } from '@/lib/db';
import { CourseRepository } from '@/backend/repositories/course.repository';
import { AuditService } from '@/lib/security/audit.service';
import { handleServerError, StandardResponse } from '@/lib/security/errors';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import crypto from 'crypto';

const createCourseSchema = z.object({
  title: z.string().min(3, 'Course title must be at least 3 characters'),
  slug: z.string().min(3, 'Course slug must be at least 3 characters').regex(/^[a-z0-9-]+$/, 'Slug must be alphanumeric with hyphens'),
});

const createPhaseSchema = z.object({
  courseId: z.string().cuid('Invalid Course ID'),
  title: z.string().min(3, 'Phase title must be at least 3 characters'),
  order: z.number().int().nonnegative(),
});

const createPartSchema = z.object({
  phaseId: z.string().cuid('Invalid Phase ID'),
  title: z.string().min(3, 'Part title must be at least 3 characters'),
  order: z.number().int().nonnegative(),
});

const createLessonSchema = z.object({
  partId: z.string().cuid('Invalid Part ID'),
  title: z.string().min(3, 'Lesson title must be at least 3 characters'),
  type: z.enum(['VIDEO', 'TEXT', 'QUIZ']),
  content: z.string().optional(),
  order: z.number().int().nonnegative(),
});

export async function getAdminCoursesAction(
  searchQuery = '',
  page = 1,
  limit = 10
): Promise<StandardResponse> {
  try {
    await requireAdmin();
    
    const courses = await CourseRepository.findAll(searchQuery, page, limit);
    const totalCount = await CourseRepository.countAll(searchQuery);

    return {
      success: true,
      data: {
        courses: courses.map(course => ({
          id: course.id,
          title: course.title,
          slug: course.slug,
          status: course.status.toLowerCase(),
          enrolled: (course as any)._count?.enrollment || 0,
          phases: ((course as any).phase || []).map((phase: any) => ({
            id: phase.id,
            title: phase.title,
            order: phase.order,
            parts: (phase.part || []).map((part: any) => ({
              id: part.id,
              title: part.title,
              order: part.order,
              lessons: (part.lesson || []).map((lesson: any) => ({
                id: lesson.id,
                title: lesson.title,
                type: lesson.type.toLowerCase(),
                order: lesson.order,
              })),
            })),
          })),
          lastUpdated: course.updatedAt.toLocaleDateString(),
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

export async function createCourseAction(formData: { title: string; slug: string }): Promise<StandardResponse> {
  try {
    const admin = await requireAdmin();
    const validated = createCourseSchema.parse(formData);

    const course = await db.course.create({
      data: {
        id: `crs_${validated.slug}`,
        title: validated.title,
        slug: validated.slug,
        status: 'DRAFT',
        updatedAt: new Date(),
      } as any,
    });

    AuditService.log(admin.id!, 'CREATE_COURSE', course.id, `Title: ${course.title}, Slug: ${course.slug}`);
    
    revalidatePath('/admin/courses');
    return { success: true, data: course };
  } catch (error) {
    return handleServerError(error);
  }
}

export async function createPhaseAction(formData: { courseId: string; title: string; order: number }): Promise<StandardResponse> {
  try {
    const admin = await requireAdmin();
    const validated = createPhaseSchema.parse(formData);

    const phase = await db.phase.create({
      data: {
        id: `ph_${validated.courseId}_${crypto.randomUUID()}`,
        courseId: validated.courseId,
        title: validated.title,
        order: validated.order,
        updatedAt: new Date(),
      } as any,
    });

    AuditService.log(admin.id!, 'CREATE_PHASE', phase.id, `Course: ${validated.courseId}, Title: ${validated.title}`);
    
    revalidatePath('/admin/courses');
    return { success: true, data: phase };
  } catch (error) {
    return handleServerError(error);
  }
}

export async function createPartAction(formData: { phaseId: string; title: string; order: number }): Promise<StandardResponse> {
  try {
    const admin = await requireAdmin();
    const validated = createPartSchema.parse(formData);

    const part = await db.part.create({
      data: {
        id: `pt_${validated.phaseId}_${crypto.randomUUID()}`,
        phaseId: validated.phaseId,
        title: validated.title,
        order: validated.order,
        updatedAt: new Date(),
      } as any,
    });

    AuditService.log(admin.id!, 'CREATE_PART', part.id, `Phase: ${validated.phaseId}, Title: ${validated.title}`);
    
    revalidatePath('/admin/courses');
    return { success: true, data: part };
  } catch (error) {
    return handleServerError(error);
  }
}

export async function createLessonAction(formData: { partId: string; title: string; type: string; content?: string; order: number }): Promise<StandardResponse> {
  try {
    const admin = await requireAdmin();
    const validated = createLessonSchema.parse(formData);

    const lesson = await db.lesson.create({
      data: {
        id: `les_${validated.partId}_${crypto.randomUUID()}`,
        partId: validated.partId,
        title: validated.title,
        type: validated.type as any,
        content: validated.content || '',
        order: validated.order,
        updatedAt: new Date(),
      } as any,
    });

    AuditService.log(admin.id!, 'CREATE_LESSON', lesson.id, `Part: ${validated.partId}, Title: ${validated.title}, Type: ${validated.type}`);
    
    revalidatePath('/admin/courses');
    return { success: true, data: lesson };
  } catch (error) {
    return handleServerError(error);
  }
}
