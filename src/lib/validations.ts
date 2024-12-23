import { z } from 'zod';

const requiredString = z.string().trim().min(1, 'Required');

export const loginSchema = z.object({
  username: requiredString,
  password: requiredString,
});

export const registerSchema = z.object({
  fullName: requiredString,
  displayName: requiredString,
  username: requiredString,
  email: requiredString.email('Invalid email address'),
  password: requiredString,
  phoneNumber: z.optional(z.string().min(10, 'Invalid phone number')),
  age: z.optional(z.number().min(10, 'Must be at least 10 years old')),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
