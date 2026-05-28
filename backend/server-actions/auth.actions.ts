'use server';

import { signIn, signOut } from '@/lib/auth';
import { AuthService } from '@/backend/services/auth.service';
import { signupSchema, loginSchema, SignupInput, LoginInput } from '@/backend/schemas/auth.schema';
import { RateLimiter } from '@/lib/security/rate-limiter';
import { AppError, handleServerError, StandardResponse } from '@/lib/security/errors';
import { AuthError } from 'next-auth';

export async function signUpAction(formData: SignupInput): Promise<StandardResponse> {
  try {
    // 1. Zod Parsing Validation
    const validation = signupSchema.parse(formData);

    // 2. Signup Rate Limiter (Max 3 signups per IP/email window of 1 minute)
    const rateCheck = RateLimiter.check(`signup:${validation.email}`, 3, 60000);
    if (!rateCheck.allowed) {
      throw new AppError('Too many registration requests. Please wait a minute and try again.', 429);
    }

    const user = await AuthService.register(validation);
    return { success: true, data: { email: user.email } };
  } catch (error) {
    return handleServerError(error);
  }
}

export async function loginAction(formData: LoginInput): Promise<StandardResponse> {
  try {
    // 1. Zod Parsing Validation
    const validation = loginSchema.parse(formData);

    // 2. Login Rate Limiter (Max 5 login attempts per email window of 1 minute)
    const rateCheck = RateLimiter.check(`login:${validation.email}`, 5, 60000);
    if (!rateCheck.allowed) {
      throw new AppError('Too many login attempts. Account temporarily throttled. Try again in a minute.', 429);
    }

    await signIn('credentials', {
      email: validation.email,
      password: validation.password,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { success: false, error: 'Invalid email or password.' };
        default:
          return { success: false, error: 'Authentication failed. Please verify your credentials.' };
      }
    }
    return handleServerError(error);
  }
}

export async function logoutAction(): Promise<void> {
  await signOut({ redirectTo: '/login' });
}
