import { FormField, FormItem, FormControl, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import BioEditor from '../../Editor/BioEditor';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { AdminUpdateUserInfomatonValues } from '@/lib/validations';
import { cn } from '@/lib/utils';

export type FormProps = {
  form: UseFormReturn<AdminUpdateUserInfomatonValues>;
};

export default function UserDetailFields({ form }: FormProps) {
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
    <div className=' space-y-4'>
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
    </div>
  );
}
