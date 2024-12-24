import AppLogo from '@/components/AppLogo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from '@/components/ui/sheet';
import LeftSidebar from '@/modules/home/components/LeftSidebar';
import { Menu } from 'lucide-react';

export function NavSidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant='outline' className='block lg:hidden'>
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side='left' className=''>
        <SheetHeader className='mb-5 space-y-5'>
          <AppLogo className='mx-auto' />
          {/* <SheetTitle>SMO Space</SheetTitle> */}
        </SheetHeader>
        {/* <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 gap-4 items-center'>
            <Label htmlFor='name' className='text-right'>
              Name
            </Label>
            <Input id='name' value='Pedro Duarte' className='col-span-3' />
          </div>
          <div className='grid grid-cols-4 gap-4 items-center'>
            <Label htmlFor='username' className='text-right'>
              Username
            </Label>
            <Input id='username' value='@peduarte' className='col-span-3' />
          </div>
        </div> */}
        <LeftSidebar className='max-w-full' />
        {/* <SheetFooter>
          <SheetClose asChild>
            <Button type='submit'>Save changes</Button>
          </SheetClose>
        </SheetFooter> */}
      </SheetContent>
    </Sheet>
  );
}
