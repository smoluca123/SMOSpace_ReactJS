import SubmitPostBox from '@/modules/home/components/SubmitPostBox';
import LeftSidebar from '@/modules/profile/components/Profile/ProfileContent/LeftSidebar';
import Posts from '@/modules/profile/components/Profile/ProfileContent/Posts';

export default function ProfileContent() {
  return (
    <div className='flex flex-col gap-4 lg:flex-row'>
      <LeftSidebar />

      {/* Right Side */}
      <div className='flex-1 space-y-4 min-w-0'>
        <SubmitPostBox />
        <Posts />
      </div>
    </div>
  );
}
