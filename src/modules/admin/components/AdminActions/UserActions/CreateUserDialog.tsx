'use no memo';

import LoadingButton from '@/components/LoadingButton';
import PasswordInput from '@/components/PasswordInput';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { adminCreateUserSchema, AdminCreateUserType } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAdminCreateuserMutation } from '../../mutations';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import BioEditor from '../../Editor/BioEditor';
import { cn } from '@/lib/utils';
import UserTypeSelect from '@/components/UserTypeSelect';

export default function CreateUserDialog({
  onClose,
  open,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { mutate, isPending } = useAdminCreateuserMutation();

  const form = useForm<AdminCreateUserType>({
    defaultValues: {
      displayName: '',
      fullName: '',
      email: '',
      username: '',
      password: '',
      isActive: false,
      isBanned: false,
      isVerified: false,
      credits: 0,
      typeId: '',
      bio: '',
    },
    resolver: zodResolver(adminCreateUserSchema),
    mode: 'onTouched',
  });

  const handleCloseDialog = (isOpen: boolean) => {
    if (!isOpen) {
      onClose();
      form.reset();
      setError(null);
    }
  };

  const stringToBoolean = (str: string) => (str == 'true' ? true : false);

  const handleCreateUser = (values: AdminCreateUserType) => {
    setError(null);
    mutate(values, {
      onSuccess: () => {
        toast({
          title: 'User created successfully!',
          description: `User ${values.username} has been created.`,
          duration: 3000,
        });
        handleCloseDialog(false);
      },
      onError: (error) => {
        setError(error.message);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleCloseDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>Add a new user to the platform</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          {/* Alert */}
          {error && (
            <Alert variant='destructive'>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form className='space-y-4' onSubmit={form.handleSubmit(handleCreateUser)}>
            <div className='grid gap-4 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='fullName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='Ex: Luca Dev' />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='displayName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='Ex: Luca N' />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Ex: lucadev1@gmail.com' />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Username' />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='bio'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='flex items-center justify-between w-full gap-x-5'>
                    <span>Bio</span>
                    <span
                      className={cn('font-semibold text-muted-foreground', {
                        'text-destructive': (form.getValues('bio')?.length ?? 0) > 201,
                      })}
                    >
                      {form.getValues('bio')?.length ?? 0}/201
                    </span>
                  </FormLabel>
                  <FormControl>
                    <div>
                      <BioEditor
                        onChangeContent={(content) => field.onChange(content)}
                        content={form.watch('bio') || ''}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
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
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput {...field} placeholder='Password' />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className='grid gap-4 md:grid-cols-2'>
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
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Type</FormLabel>
                    <FormControl>
                      <UserTypeSelect
                        value={field.value}
                        onValueChange={(value) => field.onChange(value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <LoadingButton className='w-full' loading={isPending} type='submit'>
              Create User
            </LoadingButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
