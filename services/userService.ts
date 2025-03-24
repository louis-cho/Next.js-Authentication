import * as UserRepository from "@/repository/userRepository";
import { hashPassword, comparePassword } from "@/lib/auth/auth";
import { UnauthorizedError } from "@/lib/errors/unauthorizedError";
import { ValidationError } from "@/lib/errors/validationError";
import { ERROR_CODES } from "@/constants/errorCodes";

export const registerUser = async (id: string, password: string) => {
  const existingUser = await UserRepository.findUserById(id);
  if (existingUser) {
    throw new ValidationError(ERROR_CODES.SIGNUP.USER_EXISTS);
  }

  const hashed = await hashPassword(password);
  await UserRepository.createUser(id, hashed, 'user');
};

export const authenticateUser = async (email: string, password: string) => {
  const user = await UserRepository.findUserByEmail(email);
  if (!user) throw new UnauthorizedError(ERROR_CODES.LOGIN.USER_NOT_FOUND);

  const valid = await comparePassword(password, user.password);
  if (!valid) throw new UnauthorizedError(ERROR_CODES.LOGIN.INVALID_CREDENTIALS);

  return user;
};

export const changeUserPassword = async (id: string, newPassword: string) => {
  const hashed = await hashPassword(newPassword);
  await UserRepository.updatePassword(id, hashed);
};