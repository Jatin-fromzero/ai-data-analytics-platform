import { db } from '@/lib/db';

export class CourseRepository {
  static async findBySlug(slug: string) {
    return db.course.findUnique({
      where: { slug },
      include: {
        phase: {
          orderBy: { order: 'asc' },
          include: {
            part: {
              orderBy: { order: 'asc' },
              include: {
                lesson: {
                  orderBy: { order: 'asc' },
                },
              },
            },
          },
        },
      },
    });
  }

  static async findLessonById(lessonId: string) {
    return db.lesson.findUnique({
      where: { id: lessonId },
      include: {
        part: {
          include: {
            phase: {
              include: {
                course: true,
              },
            },
          },
        },
      },
    });
  }

  static async getLessonProgress(userId: string, lessonId: string) {
    return db.lessonprogress.findUnique({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
    });
  }

  static async upsertLessonProgress(userId: string, lessonId: string, completed: boolean, timeSpent = 0) {
    return db.lessonprogress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
      update: {
        completed,
        timeSpent: {
          increment: timeSpent,
        },
      },
      create: {
        userId,
        lessonId,
        completed,
        timeSpent,
      } as any,
    });
  }

  static async getCompletedLessonsInPart(userId: string, partId: string) {
    return db.lessonprogress.count({
      where: {
        userId,
        completed: true,
        lesson: {
          partId,
        },
      },
    });
  }

  static async getTotalLessonsInPart(partId: string) {
    return db.lesson.count({
      where: { partId },
    });
  }

  static async getCompletedLessonsInPhase(userId: string, phaseId: string) {
    return db.lessonprogress.count({
      where: {
        userId,
        completed: true,
        lesson: {
          part: {
            phaseId,
          },
        },
      },
    });
  }

  static async getTotalLessonsInPhase(phaseId: string) {
    return db.lesson.count({
      where: {
        part: {
          phaseId,
        },
      },
    });
  }

  static async findAll(searchQuery = '', page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    return db.course.findMany({
      where: {
        OR: [
          { title: { contains: searchQuery } },
          { slug: { contains: searchQuery } },
        ],
      },
      include: {
        phase: {
          orderBy: { order: 'asc' },
          include: {
            part: {
              orderBy: { order: 'asc' },
              include: {
                lesson: {
                  orderBy: { order: 'asc' },
                },
              },
            },
          },
        },
        _count: {
          select: { enrollment: true },
        },
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  static async countAll(searchQuery = '') {
    return db.course.count({
      where: {
        OR: [
          { title: { contains: searchQuery } },
          { slug: { contains: searchQuery } },
        ],
      },
    });
  }
}
