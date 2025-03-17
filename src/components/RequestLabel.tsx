import { PropsWithChildren } from 'react';
import { FormLabel } from './ui/form';

export default function RequestLabel({ children }: PropsWithChildren) {
  return (
    <FormLabel className='inline-flex items-center '>
      <span>{children}</span>
      <span className='ml-1 text-destructive'>*</span>
    </FormLabel>
  );
}
