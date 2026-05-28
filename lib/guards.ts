import { auth } from '@/lib/auth';
import { CourseAccessService } from '@/backend/services/course-access.service';
import { AppError } from '@/lib/security/errors';

export async function getSessionUser() {
  const session = await auth();
  return session?.user;
}

export async function requireAuth() {
  const user = await getSessionUser();
  if (!user || !user.id) {
    throw new AppError('Authentication required. Please login.', 401);
  }
  return user;
}

export async function requireAdmin() {
  const user = await requireAuth();
  const role = (user as any).role;
  if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
    throw new AppError('Access denied. Administrator privileges required.', 403);
  }
  return user;
}

export async function requireStudent() {
  const user = await requireAuth();
  const role = (user as any).role;
  if (!['STUDENT', 'DEMO', 'ADMIN', 'SUPER_ADMIN'].includes(role)) {
    throw new AppError('Access denied. Student permissions required.', 403);
  }
  return user;
}

export async function requireEnrollment(courseId: string) {
  const user = await requireStudent();
  const hasAccess = await CourseAccessService.hasCourseAccess(user.id!, courseId);
  if (!hasAccess) {
    throw new AppError('You do not have an active enrollment in this course.', 403);
  }
  return user;
}

export async function requireLessonAccess(lessonId: string) {
  const user = await requireStudent();
  const access = await CourseAccessService.canAccessLesson(user.id!, lessonId);
  if (!access.allowed) {
    throw new AppError(access.reason || 'Progression locked. Complete previous lesson first.', 403);
  }
  return user;
}
