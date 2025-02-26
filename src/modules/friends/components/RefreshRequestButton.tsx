import { RefreshCcw } from 'lucide-react';

export default function RefreshRequestButton() {
  return (
    <button className=' hover:bg-background/5 transition-colors duration-300 border-border border-[1px] p-2 rounded-sm flex items-center gap-x-2 text-sm text-primary'>
      <RefreshCcw />
      Refresh
    </button>
  );
}
