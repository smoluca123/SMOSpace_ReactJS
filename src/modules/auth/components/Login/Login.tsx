import welcomeImage from '@/assets/imgs/welcome.jpg';
import AppLogo from '@/components/AppLogo';
import LoginForm from '@/components/Auth/LoginForm';
import LeftSide from '@/modules/auth/components/LeftSide';
import { Link, useSearchParams } from 'react-router-dom';

export default function SignIn() {
  return (
    <div className='flex h-dvh'>
      {/* Left side */}
      <LeftSide image={welcomeImage} />

      {/* Right side */}
      <RightSide />
    </div>
  );
}

function RightSide() {
  const [searchParams] = useSearchParams();
  const fromParam = encodeURIComponent(searchParams.get('from') || '');
  const from = fromParam ? `?from=${fromParam}` : '';
  return (
    <div className='flex justify-center items-center ~p-4/10 my-auto mx-4 sm:m-auto w-full sm:w-3/4 lg:rounded-none rounded-lg lg:w-1/2 bg-card lg:m-0'>
      <div className='max-w-[35rem] w-full space-y-6 px-5 py-20'>
        <AppLogo wrapperClassName='mx-auto ' className='mb-10 lg:hidden' />
        <div className='space-y-2'>
          <h1 className='font-bold text-[clamp(24px,5vw,44px)]'>Welcome back!</h1>
          <p className='text-base text-muted-foreground tracking-[0.57px]'>Join SMO now!</p>
        </div>
        <LoginForm />

        <div className='text-center'>
          Don&apos;t have an account?{' '}
          <Link to={`/auth/register${from}`} className='font-semibold hover:underline'>
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
