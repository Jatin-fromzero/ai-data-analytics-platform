import { NextResponse } from 'next/server';
import { getAdminDashboardDataAction } from '@/backend/server-actions/admin-settings.actions';

export async function GET() {
  const result = await getAdminDashboardDataAction();
  return NextResponse.json(result, { status: result.success ? 200 : 400 });
}
