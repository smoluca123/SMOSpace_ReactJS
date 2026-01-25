import { UUID } from 'crypto';
import { Star } from 'lucide-react';
import DropdownMenuItemWithIcon from '@/components/DropdownMenuItemWithIcon';

interface IProps {
  userId: UUID;
}

export default function FavoriteMenuItem({ userId }: IProps) {
  const handleFavorite = () => {
    // TODO: Call API to add user to favorites
    console.log('Add to favorites:', userId);
  };

  return (
    <DropdownMenuItemWithIcon
      Icon={Star}
      onClick={handleFavorite}
      onSelect={(e) => e.preventDefault()}
    >
      Yêu thích
    </DropdownMenuItemWithIcon>
  );
}
