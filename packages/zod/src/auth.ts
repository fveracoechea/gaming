import { z } from 'zod';

export const SignUpFormSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters long'),
    email: z.email(),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

export type SignUpFormFields = z.infer<typeof SignUpFormSchema>;
