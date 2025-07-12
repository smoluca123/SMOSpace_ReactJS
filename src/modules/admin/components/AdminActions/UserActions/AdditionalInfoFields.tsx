import { useCallback, useEffect } from 'react';
import { FormField, FormItem, FormControl, FormLabel } from '@/components/ui/form';
import { DatetimePicker } from '@/components/DatetimePicker';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { UseFormReturn } from 'react-hook-form';
import { AdminUpdateUserInfomatonValues } from '@/lib/validations';

type FormProps = {
  form: UseFormReturn<AdminUpdateUserInfomatonValues>;
  useBirthDate?: boolean;
  setUseBirthDate?: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function AdditionalInfoFields({ form, useBirthDate, setUseBirthDate }: FormProps) {
  // Calcula user age
  const calculatorAge = useCallback(
    (value?: Date) => {
      if (!value) return;

      const currentYear = new Date().getFullYear();
      const yearValue = value.getFullYear();
      const userAge = currentYear - yearValue;

      form.setValue('age', userAge);
      form.setValue('birthDate', value);
    },
    [form],
  );

  useEffect(() => {
    calculatorAge(form.watch('birthDate'));
  }, [useBirthDate, calculatorAge, form]);

  return (
    <FormField
      control={form.control}
      name='birthDate'
      render={({ field }) => (
        <FormItem>
          <FormLabel>Date of birth</FormLabel>
          <FormControl>
            <div className='space-y-2 '>
              <DatetimePicker
                {...field}
                disabled={!useBirthDate}
                format={[['months', 'days', 'years'], []]}
                onChange={calculatorAge}
              />

              {/* Checkbox */}
              <div className='flex items-center gap-x-2'>
                <Checkbox
                  onCheckedChange={(checked) => setUseBirthDate?.(!!checked)}
                  checked={useBirthDate}
                  id='terms'
                />
                <Label htmlFor='terms' className='text-sm text-muted-foreground'>
                  Use birthdate to automatically calculate your age
                </Label>
              </div>
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
}

export type { FormProps };
