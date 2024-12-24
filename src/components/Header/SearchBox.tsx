import SearchInput from '@/components/Header/SearchInput';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Search } from 'lucide-react';

export default function SearchBox() {
  return (
    <>
      <SearchInput className='hidden flex-auto sm:block' />

      <Dialog>
        <DialogTrigger asChild>
          <Button variant='outline' className='block p-2 mr-auto rounded-full sm:hidden'>
            <Search />
          </Button>
        </DialogTrigger>
        <DialogContent className=''>
          <DialogHeader>
            <DialogTitle className='text-center'>
              Search for people, pages, groups and #hashtags
            </DialogTitle>
          </DialogHeader>
          <SearchInput />
        </DialogContent>
      </Dialog>
    </>
  );
}
