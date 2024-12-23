'use client';

import PasswordInput from '@/components/PasswordInput';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { loginSchema, LoginValues } from '@/lib/validations';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { login, selectAuth } from '@/redux/slices/authSlice';
// import { isRedirectError } from 'next/dist/client/components/redirect';

export default function LoginForm() {
  const { isLoading } = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const form = useForm<LoginValues>({
    defaultValues: {
      username: '',
      password: '',
    },
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
  });

  const handleLogin = async (credentials: LoginValues) => {
    try {
      setError(null);
      const validCredentials = loginSchema.parse(credentials);

      await dispatch(login(validCredentials)).unwrap();

      toast({
        title: 'Welcome back!',
        description: 'You have successfully logged in!',
        duration: 3000,
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError(error.message);
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

      <form className='space-y-4' onSubmit={form.handleSubmit(handleLogin)}>
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
        <Button className='mt-3 w-full' disabled={isLoading}>
          {isLoading && <Loader2 className='ml-2 animate-spin size-5' />}
          Login
        </Button>
      </form>
    </Form>
  );
}
