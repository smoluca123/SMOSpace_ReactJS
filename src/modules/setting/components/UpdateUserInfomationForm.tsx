import PasswordInput from '@/components/PasswordInput';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RegisterValues } from '@/lib/validations';
import { useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';
import { useForm } from 'react-hook-form';

export default function UpdateUserInformationForm() {
  const { user } = useAppSelector(selectAuth);

  const form = useForm<RegisterValues>({
    defaultValues: {
      fullName: user?.fullName,
      age: user?.age || 0,
      email: user?.email,
      phoneNumber: user?.phoneNumber,
      username: user?.username,
      displayName: user?.displayName,
      password: '',
    },
  });

  const onSubmit = (values: RegisterValues) => {
    console.log('Updated Info:', values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
        <div className='grid gap-4 md:grid-cols-2'>
          <FormField
            control={form.control}
            name='fullName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input className='bg-accent' {...field} placeholder='Ex : Yukicute' />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='age'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl>
                  <Input className='bg-accent' type='number' {...field} placeholder='Ex: 25' />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='displayName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Name</FormLabel>
                <FormControl>
                  <Input className='bg-accent' {...field} placeholder='Ex: Nguyen Van A' />
                </FormControl>
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
                  <Input className='bg-accent' type='tel' {...field} placeholder='Ex: 0123456789' />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    className='bg-accent'
                    {...field}
                    placeholder='Enter your password'
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <Button className='text-white'>Update</Button>
      </form>
    </Form>
  );
}
