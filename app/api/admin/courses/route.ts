import { NextRequest, NextResponse } from 'next/server';
import { 
  getAdminCoursesAction, 
  createCourseAction, 
  createPhaseAction, 
  createPartAction, 
  createLessonAction 
} from '@/backend/server-actions/admin-courses.actions';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const searchQuery = searchParams.get('q') || '';
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;

  const result = await getAdminCoursesAction(searchQuery, page, limit);
  return NextResponse.json(result, { status: result.success ? 200 : 400 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, ...payload } = body;

    let result;
    switch (action) {
      case 'course':
        result = await createCourseAction(payload);
        break;
      case 'phase':
        result = await createPhaseAction(payload);
        break;
      case 'part':
        result = await createPartAction(payload);
        break;
      case 'lesson':
        result = await createLessonAction(payload);
        break;
      default:
        return NextResponse.json({ success: false, error: 'Invalid course action requested.' }, { status: 400 });
    }

    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Malformatted JSON input body.' }, { status: 400 });
  }
}
