// Import required utilities and components
import { getCurrentTime } from '@/lib/utils';
import ContentWrapper from './ContentWrapper';
import { selectAuth } from '@/redux/slices/authSlice';
import { useAppSelector } from '@/redux/hooks';
import moonIcon from '@/assets/imgs/moon-icon.png';
import sunIcon from '@/assets/imgs/sun-icon.png';

// Component to display a greeting message based on time of day
export default function GreetingAlert() {
  const { period } = getCurrentTime();
  const { user } = useAppSelector(selectAuth);

  // Set icon based on time period
  const timeImage = period == 'AM' ? sunIcon : moonIcon;

  return (
    <ContentWrapper className='flex items-center'>
      <div>
        {/* Display greeting with user's name */}
        <h1 className='font-bold '>
          {period == 'AM' ? 'Good morning' : 'Good evening'} {user?.fullName}
        </h1>
        {/* Display motivational message based on time */}
        <p className='text-sm mt-[2px]'>
          {period == 'AM'
            ? ' Each new day is an opportunity to change your life.'
            : ' Have a wonderful evening and sweet dreams.'}
        </p>
      </div>
      {/* Display sun/moon icon */}
      <img className=' ml-auto object-cover size-[55px]' src={timeImage} alt='moon-icon' />
    </ContentWrapper>
  );
}
