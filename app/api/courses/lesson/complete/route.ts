import { NextRequest, NextResponse } from 'next/server';
import { requireStudent } from '@/lib/guards';
import { CourseRepository } from '@/backend/repositories/course.repository';

export async function POST(req: NextRequest) {
  try {
    const user = await requireStudent();
    const body = await req.json();
    const { lessonId, timeSpent } = body;

    if (!lessonId) {
      return NextResponse.json({ success: false, error: 'Parameter lessonId is mandatory.' }, { status: 400 });
    }

    await CourseRepository.upsertLessonProgress(user.id!, lessonId, true, timeSpent || 0);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Verification failure' }, { status: 500 });
  }
}
