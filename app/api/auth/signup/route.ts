import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/data-store';
import { createSession, sanitizeUser } from '@/lib/auth';
import '@/lib/init';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check if user exists
    if (dataStore.getUserByEmail(email)) {
      return NextResponse.json(
        { success: false, error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Create user
    const user = await dataStore.createUser(email, password, 'user');
    const token = createSession(user.id);

    const response = NextResponse.json({
      success: true,
      user: sanitizeUser(user),
    });

    // Set cookie
    response.cookies.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Sign up error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
