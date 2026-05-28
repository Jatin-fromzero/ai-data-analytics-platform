import { UserRepository } from '@/backend/repositories/user.repository';
import { SignupInput, LoginInput } from '@/backend/schemas/auth.schema';
import bcrypt from 'bcrypt';

export class AuthService {
  static async authenticate(credentials: LoginInput) {
    const user = await UserRepository.findByEmail(credentials.email);
    if (!user) {
      return null;
    }

    const passwordsMatch = await bcrypt.compare(credentials.password, user.passwordHash);
    if (!passwordsMatch) {
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  static async register(data: SignupInput) {
    const existingUser = await UserRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error('User with this email already exists.');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const newUser = await UserRepository.create({
      email: data.email,
      name: data.name,
      passwordHash,
      role: 'STUDENT', // Default role for new signups
    });

    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    };
  }
}
