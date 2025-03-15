import { useFieldArray, useForm } from 'react-hook-form';
import BioEditor from './BioEditor';
import { useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';
import { Form, FormLabel } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function UpdateUserDetailsForm() {
  const { user } = useAppSelector(selectAuth);

  const jobs = user?.additionalInfo?.jobs.map((job) => {
    return {
      jobName: job,
    };
  });

  const form = useForm<{
    bio: string;
    jobs: { jobName: string }[];
  }>({
    defaultValues: {
      bio: user?.bio || '',
      jobs,
    },
  });

  const { append, remove, fields } = useFieldArray({
    control: form.control,
    name: 'jobs',
  });

  const handleUpdateInfomation = (value: { bio: string; jobs: { jobName: string }[] }) => {
    const jobs = value.jobs.map(({ jobName }: { jobName: string }) => jobName);
    const credential = {
      bio: value.bio,
      jobs,
    };

    console.log(credential);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleUpdateInfomation)} className='space-y-6'>
        {/* Bio Section */}
        <div className='space-y-4 '>
          <FormLabel>Bio</FormLabel>
          <BioEditor
            onChangeContent={(content) => form.setValue('bio', content)}
            content={form.watch('bio')}
          />
        </div>

        {/* Jobs Section */}
        <div className='space-y-4'>
          <FormLabel className='block '>Jobs</FormLabel>
          {fields.map((field, index) => (
            <div key={field.id} className='flex gap-2 mb-6'>
              <Input
                {...form.register(`jobs.${index}.jobName`)}
                placeholder='Enter job title'
                className='flex-1 '
              />
              {
                <Button
                  type='button'
                  variant='ghost'
                  className=' text-destructive'
                  onClick={() => remove(index)}
                >
                  X
                </Button>
              }
            </div>
          ))}
          <Button type='button' className='text-white ' onClick={() => append({ jobName: '' })}>
            Add work
          </Button>
        </div>

        {/* Update Button */}
        <Button type='submit' className='w-full mt-3 text-white'>
          Update
        </Button>
      </form>
    </Form>
  );
}
