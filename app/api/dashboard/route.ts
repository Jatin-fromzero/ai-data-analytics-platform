import { NextResponse } from 'next/server';
import { getStudentDashboardDataAction } from '@/backend/server-actions/course.actions';

export async function GET() {
  const result = await getStudentDashboardDataAction();
  return NextResponse.json(result, { status: result.success ? 200 : 400 });
}
