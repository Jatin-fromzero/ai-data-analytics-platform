import { NextRequest, NextResponse } from 'next/server';
import { requireStudent } from '@/lib/guards';
import { CourseRepository } from '@/backend/repositories/course.repository';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const user = await requireStudent();
    const { searchParams } = new URL(req.url);
    const courseSlug = searchParams.get('courseSlug');
    const partSlug = searchParams.get('partSlug');

    if (!courseSlug || !partSlug) {
      return NextResponse.json({ success: false, error: 'Parameters courseSlug and partSlug are mandatory.' }, { status: 400 });
    }

    const partOrder = parseInt(partSlug.replace('part-', '')) || 1;

    // Find the part and its lessons in the database
    const part = await db.part.findFirst({
      where: {
        order: partOrder,
        phase: {
          course: { slug: courseSlug }
        }
      },
      include: {
        lesson: {
          orderBy: { order: 'asc' }
        },
        phase: {
          include: {
            course: true
          }
        }
      }
    });

    if (!part) {
      return NextResponse.json({ success: false, error: 'The requested module was not found.' }, { status: 404 });
    }

    // Map lessons with progress status
    const lessonsWithProgress = [];
    for (const lesson of part.lesson) {
      const progress = await CourseRepository.getLessonProgress(user.id!, lesson.id);
      lessonsWithProgress.push({
        id: lesson.id,
        title: lesson.title,
        type: lesson.type,
        content: lesson.content,
        videoUrl: lesson.videoUrl,
        order: lesson.order,
        completed: progress?.completed || false,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        partTitle: part.title,
        phaseTitle: part.phase.title,
        courseTitle: part.phase.course.title,
        lessons: lessonsWithProgress
      }
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Verification failure' }, { status: 500 });
  }
}
