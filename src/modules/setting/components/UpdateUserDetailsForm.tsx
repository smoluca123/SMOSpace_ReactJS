'use no memo';
import { useFieldArray, useForm } from 'react-hook-form';
import BioEditor from './BioEditor';
import { useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUpdateMyInfomationMutation } from '@/lib/mutations';
import { useToast } from '@/hooks/use-toast';
import { updateUserDetailsSchema, UpdateUserDetailsValues } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, X } from 'lucide-react';
import LoadingButton from '@/components/LoadingButton';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useState } from 'react';

export default function UpdateUserDetailsForm() {
  const { user } = useAppSelector(selectAuth);
  const { toast } = useToast();
  const [error, setError] = useState<string | undefined>(undefined);

  // Convert additionalInfo data to match form defaultValues structure
  // jobs: string[] -> {jobName: string}[]
  // websites: string[] -> {websiteName: string}[]
  const jobs = user?.additionalInfo?.jobs?.map((job) => ({ jobName: job })) || [];
  const websites =
    user?.additionalInfo?.websites?.map((website) => ({ websiteName: website })) || [];

  const { mutate, isPending } = useUpdateMyInfomationMutation();

  const form = useForm<UpdateUserDetailsValues>({
    defaultValues: {
      bio: user?.bio || '',
      living: user?.additionalInfo?.living || undefined,
      hometown: user?.additionalInfo?.hometown || undefined,
      jobs,
      websites,
    },
    resolver: zodResolver(updateUserDetailsSchema),
    mode: 'onTouched',
  });

  // Initialize dynamic form arrays for jobs and websites
  const jobFieldArray = useFieldArray({
    control: form.control,
    name: 'jobs',
  });

  const websiteFieldArray = useFieldArray({
    control: form.control,
    name: 'websites',
  });

  // Update user additional infomation
  const handleUpdateInfomation = (value: UpdateUserDetailsValues) => {
    const jobs = value.jobs.map(({ jobName }: { jobName: string }) => jobName);
    const websites = value.websites.map(({ websiteName }: { websiteName: string }) => websiteName);
    const userData = {
      bio: value.bio,
      additionalInfo: {
        jobs,
        websites,
        living: value.living,
        hometown: value.hometown,
      },
    };

    mutate(userData, {
      onSuccess: () => {
        toast({
          title: 'Successfully',
          description: 'User information updated successfully',
          className: 'w-[300px] md:w-auto',
        });
      },
      onError: (error) => {
        setError(error.message);
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

      <form
        onSubmit={form.handleSubmit(handleUpdateInfomation, (error) => console.log(error))}
        className='max-w-[72.801rem]  space-y-6 '
      >
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

          {/* Add website button */}
          <Button
            disabled={
              websiteFieldArray.fields.length >= 5 ||
              websiteFieldArray.fields.some(
                (_, index) => !form.watch(`websites.${index}.websiteName`),
              )
            }
            variant='ghost'
            type='button'
            className='w-full text-white bg-secondary'
            onClick={() => websiteFieldArray.append({ websiteName: '' })}
          >
            <Plus className='size-6' />
          </Button>
        </div>

        {/* Update Button */}
        <LoadingButton loading={isPending} type='submit' className='w-full mt-3 text-white'>
          Update
        </LoadingButton>
      </form>
    </Form>
  );
}
