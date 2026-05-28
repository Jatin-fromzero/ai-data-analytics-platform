import { NextRequest, NextResponse } from 'next/server';
import { getAdminSettingsAction, updateSettingsAction } from '@/backend/server-actions/admin-settings.actions';

export async function GET() {
  const result = await getAdminSettingsAction();
  return NextResponse.json(result, { status: result.success ? 200 : 400 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await updateSettingsAction(body);
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Malformatted JSON input body.' }, { status: 400 });
  }
}
