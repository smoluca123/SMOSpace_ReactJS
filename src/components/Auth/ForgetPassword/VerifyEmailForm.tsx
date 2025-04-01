'use no memo';

// Import necessary components and utilities
import CountdownButton from '@/components/CountdownButton';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { StepControllerType } from '@/hooks/useStep';
import { verifySchema, VerifyValues } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

/**
 * VerifyEmailForm Component
 * Handles email verification step in password reset flow
 */
export default function VerifyEmailForm({
  stepController,
}: {
  stepController: StepControllerType;
}) {
  const { nextStep, completeStep } = stepController;

  // Initialize form with validation
  const form = useForm<VerifyValues>({
    defaultValues: {
      code: '',
    },
    resolver: zodResolver(verifySchema),
    mode: 'onSubmit',
  });

  // Handle form submission
  const onSubmit = (values: VerifyValues) => {
    console.log(values);
    nextStep();
    completeStep();
  };

  return (
    <Form {...form}>
      <form className='space-y-8' onSubmit={form.handleSubmit(onSubmit)}>
        <div className='space-y-2'>
          {/* Instruction text */}
          <p className='text-muted-foreground'>
            We have sent a verification code to your email. Please check and enter the code below.
          </p>

          {/* Verification code input field */}
          <FormField
            control={form.control}
            name='code'
            render={({ field }) => (
              <FormItem className='flex-1'>
                <FormLabel>Verify code</FormLabel>
                <FormControl>
                  <div className='flex items-center gap-x-5'>
                    <Input
                      className='flex-1'
                      placeholder='Enter 6-digit verification code'
                      maxLength={6}
                      {...field}
                    />
                    {/* Resend code button with countdown */}
                    <CountdownButton
                      className='border-primary border-[2px] whitespace-nowrap'
                      variant='outline'
                      countdownTime={60}
                      reCountWhenClicked
                      onClick={() => console.log('Resending code...')}
                    >
                      Send verify code
                    </CountdownButton>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Submit button */}
        <Button type='submit' className='w-full'>
          Reset password
        </Button>
      </form>
    </Form>
  );
}
