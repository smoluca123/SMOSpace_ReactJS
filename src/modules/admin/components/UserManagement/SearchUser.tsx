import { SetStateAction } from 'react';
import { Input } from '@/components/ui/input';
import { Filter, Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const SearchUser = ({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
}: {
  searchTerm: string;
  setSearchTerm: React.Dispatch<SetStateAction<string>>;
  filterStatus: string;
  setFilterStatus: React.Dispatch<SetStateAction<string>>;
}) => {
  return (
    <div className='flex flex-col gap-4 mb-6 sm:flex-row'>
      <div className='relative flex-1'>
        <Search className='absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-muted-foreground' />
        <Input
          placeholder='Search users...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='pl-10'
        />
      </div>
      {/* User filter */}
      <Select value={filterStatus} onValueChange={setFilterStatus}>
        <SelectTrigger className='w-[180px]'>
          <Filter className='w-4 h-4 mr-2' />
          <SelectValue placeholder='Filter status' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>All Users</SelectItem>
          <SelectItem value='active'>Active Users</SelectItem>
          <SelectItem value='inactive'>Inactive Users</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SearchUser;
