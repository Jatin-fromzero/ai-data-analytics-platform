export class AppError extends Error {
  constructor(message: string, public statusCode = 400) {
    super(message);
    this.name = 'AppError';
  }
}

export interface StandardResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export function handleServerError(error: unknown): StandardResponse {
  console.error('[SERVER ERROR]:', error);

  if (error instanceof AppError) {
    return { success: false, error: error.message };
  }

  if (error instanceof Error) {
    // Sanitize Prisma database errors
    if (error.name.includes('PrismaClient') || error.message.includes('prisma')) {
      return { success: false, error: 'A secure database operation failed. Please try again.' };
    }
    return { success: false, error: error.message };
  }

  return { success: false, error: 'An unexpected backend error occurred.' };
}
