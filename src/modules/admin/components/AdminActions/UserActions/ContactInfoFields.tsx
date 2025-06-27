import { FormField, FormItem, FormControl, FormMessage, FormLabel } from '@/components/ui/form';
import RequiredLabel from '@/components/RequiredLabel';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { AdminUpdateUserInfomatonValues } from '@/lib/validations';

type FormProps = {
  form: UseFormReturn<AdminUpdateUserInfomatonValues>;
};

export default function ContactInfoFields({ form }: FormProps) {
  return (
    <>
      <FormField
        control={form.control}
        name='email'
        render={({ field }) => (
          <FormItem>
            <RequiredLabel>Email</RequiredLabel>
            <FormControl>
              <Input {...field} placeholder='Ex: Yukidev2005@smoteam.com' />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name='phoneNumber'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone Number</FormLabel>
            <FormControl>
              <Input {...field} placeholder='Ex: 0123456789' />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}

export type { FormProps };
