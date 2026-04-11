import { z } from 'zod';
import { isValidHttpUrl } from './utils';

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
  living: z.optional(z.string({ message: 'City not not Empty' })),
  hometown: z.optional(z.string({ message: 'City not not Empty' })),
  jobs: z.array(
    z.object({
      jobName: requiredString('JobName'),
    }),
  ),
  websites: z.array(
    z.object({
      websiteName: requiredString('WebsiteName').refine(
        (val) => isValidHttpUrl(val),
        'URL is not valid',
      ),
    }),
  ),
});

export const updateUserInfomationSchema = z.object({
  fullName: requiredString('Full name').max(30, { message: 'No one has a name that long' }),
  username: requiredString('Username'),
  phoneNumber: z
    .optional(z.string().regex(/^(\+?[1-9]\d{0,14}|0\d{9})$/, 'Invalid phonenumber'))
    .or(z.literal('')),
  password: z.optional(z.string()),
  birthDate: z.optional(z.date()),
  email: requiredString('Email').email('Invalid email address'),
  age: z.coerce
    .number()
    .int()
    .max(130, { message: 'You age is too old' })
    .min(0, 'Must be at least 10 years old'),
});

export const verifySchema = z.object({
  code: z.string().length(6, 'Verification code must be 6 characters'),
});

export const forgetPasswordSchema = z.object({
  identifier: requiredString('Email').email('Invalid email address'),
});

export const resetPasswordSchema = verifySchema
  .merge(
    z.object({
      password: z.string().min(6, 'Password must be at least 6 characters'),
      confirmPassword: z.string(),
    }),
  )
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const adminUpdateUserInfomatonSchema = updateUserInfomationSchema
  .merge(updateUserDetailsSchema)
  .merge(
    z.object({
      isBanned: z.boolean(),
      isVerified: z.boolean(),
      isActive: z.boolean(),
      typeId: z.string(),
      credits: z.number(),
    }),
  );

export const adminCreateUserSchema = registerSchema.merge(
  z.object({
    isBanned: z.boolean(),
    isVerified: z.boolean(),
    isActive: z.boolean(),
    credits: z.number(),
    bio: z.optional(z.string()),
    typeId: z.string(),
  }),
);

export const generatePostImagesSchema = z.object({
  prompt: requiredString('Prompt').max(1000, 'Prompt must be less than 1000 characters'),
  numImages: z.coerce.number().min(1, 'Image count must be at least 1'),
  imageSize: z.enum(['1024x1024', '1344x768', '1280x960', '960x1280', '768x1344']),
  seed: z.coerce.number().min(-1, 'Seed must be at least -1'),
  steps: z.coerce.number().min(1, 'Steps must be at least 1'),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type CommentValues = z.infer<typeof commentSchema>;
export type UpdateUserDetailsValues = z.infer<typeof updateUserDetailsSchema>;
export type UpdateUserInfomationValues = z.infer<typeof updateUserInfomationSchema>;
export type VerifyValues = z.infer<typeof verifySchema>;
export type ForgetPasswordValues = z.infer<typeof forgetPasswordSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
export type AdminUpdateUserInfomatonValues = z.infer<typeof adminUpdateUserInfomatonSchema>;
export type GeneratePostImagesValues = z.infer<typeof generatePostImagesSchema>;
export type AdminCreateUserType = z.infer<typeof adminCreateUserSchema>;
