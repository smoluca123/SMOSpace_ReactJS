import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import RequiredLabel from '@/components/RequiredLabel';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { AdminUpdateUserInfomatonValues } from '@/lib/validations';

type FormProps = {
  form: UseFormReturn<AdminUpdateUserInfomatonValues>;
  useBirthDate?: boolean;
};

export default function PersonalInfoFields({ form, useBirthDate }: FormProps) {
  return (
    <>
      <FormField
        control={form.control}
        name='fullName'
        render={({ field }) => (
          <FormItem>
            <RequiredLabel>Full Name</RequiredLabel>
            <FormControl>
              <Input {...field} placeholder='Ex: Yukicute' />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name='age'
        render={({ field }) => (
          <FormItem>
            <RequiredLabel>Age</RequiredLabel>
            <FormControl>
              <Input disabled={useBirthDate} type='number' {...field} placeholder='Ex: 25' />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name='username'
        render={({ field }) => (
          <FormItem>
            <RequiredLabel>Username</RequiredLabel>
            <FormControl>
              <Input {...field} placeholder='Ex: Yukidev123' />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}

export type { FormProps };
