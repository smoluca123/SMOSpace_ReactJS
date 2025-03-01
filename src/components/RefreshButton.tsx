import { RefreshCcw } from 'lucide-react';

export default function RefreshButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className='flex items-center p-2 text-sm transition-colors duration-300 border rounded-sm  hover:bg-foreground/5 border-border gap-x-2 text-primary'
    >
      <RefreshCcw />
      Refresh
    </button>
  );
}
