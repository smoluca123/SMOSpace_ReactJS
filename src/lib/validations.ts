import { z } from 'zod';

const requiredString = (field: string) => z.string().trim().min(1, `${field} is required`);

export const loginSchema = z.object({
  username: requiredString('Username'),
  password: requiredString('Password'),
});

export const registerSchema = z.object({
  fullName: requiredString('Full name'),
  displayName: requiredString('Display name'),
  username: requiredString('Username'),
  email: requiredString('Email').email('Invalid email address'),
  password: requiredString('Password'),
  phoneNumber: z.optional(z.string().min(10, 'Invalid phone number')),
  age: z.optional(z.number().min(10, 'Must be at least 10 years old')),
});

export const commentSchema = z.object({
  content: requiredString('Content'),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type CommentValues = z.infer<typeof commentSchema>;
