import { NextRequest, NextResponse } from 'next/server';
import { signUpAction } from '@/backend/server-actions/auth.actions';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await signUpAction(body);
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Malformatted JSON input body.' }, { status: 400 });
  }
}
