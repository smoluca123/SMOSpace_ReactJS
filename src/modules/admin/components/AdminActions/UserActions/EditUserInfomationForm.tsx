'use no memo';

import LoadingButton from '@/components/LoadingButton';
import RequiredLabel from '@/components/RequiredLabel';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { IUserDataWithFollowedStatusType } from '@/lib/types/interfaces';
import { cn } from '@/lib/utils';
import { adminUpdateUserInfomatonSchema, AdminUpdateUserInfomatonValues } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { SetStateAction, useCallback, useEffect, useState } from 'react';
import { useFieldArray, useForm, UseFormReturn } from 'react-hook-form';
import BioEditor from '../../Editor/BioEditor';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import PasswordInput from '@/components/PasswordInput';
import { DatetimePicker } from '@/components/DatetimePicker';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAdminUpdateUserInfomation } from '../../mutations';
import { formatISO } from 'date-fns';

export default function EditUserInfomationForm({
  user,
  onClose,
}: {
  user: IUserDataWithFollowedStatusType;
  onClose: () => void;
}) {
  const [error, setError] = useState<string | undefined>(undefined);
  const [useBirthDate, setUseBirthDate] = useState(!!user?.additionalInfo?.birthDate);
  const { toast } = useToast();

  const jobs = user?.additionalInfo?.jobs?.map((job) => ({ jobName: job })) || [];
  const websites =
    user?.additionalInfo?.websites?.map((website) => ({ websiteName: website })) || [];

  const { mutate, isPending } = useAdminUpdateUserInfomation({ userId: user.id });

  const form = useForm<AdminUpdateUserInfomatonValues>({
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
      bio: user?.bio || '',
      living: user?.additionalInfo?.living || undefined,
      hometown: user?.additionalInfo?.hometown || undefined,
      jobs,
      websites,
    },
    resolver: zodResolver(adminUpdateUserInfomatonSchema),
    mode: 'onTouched',
  });

  const handleUpdateInfomation = (value: AdminUpdateUserInfomatonValues) => {
    const newUserData = {
      fullName: value.fullName,
      age: value.age,
      email: value.email,
      phoneNumber: value.phoneNumber,
      username: value.username,
      password: value.password,
      bio: value.bio,
      additionalInfo: {
        living: value.living,
        hometown: value.hometown,
        websites: value.websites.map((wed) => wed.websiteName),
        jobs: value.jobs.map((job) => job.jobName),
        birthDate: value.birthDate ? formatISO(value.birthDate) : null,
      },
    };

    mutate(
      { newUserData },
      {
        onSuccess: () => {
          toast({
            title: 'Successfully',
            description: 'User information updated successfully',
            className: 'w-[300px] md:w-auto',
          });
          onClose();
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
      },
    );
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

        <UserDetail form={form} />

        {/* Submit button */}
        <LoadingButton loading={isPending} className='text-white'>
          Update
        </LoadingButton>
      </form>
    </Form>
  );
}

type FormProps = {
  form: UseFormReturn<AdminUpdateUserInfomatonValues>;
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

// User Detall
function UserDetail({ form }: FormProps) {
  // Initialize dynamic form arrays for jobs and websites
  const jobFieldArray = useFieldArray({
    control: form.control,
    name: 'jobs',
  });

  const websiteFieldArray = useFieldArray({
    control: form.control,
    name: 'websites',
  });

  return (
    <div>
      {/* Bio Section */}
      <FormField
        control={form.control}
        name='bio'
        render={({ field }) => (
          <FormItem>
            <FormLabel className='flex items-center justify-between w-full gap-x-5'>
              <span>Bio</span>
              <span
                className={cn('font-semibold text-muted-foreground', {
                  'text-destructive': form.getValues('bio').length > 201,
                })}
              >
                {form.getValues('bio').length}/201
              </span>
            </FormLabel>
            <FormControl>
              <div>
                <BioEditor
                  onChangeContent={(content) => field.onChange(content)}
                  content={field.value}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {/* City Section */}
      <FormField
        name='living'
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>City</FormLabel>
            <FormControl>
              <Input {...field} placeholder='where are you live ?' />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {/* Country Section */}
      <FormField
        name='hometown'
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Country</FormLabel>
            <FormControl>
              <Input {...field} placeholder='Where are you from ?' />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {/* Jobs Section */}
      <div className='space-y-4'>
        <FormLabel className='block'>Jobs</FormLabel>
        {jobFieldArray.fields.map((field, index) => (
          <FormField
            key={field.id}
            control={form.control}
            name={`jobs.${index}.jobName`}
            render={({ field }) => (
              <FormItem className='mb-6'>
                <div className='flex gap-2'>
                  <Input {...field} placeholder='Enter job title' className='flex-1' />
                  <Button
                    type='button'
                    variant='ghost'
                    className='text-destructive'
                    onClick={() => jobFieldArray.remove(index)}
                  >
                    <X className='size-4' />
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        {/* Add job button */}
        <Button
          disabled={
            jobFieldArray.fields.length >= 5 ||
            jobFieldArray.fields.some((_, index) => !form.watch(`jobs.${index}.jobName`))
          }
          variant='ghost'
          type='button'
          className='w-full text-white bg-secondary'
          onClick={() => jobFieldArray.append({ jobName: '' })}
        >
          <Plus className='size-6' />
        </Button>
      </div>
      {/* Websites Section */}
      <div className='space-y-4'>
        <FormLabel className='block'>Websites</FormLabel>
        {websiteFieldArray.fields.map((field, index) => (
          <FormField
            key={field.id}
            control={form.control}
            name={`websites.${index}.websiteName`}
            render={({ field }) => (
              <FormItem className='mb-6'>
                <div className='flex gap-2'>
                  <Input {...field} placeholder='Enter website name' className='flex-1' />
                  <Button
                    type='button'
                    variant='ghost'
                    className='text-destructive'
                    onClick={() => websiteFieldArray.remove(index)}
                  >
                    <X className='size-4' />
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </div>
    </div>
  );
}
