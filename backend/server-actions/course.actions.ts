'use server';

import { requireStudent, requireLessonAccess, getSessionUser } from '@/lib/guards';
import { CourseRepository } from '@/backend/repositories/course.repository';
import { EnrollmentRepository } from '@/backend/repositories/enrollment.repository';
import { CourseAccessService } from '@/backend/services/course-access.service';
import { RateLimiter } from '@/lib/security/rate-limiter';
import { AppError, handleServerError, StandardResponse } from '@/lib/security/errors';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { ProgressionService } from '@/backend/services/progression.service';

export async function getCourseDetailsAction(slug: string): Promise<StandardResponse> {
  try {
    const course = await CourseRepository.findBySlug(slug);
    if (!course) {
      throw new AppError('The requested course outline could not be found.', 404);
    }

    const user = await getSessionUser();
    if (!user || !user.id) {
      return { success: true, data: { course, enrolled: false } };
    }

    const hasAccess = await CourseAccessService.hasCourseAccess(user.id, course.id);
    return { success: true, data: { course, enrolled: hasAccess } };
  } catch (error) {
    return handleServerError(error);
  }
}

export async function getLessonContentAction(lessonId: string): Promise<StandardResponse> {
  try {
    // 1. Enforce strict lesson progression sequence locks server-side
    const user = await requireLessonAccess(lessonId);

    const lesson = await CourseRepository.findLessonById(lessonId);
    if (!lesson) {
      throw new AppError('The requested lesson content does not exist.', 404);
    }

    const progress = await CourseRepository.getLessonProgress(user.id!, lessonId);

    return {
      success: true,
      data: {
        lesson: {
          id: lesson.id,
          title: lesson.title,
          type: lesson.type,
          content: lesson.content,
          videoUrl: lesson.videoUrl,
          order: lesson.order,
        },
        completed: progress?.completed || false,
      },
    };
  } catch (error) {
    return handleServerError(error);
  }
}

export async function completeLessonAction(lessonId: string, timeSpent = 0): Promise<StandardResponse> {
  try {
    // 1. Enforce progression access check before completing
    const user = await requireLessonAccess(lessonId);

    // 2. Perform upsert
    await CourseRepository.upsertLessonProgress(user.id!, lessonId, true, timeSpent);
    
    revalidatePath('/courses');
    return { success: true };
  } catch (error) {
    return handleServerError(error);
  }
}

export async function enrollWithCouponAction(courseId: string, couponCode: string): Promise<StandardResponse> {
  try {
    const user = await requireStudent();

    // 1. Coupon abuse rate limiting (Max 5 attempts per user window of 1 minute)
    const rateCheck = RateLimiter.check(`coupon:${user.id}:${courseId}`, 5, 60000);
    if (!rateCheck.allowed) {
      throw new AppError('Too many coupon attempts. Throttled. Please try again in a minute.', 429);
    }

    const normalizedCode = couponCode.trim().toUpperCase();

    // 2. Enroll with transactional safeguards
    const enrollment = await EnrollmentRepository.enrollWithCoupon(user.id!, courseId, normalizedCode);
    
    revalidatePath('/dashboard');
    revalidatePath('/courses');
    return { success: true, data: enrollment };
  } catch (error) {
    return handleServerError(error);
  }
}

export async function getStudentDashboardDataAction(): Promise<StandardResponse> {
  try {
    const user = await requireStudent();

    // 1. Fetch all published courses
    const allCourses = await db.course.findMany({
      where: {
        status: 'PUBLISHED',
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // 2. Fetch student's active enrollments
    const enrollments = await db.enrollment.findMany({
      where: {
        userId: user.id,
        status: 'ACTIVE',
      },
    });

    const enrolledCourseIds = new Set(enrollments.map(e => e.courseId));

    // 3. Map courses with locks, unlocks and authoritative progress
    const courses = [];
    let activeCourseData = null;

    for (const course of allCourses) {
      const isUnlocked = enrolledCourseIds.has(course.id);
      let progressPercent = 0;
      let completedLessons = 0;
      let totalLessons = 0;
      let resumeUrl = null;
      let resumeLessonTitle = null;

      if (isUnlocked) {
        try {
          const progression = await ProgressionService.getCourseProgression(user.id!, course.id);
          progressPercent = progression.progressPercent;
          completedLessons = progression.completedLessons;
          totalLessons = progression.totalLessons;
          resumeUrl = progression.resumeUrl;
          resumeLessonTitle = progression.resumeLessonTitle;
        } catch (e) {
          console.error("Progression computation failed for course:", course.title, e);
        }
      }

      const courseObj = {
        id: course.id,
        slug: course.slug,
        title: course.title,
        description: course.description,
        isUnlocked,
        progressPercent,
        completedLessons,
        totalLessons,
        resumeUrl,
        resumeLessonTitle,
      };

      courses.push(courseObj);

      // Select first unlocked course as active workspace context
      if (isUnlocked && !activeCourseData) {
        activeCourseData = courseObj;
      }
    }

    // 4. Career milestones checklists
    const careerChecklist = [
      { text: 'Profile & Goals configuration', done: true },
      { text: 'Complete Phase 1 Capstone', done: (activeCourseData?.progressPercent || 0) >= 100 },
      { text: 'Deploy GitHub Portfolio', done: false },
      { text: 'Schedule Mock Interview', done: false },
    ];

    return {
      success: true,
      data: {
        courses,
        activeCourse: activeCourseData ? {
          ...activeCourseData,
          careerChecklist,
        } : null,
      },
    };
  } catch (error) {
    return handleServerError(error);
  }
}
