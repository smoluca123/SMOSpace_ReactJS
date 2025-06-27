import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { FormLabel } from '@/components/ui/form';
import PasswordInput from '@/components/PasswordInput';
import { UseFormReturn } from 'react-hook-form';
import { AdminUpdateUserInfomatonValues } from '@/lib/validations';

type FormProps = {
  form: UseFormReturn<AdminUpdateUserInfomatonValues>;
};

export default function SecurityInfoFields({ form }: FormProps) {
  return (
    <FormField
      control={form.control}
      name='password'
      render={({ field }) => (
        <FormItem>
          <FormLabel>Password</FormLabel>
          <FormControl>
            <PasswordInput {...field} placeholder='Enter your password' />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export type { FormProps };
