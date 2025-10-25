import { NextResponse } from 'next/server';
import { createSessionToken, isAdminCredentialsValid, setSessionCookie } from '@/lib/auth';

export async function POST(request: Request){
  const body = await request.json().catch(()=> null);
  if (!body){
    return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
  }

  const { email, password } = body as { email?: string; password?: string };

  if (!email || !password){
    return NextResponse.json({ message: 'Email and password are required.' }, { status: 400 });
  }

  try {
    if (!isAdminCredentialsValid(email, password)){
      return NextResponse.json({ message: 'Invalid credentials.' }, { status: 401 });
    }
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Admin credentials not configured.' }, { status: 500 });
  }

  const token = await createSessionToken({ email });
  await setSessionCookie(token);

  return NextResponse.json({ success: true });
}
