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

export const updateUserDetailsSchema = z.object({
  bio: z.string().max(201, 'You can not write more than 201 char'),
  // living: z.nullable(z.string({ message: 'City not not Empty' })),
  // hometown: z.nullable(z.string({ message: 'City not not Empty' })),
  jobs: z.array(
    z.object({
      jobName: requiredString('JobName'),
    }),
  ),
  websites: z.array(
    z.object({
      websiteName: requiredString('WebsiteName'),
    }),
  ),
});

export const updateUserInfomationSchema = registerSchema.extend({
  fullName: requiredString('Full name').max(30, { message: 'No one has a name that long' }),
  phoneNumber: z.optional(z.string().min(10, 'Invalid phone number')).or(z.literal('')),
  password: z.optional(z.string()),
  age: z.coerce
    .number()
    .int()
    .max(130, { message: 'You age is too old' })
    .min(10, 'Must be at least 10 years old'),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type CommentValues = z.infer<typeof commentSchema>;
export type UpdateUserDetailsValues = z.infer<typeof updateUserDetailsSchema>;
export type UpdateUserInfomationValues = z.infer<typeof updateUserInfomationSchema>;
