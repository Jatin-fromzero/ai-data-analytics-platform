import { NextRequest, NextResponse } from 'next/server';
import { 
  getAdminEnrollmentsAction, 
  manualEnrollmentAction, 
  createCouponAction,
  revokeEnrollmentAction 
} from '@/backend/server-actions/admin-enrollments.actions';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const searchQuery = searchParams.get('q') || '';
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;

  const result = await getAdminEnrollmentsAction(searchQuery, page, limit);
  return NextResponse.json(result, { status: result.success ? 200 : 400 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, ...payload } = body;

    let result;
    if (action === 'manual') {
      result = await manualEnrollmentAction(payload);
    } else if (action === 'coupon') {
      result = await createCouponAction(payload);
    } else {
      return NextResponse.json({ success: false, error: 'Invalid enrollment action requested.' }, { status: 400 });
    }

    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Malformatted JSON input body.' }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const courseId = searchParams.get('courseId');

    if (!userId || !courseId) {
      return NextResponse.json({ success: false, error: 'Parameters userId and courseId are mandatory.' }, { status: 400 });
    }

    const result = await revokeEnrollmentAction({ userId, courseId });
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'An unexpected connection error occurred.' }, { status: 500 });
  }
}
