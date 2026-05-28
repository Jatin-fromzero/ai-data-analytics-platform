import { NextRequest, NextResponse } from 'next/server';
import { getAdminUsersAction, updateUserRoleAction } from '@/backend/server-actions/admin-users.actions';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const searchQuery = searchParams.get('q') || '';
  const roleFilter = searchParams.get('role') || 'all';
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;

  const result = await getAdminUsersAction(searchQuery, roleFilter, page, limit);
  return NextResponse.json(result, { status: result.success ? 200 : 400 });
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await updateUserRoleAction(body);
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Malformatted JSON input body.' }, { status: 400 });
  }
}
