'use no memo';

import PasswordInput from '@/components/PasswordInput';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { StepControllerType } from '@/hooks/useStep';
import { resetPasswordSchema, ResetPasswordValues } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

export default function ResetPasswordForm({
  stepController,
}: {
  stepController: StepControllerType;
}) {
  const { resetStep } = stepController;

  const navigate = useNavigate();

  const form = useForm<ResetPasswordValues>({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onSubmit',
  });

  const onSubmit = (data: ResetPasswordValues) => {
    console.log(data);
    navigate('/auth/login', { replace: true });
    resetStep();
  };

  return (
    <div>
      <Form {...form}>
        <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            name='password'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <PasswordInput {...field} placeholder='Enter new password' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name='confirmPassword'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <PasswordInput {...field} placeholder='Confirm your password' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className='w-full mt-3'>Reset Password</Button>
        </form>
      </Form>
    </div>
  );
}
