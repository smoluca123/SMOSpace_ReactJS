'use no memo';

import { UseFormReturn } from 'react-hook-form';
import LoadingButton from '@/components/LoadingButton';
import PasswordInput from '@/components/PasswordInput';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useUpdateMyInfomationMutation } from '@/lib/mutations';
import { updateUserInfomationSchema, UpdateUserInfomationValues } from '@/lib/validations';
import { useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import RequiredLabel from '@/components/RequiredLabel';
import { DatetimePicker } from '@/components/DatetimePicker';
import { formatISO } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';
import { SetStateAction, useCallback, useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function UpdateUserInformationForm() {
  const { user } = useAppSelector(selectAuth);
  const { mutate, isPending } = useUpdateMyInfomationMutation();
  const { toast } = useToast();

  const [error, setError] = useState<string | undefined>(undefined);
  const [useBirthDate, setUseBirthDate] = useState(!!user?.additionalInfo?.birthDate);

  const form = useForm<UpdateUserInfomationValues>({
    defaultValues: {
      fullName: user?.fullName || '',
      age: user?.age || 0,
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || undefined,
      username: user?.username || '',
      password: undefined,
      birthDate: user?.additionalInfo?.birthDate
        ? new Date(user.additionalInfo.birthDate)
        : undefined,
    },
    resolver: zodResolver(updateUserInfomationSchema),
    mode: 'onTouched',
  });

  const handleUpdateInfomation = (values: UpdateUserInfomationValues) => {
    const { birthDate, ...newUserData } = values;

    const payload = {
      ...newUserData,
      additionalInfo: {
        birthDate: birthDate ? formatISO(birthDate) : '',
      },
    };

    // console.log(payload);

    mutate(payload, {
      onSuccess: () => {
        toast({
          title: 'Successfully',
          description: 'User information updated successfully',
          className: 'w-[300px] md:w-auto',
        });
      },
      onError: (error) => {
        setError(error.message);
        toast({
          title: 'Error',
          description: error.message,
          className: 'w-[300px] md:w-auto',
          variant: 'destructive',
        });
      },
    });
  };

  return (
    <Form {...form}>
      {/* Error alert */}
      {error && (
        <Alert variant='destructive'>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={form.handleSubmit(handleUpdateInfomation)} className='space-y-5'>
        {/* Form content */}
        <div className='grid gap-6 md:grid-cols-2'>
          {/* Fullname / Age / Username */}
          <PersonalInfoFields form={form} useBirthDate={useBirthDate} />

          {/* Email */}
          <ContactInfoFields form={form} />

          {/* Password */}
          <SecurityInfoFields form={form} />

          {/* Date of birth */}
          <AdditionalInfoFields
            form={form}
            useBirthDate={useBirthDate}
            setUseBirthDate={setUseBirthDate}
          />
        </div>

        {/* Submit button */}
        <LoadingButton loading={isPending} className='text-white'>
          Update
        </LoadingButton>
      </form>
    </Form>
  );
}

type FormProps = {
  form: UseFormReturn<UpdateUserInfomationValues>;
  useBirthDate?: boolean;
  setUseBirthDate?: React.Dispatch<SetStateAction<boolean>>;
};

/* Fullname / Age / Username */
function PersonalInfoFields({ form, useBirthDate }: FormProps) {
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

/* Email */
function ContactInfoFields({ form }: FormProps) {
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

/* Password */
function SecurityInfoFields({ form }: FormProps) {
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

/* Date of birth */
function AdditionalInfoFields({ form, useBirthDate, setUseBirthDate }: FormProps) {
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
    console.log('chay useFx', form.watch('birthDate'));
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
