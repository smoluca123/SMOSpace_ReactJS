import LeftSide from '@/modules/auth/components/LeftSide';
import registerImage from '@/assets/imgs/register.jpg';
import { Link, useSearchParams } from 'react-router-dom';
import AppLogo from '@/components/AppLogo';
import RegisterForm from '@/components/Auth/RegisterForm';

export default function Register() {
  return (
    <div className='flex h-dvh'>
      {/* Left side */}
      <LeftSide image={registerImage} />

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
    <div className='flex justify-center items-center ~p-8/12 my-auto mx-4 sm:m-auto w-full sm:w-3/4 lg:rounded-none rounded-lg lg:w-1/2 bg-card lg:m-0'>
      <div className='max-w-[35rem] w-full space-y-6'>
        <AppLogo wrapperClassName='mx-auto ' className='mb-10 lg:hidden' />
        <div className='space-y-2'>
          <h1 className='font-bold text-[clamp(24px,5vw,44px)]'>Welcome!</h1>
          <p className='text-base text-muted-foreground tracking-[0.57px]'>
            Create your SMO Account!
          </p>
        </div>
        <RegisterForm />

        <div className='text-center'>
          Already have an account?{' '}
          <Link to={`/auth/login${from}`} className='font-semibold hover:underline'>
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
