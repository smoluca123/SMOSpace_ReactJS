'use no memo';

// Import necessary dependencies
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../ui/form';
import { Input } from '../../ui/input';
import { forgetPasswordSchema, ForgetPasswordValues } from '@/lib/validations';
import { useSearchParams } from 'react-router-dom';
import { StepControllerType } from '@/hooks/useStep';
import { useSendResetPasswordCodeToEmailMutation } from '@/components/Auth/ForgetPassword/mutations';
import { toast } from '@/hooks/use-toast';
import LoadingButton from '@/components/LoadingButton';

// ForgetPasswordForm component for handling password recovery
export default function ForgetPasswordForm({
  stepController,
}: {
  stepController: StepControllerType;
}) {
  // Destructure step controller methods
  const { completeStep, nextStep } = stepController;

  const [searchParams, setSearchParams] = useSearchParams();
  const { mutate: sendVerifyCodeToEmailMutate, isPending } =
    useSendResetPasswordCodeToEmailMutation();

  // Initialize form with react-hook-form
  const form = useForm<ForgetPasswordValues>({
    defaultValues: {
      identifier: searchParams.get('email') || '',
    },
    resolver: zodResolver(forgetPasswordSchema),
    mode: 'onSubmit',
  });

  // Handle form submission
  const onSubmit = (values: ForgetPasswordValues) => {
    // Add email to search params
    setSearchParams({ email: values.identifier });
    sendVerifyCodeToEmailMutate(
      { userEmail: values.identifier },
      {
        onSuccess: () => {
          nextStep();
          completeStep();
        },
        onError: (error) => {
          toast({
            title: 'Error',
            description: error.message,
            variant: 'destructive',
            duration: 3000,
          });
        },
      },
    );
  };

  // Render form component
  return (
    <div>
      <Form {...form}>
        <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
          {/* Email input field */}
          <FormField
            control={form.control}
            name='identifier'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} placeholder='Enter your email ' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Submit button */}
          <LoadingButton className='mt-3 w-full' loading={isPending}>
            Recover
          </LoadingButton>
        </form>
      </Form>
    </div>
  );
}
