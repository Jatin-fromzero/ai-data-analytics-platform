import { NextRequest, NextResponse } from 'next/server';
import { enrollWithCouponAction } from '@/backend/server-actions/course.actions';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { courseId, couponCode } = body;

    if (!courseId || !couponCode) {
      return NextResponse.json({ success: false, error: 'Parameters courseId and couponCode are required.' }, { status: 400 });
    }

    const result = await enrollWithCouponAction(courseId, couponCode);
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Malformatted JSON input body.' }, { status: 400 });
  }
}
