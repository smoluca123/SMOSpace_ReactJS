import { useQuery } from '@tanstack/react-query';
import { getUserTypeList } from '@/apis/userApi';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

interface UserTypeSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

export default function UserTypeSelect({
  value,
  onValueChange,
  placeholder = 'Select Account Type',
}: UserTypeSelectProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['userTypes'],
    queryFn: getUserTypeList,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Debug: log the value and available types
  useEffect(() => {
    if (data?.data) {
      console.log('Current value:', value);
      console.log('Available types:', data.data);
      const matchedType = data.data.find((type) => type.id === value);
      console.log('Matched type:', matchedType);
    }
  }, [value, data]);

  if (isLoading) {
    return (
      <Select disabled>
        <SelectTrigger>
          <div className='flex items-center gap-2'>
            <Loader2 className='w-4 h-4 animate-spin' />
            <span>Loading...</span>
          </div>
        </SelectTrigger>
      </Select>
    );
  }

  if (isError || !data?.data) {
    return (
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder='Error loading user types' />
        </SelectTrigger>
      </Select>
    );
  }

  // Find the current type name to display
  const currentType = data.data.find((type) => type.id === value);
  const displayValue = currentType ? currentType.typeName.replace(/_/g, ' ') : undefined;

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder}>{displayValue || placeholder}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {data.data.map((userType) => (
          <SelectItem key={userType.id} value={userType.id}>
            {userType.typeName.replace(/_/g, ' ')}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
