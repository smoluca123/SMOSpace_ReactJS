'use no memo';
import LoadingButton from '@/components/LoadingButton';
import PasswordInput from '@/components/PasswordInput';
import RequestLabel from '@/components/RequestLabel';
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

export default function UpdateUserInformationForm() {
  const { user } = useAppSelector(selectAuth);
  const { mutate, isPending } = useUpdateMyInfomationMutation();
  const { toast } = useToast();

  const form = useForm<UpdateUserInfomationValues>({
    defaultValues: {
      fullName: user?.fullName,
      age: user?.age || 0,
      email: user?.email,
      phoneNumber: user?.phoneNumber,
      username: user?.username,
      displayName: user?.displayName,
      password: '',
    },
    resolver: zodResolver(updateUserInfomationSchema),
    mode: 'onTouched',
  });

  const handleUpdateInfomation = (values: UpdateUserInfomationValues) => {
    mutate(values, {
      onSuccess: () => {
        toast({
          title: 'Suscessfuly',
          description: 'Update User Infomation suscessfuly',
          className: 'w-[300px] md:w-auto',
        });
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleUpdateInfomation)} className='space-y-5'>
        <div className='grid gap-6 md:grid-cols-2 '>
          <FormField
            control={form.control}
            name='fullName'
            render={({ field }) => (
              <FormItem>
                <RequestLabel>Full Name</RequestLabel>
                <FormControl>
                  <Input {...field} placeholder='Ex : Yukicute' />
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
                <RequestLabel>Age</RequestLabel>
                <FormControl>
                  <Input type='number' {...field} placeholder='Ex: 25' />
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
                <RequestLabel>Username</RequestLabel>
                <FormControl>
                  <Input {...field} placeholder='Ex: Yukidev123' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <RequestLabel>Email</RequestLabel>
                <FormControl>
                  <Input {...field} placeholder='Ex: Yukidev2005@smoteam.com' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='displayName'
            render={({ field }) => (
              <FormItem>
                <RequestLabel>Display Name</RequestLabel>
                <FormControl>
                  <Input {...field} placeholder='Ex: Nguyen Van A' />
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
        </div>

        <LoadingButton loading={isPending} className='text-white'>
          Update
        </LoadingButton>
      </form>
    </Form>
  );
}
