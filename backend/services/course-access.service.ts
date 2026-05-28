import { EnrollmentRepository } from '@/backend/repositories/enrollment.repository';
import { CourseRepository } from '@/backend/repositories/course.repository';
import { db } from '@/lib/db';

export class CourseAccessService {
  /**
   * Verify if a user has base access to a course (enrolled, coupon used, or admin approved)
   */
  static async hasCourseAccess(userId: string, courseId: string): Promise<boolean> {
    // 1. Check direct active enrollment (covers purchased or coupon)
    const enrollment = await EnrollmentRepository.findActiveEnrollment(userId, courseId);
    if (enrollment && enrollment.status === 'ACTIVE') {
      return true;
    }

    // 2. Check manual admin-granted access
    const adminAccess = await EnrollmentRepository.findAdminGrantedAccess(userId, courseId);
    if (adminAccess) {
      return true;
    }

    return false;
  }

  /**
   * Verify if a user can access a specific lesson based on enrollment and progression locks.
   */
  static async canAccessLesson(userId: string, lessonId: string): Promise<{ allowed: boolean; reason?: string }> {
    const lesson = await CourseRepository.findLessonById(lessonId);
    if (!lesson) {
      return { allowed: false, reason: 'Lesson not found' };
    }

    const courseId = lesson.part.phase.course.id;

    // 1. Must have base course access
    const hasBaseAccess = await this.hasCourseAccess(userId, courseId);
    if (!hasBaseAccess) {
      return { allowed: false, reason: 'You are not enrolled in this course.' };
    }

    const currentPart = lesson.part;
    const currentPhase = currentPart.phase;

    // 2. Check Part Progression Lock (e.g. Part 2 locks until Part 1 is complete)
    if (currentPart.order > 1) {
      // Find previous part in the same phase
      const previousPart = await db.part.findFirst({
        where: {
          phaseId: currentPhase.id,
          order: currentPart.order - 1,
        },
      });

      if (previousPart) {
        const totalLessons = await CourseRepository.getTotalLessonsInPart(previousPart.id);
        const completedLessons = await CourseRepository.getCompletedLessonsInPart(userId, previousPart.id);

        if (completedLessons < totalLessons) {
          return {
            allowed: false,
            reason: `Unlock this lesson by completing the previous part: "${previousPart.title}".`,
          };
        }
      }
    }

    // 3. Check Phase Progression Lock (e.g. Phase 2 Part 1 locks until Phase 1 is complete)
    if (currentPart.order === 1 && currentPhase.order > 1) {
      // Find previous phase in the same course
      const previousPhase = await db.phase.findFirst({
        where: {
          courseId: courseId,
          order: currentPhase.order - 1,
        },
      });

      if (previousPhase) {
        const totalLessons = await CourseRepository.getTotalLessonsInPhase(previousPhase.id);
        const completedLessons = await CourseRepository.getCompletedLessonsInPhase(userId, previousPhase.id);

        if (completedLessons < totalLessons) {
          return {
            allowed: false,
            reason: `Unlock this phase by completing "${previousPhase.title}".`,
          };
        }
      }
    }

    return { allowed: true };
  }
}
