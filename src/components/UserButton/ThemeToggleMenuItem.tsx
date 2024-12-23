'use client';

import ModeToggle from '@/components/ModeToggle';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

export default function ThemeToggleMenuItem() {
  return (
    <DropdownMenuItem
      className="flex justify-between items-center"
      onClick={(e) => {
        e.preventDefault();
      }}
    >
      <span>Theme mode</span>
      <ModeToggle />
    </DropdownMenuItem>
  );
}
