'use no memo';

import LoadingButton from '@/components/LoadingButton';
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
import { adminUpdateUserInfomatonSchema, AdminUpdateUserInfomatonValues } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { formatISO } from 'date-fns';
import { useAdminUpdateUserInfoMutation } from '../../mutations';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserType } from '@/lib/types/types';
import PersonalInfoFields from './PersonalInfoFields';
import ContactInfoFields from './ContactInfoFields';
import SecurityInfoFields from './SecurityInfoFields';
import AdditionalInfoFields from './AdditionalInfoFields';
import UserDetailFields from './UserDetailFields';

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

  const { mutate, isPending } = useAdminUpdateUserInfoMutation({ userId: user.id });

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
      isActive: user.isActive,
      isBanned: user.isBanned,
      isVerified: user.isVerified,
      typeId: user.userType.id,
      credits: +user.credits,
    },
    resolver: zodResolver(adminUpdateUserInfomatonSchema),
    mode: 'onTouched',
  });

  const stringToBoolean = (str: string) => (str == 'true' ? true : false);

  const handleUpdateInfomation = (value: AdminUpdateUserInfomatonValues) => {
    mutate(
      {
        newUserData: {
          ...value,
          additionalInfo: {
            living: value.living,
            hometown: value.hometown,
            website: value.websites.map((wed) => wed.websiteName),
            jobs: value.jobs.map((job) => job.jobName),
            birthDate: value.birthDate ? formatISO(value.birthDate) : null,
          },
        },
      },
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

          <FormField
            control={form.control}
            name='credits'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Credits</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder='credits'
                    type='number'
                    value={field.value}
                    onChange={(e) =>
                      field.onChange(e.target.value === '' ? '' : Number(e.target.value))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <UserDetailFields form={form} />
          <div className=' space-y-4'>
            <FormField
              control={form.control}
              name='isBanned'
              render={() => (
                <FormItem>
                  <FormLabel>Is Banned</FormLabel>
                  <Select
                    onValueChange={(value) => form.setValue('isBanned', stringToBoolean(value))}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select banned state' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='true'>True</SelectItem>
                      <SelectItem value='false'>False</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='isActive'
              render={() => (
                <FormItem>
                  <FormLabel>Is Active</FormLabel>
                  <Select
                    onValueChange={(value) => form.setValue('isActive', stringToBoolean(value))}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select active state' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='true'>True</SelectItem>
                      <SelectItem value='false'>False</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='isVerified'
              render={() => (
                <FormItem>
                  <FormLabel>Is Verified</FormLabel>
                  <Select
                    onValueChange={(value) => form.setValue('isVerified', stringToBoolean(value))}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select verified state' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='true'>True</SelectItem>
                      <SelectItem value='false'>False</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='typeId'
              render={() => (
                <FormItem>
                  <FormLabel>Account Type</FormLabel>
                  <Select
                    defaultValue={form.getValues('typeId')}
                    onValueChange={(value) => form.setValue('typeId', value)}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select Account Type' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={UserType.USER}>User</SelectItem>
                      <SelectItem value={UserType.VIP_USER}>VIP User</SelectItem>
                      <SelectItem value={UserType.MODERATOR}>Moderator</SelectItem>
                      <SelectItem value={UserType.SUPER_ADMIN}>Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Submit button */}
        <LoadingButton loading={isPending} className='text-white w-full'>
          Update
        </LoadingButton>
      </form>
    </Form>
  );
}
