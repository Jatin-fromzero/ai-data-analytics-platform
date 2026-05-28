import { db } from '@/lib/db';
import { CourseRepository } from '@/backend/repositories/course.repository';

export interface CourseProgression {
  totalLessons: number;
  completedLessons: number;
  progressPercent: number;
  activePartTitle: string;
  activePartId: string | null;
  resumeLessonId: string | null;
  resumeLessonTitle: string | null;
  resumeUrl: string | null;
}

export class ProgressionService {
  /**
   * Computes authoritative progress and next resume target for a student in a course.
   * Centralizes progression logic to avoid duplicated calculations across UI views.
   */
  static async getCourseProgression(userId: string, courseId: string): Promise<CourseProgression> {
    // 1. Fetch course tree with ordered phases, parts, and lessons
    // Highly optimized query fetching only required relations, preventing over-fetching
    const course = await db.course.findUnique({
      where: { id: courseId },
      select: {
        slug: true,
        phase: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            title: true,
            part: {
              orderBy: { order: 'asc' },
              select: {
                id: true,
                title: true,
                order: true,
                lesson: {
                  orderBy: { order: 'asc' },
                  select: {
                    id: true,
                    title: true,
                    type: true,
                    order: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!course) {
      return this.emptyProgression();
    }

    // 2. Fetch all completed lessons progress for this student in this course
    const completedProgress = await db.lessonprogress.findMany({
      where: {
        userId,
        completed: true,
        lesson: {
          part: {
            phase: {
              courseId,
            },
          },
        },
      },
      select: {
        lessonId: true,
      },
    });

    const completedLessonIds = new Set(completedProgress.map((p: any) => p.lessonId));

    // 3. Flatten and analyze course sequence
    let totalLessons = 0;
    let completedLessons = 0;
    let resumeLessonId: string | null = null;
    let resumeLessonTitle: string | null = null;
    let activePartTitle = 'Not Started';
    let activePartId: string | null = null;
    let resumeUrl: string | null = null;

    let foundResumeTarget = false;

    for (const phase of course.phase) {
      for (const part of phase.part) {
        let partCompletedCount = 0;
        const partTotalLessons = part.lesson.length;

        for (const lesson of part.lesson) {
          totalLessons++;
          const isCompleted = completedLessonIds.has(lesson.id);
          if (isCompleted) {
            completedLessons++;
            partCompletedCount++;
          } else {
            // Found first incomplete lesson - this is our sequence-locked resume target!
            if (!foundResumeTarget) {
              resumeLessonId = lesson.id;
              resumeLessonTitle = lesson.title;
              activePartTitle = part.title;
              activePartId = part.id;
              // E.g., /courses/data-analytics-mastery/phase-1-part-1 (matching the route pattern)
              resumeUrl = `/courses/${course.slug}/${phase.id}/${part.id}/${lesson.id}`;
              foundResumeTarget = true;
            }
          }
        }

        // If a part has no lessons, it's considered complete
        if (partTotalLessons > 0 && partCompletedCount < partTotalLessons && !activePartId) {
          activePartTitle = part.title;
          activePartId = part.id;
        }
      }
    }

    // If all lessons are completed, target the first lesson
    if (!foundResumeTarget && course.phase.length > 0 && course.phase[0].part.length > 0 && course.phase[0].part[0].lesson.length > 0) {
      const firstLesson = course.phase[0].part[0].lesson[0];
      const firstPart = course.phase[0].part[0];
      const firstPhase = course.phase[0];
      
      resumeLessonId = firstLesson.id;
      resumeLessonTitle = firstLesson.title;
      activePartTitle = firstPart.title;
      activePartId = firstPart.id;
      resumeUrl = `/courses/${course.slug}/${firstPhase.id}/${firstPart.id}/${firstLesson.id}`;
    }

    const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    return {
      totalLessons,
      completedLessons,
      progressPercent,
      activePartTitle: activePartTitle || 'Foundation',
      activePartId,
      resumeLessonId,
      resumeLessonTitle,
      resumeUrl,
    };
  }

  private static emptyProgression(): CourseProgression {
    return {
      totalLessons: 0,
      completedLessons: 0,
      progressPercent: 0,
      activePartTitle: 'Not Enrolled',
      activePartId: null,
      resumeLessonId: null,
      resumeLessonTitle: null,
      resumeUrl: null,
    };
  }
}
