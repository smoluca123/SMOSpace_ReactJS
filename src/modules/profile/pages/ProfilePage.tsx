import Header from '@/components/Header';
import Profile from '@/modules/profile/components/Profile';
import { Navigate, useParams } from 'react-router-dom';

export default function ProfilePage() {
  const { username } = useParams();

  if (!username) {
    return <Navigate to='/' />;
  }

  return (
    <section className='space-y-6 min-h-dvh'>
      <Header />
      <div className='container mx-auto'>
        <Profile username={username} />
      </div>
    </section>
  );
}
