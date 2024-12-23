'use client';

import PasswordInput from '@/components/PasswordInput';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { registerSchema, RegisterValues } from '@/lib/validations';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { registerAPI } from '@/apis/userApi';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { login, selectAuth } from '@/redux/slices/authSlice';
import LoadingButton from '@/components/LoadingButton';

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { isLoading: loginLoading } = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<RegisterValues>({
    defaultValues: {
      displayName: '',
      fullName: '',
      email: '',
      username: '',
      password: '',
    },
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
  });

  const handleRegister = async (credentials: RegisterValues) => {
    try {
      setIsLoading(true);
      setError(null);
      // const result = await register(credentials);
      const validCredentials = registerSchema.parse(credentials);

      const result = await registerAPI(validCredentials);

      await dispatch(
        login({
          username: validCredentials.username,
          password: validCredentials.password,
        }),
      ).unwrap();

      toast({
        title: 'Congratulations!',
        description: result.message,
        duration: 3000,
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      {/* Alert */}
      {error && (
        <Alert variant='destructive'>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form className='space-y-4' onSubmit={form.handleSubmit(handleRegister)}>
        <div className='grid gap-4 md:grid-cols-2'>
          <FormField
            control={form.control}
            name='fullName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder='Ex: Luca Dev' />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='displayName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder='Ex: Luca N' />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} placeholder='Ex: lucadev1@gmail.com' />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} placeholder='Username' />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput {...field} placeholder='Password' />
              </FormControl>
            </FormItem>
          )}
        />
        <LoadingButton className='mt-3 w-full' loading={isLoading || loginLoading}>
          Register
        </LoadingButton>
      </form>
    </Form>
  );
}
