// Import components and assets
import AppLogo from '@/components/AppLogo';
import LeftSide from '../LeftSide';
import welcomeImage from '@/assets/imgs/welcome.jpg';
import ForgetPasswordForm from '@/components/Auth/ForgetPassword/ForgetPasswordForm';
import ResetPasswordForm from '@/components/Auth/ForgetPassword/ResetPasswordForm';

// Import hooks
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import useStep from '@/hooks/useStep';

// Main component for forget password flow
export default function ForgetPassword() {
  return (
    <div className='flex h-dvh'>
      {/* Left side */}
      <LeftSide image={welcomeImage} />

      {/* Right side */}
      <RightSide />
    </div>
  );
}

// Right side component containing the forms
function RightSide() {
  // Initial step
  const { currentStep, stepController, canGoToNextStep, canGoToPreviousStep } = useStep(2);
  const { nextStep, prevStep } = stepController;
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const fromParam = encodeURIComponent(searchParams.get('from') || '');
  const from = fromParam ? `?from=${fromParam}` : '';

  // Step pages
  const forgetPasswordPage = currentStep === 1 && (
    <>
      <ForgetPasswordTitle />
      <ForgetPasswordForm stepController={stepController} />
    </>
  );

  const resetPasswordPage = currentStep === 2 && (
    <>
      <ResetPasswordTitle />
      <ResetPasswordForm stepController={stepController} />
    </>
  );

  return (
    <div className='flex justify-center items-center ~p-4/10 my-auto mx-4 sm:m-auto w-full sm:w-3/4 lg:rounded-none rounded-lg lg:w-1/2 bg-card lg:m-0'>
      <div className='max-w-[35rem] w-full space-y-4 px-5 py-20'>
        {/* Step 1: Enter email */}
        {forgetPasswordPage}

        {/* Step 2: Verify email */}
        {resetPasswordPage}

        <Separator />

        {/* Navigate buton */}
        <div className='flex items-start justify-between'>
          {/* Back button */}
          <Button
            onClick={() => {
              if (!canGoToPreviousStep) {
                navigate('/auth/login');
              }
              prevStep();
            }}
            variant='outline'
          >
            <ArrowLeft />
            Back
          </Button>

          {/* Next button */}
          <Button disabled={!canGoToNextStep} onClick={() => nextStep()} variant='outline'>
            Next
            <ArrowRight />
          </Button>
        </div>

        {/* Register link */}
        <div className='text-center'>
          <p className='text-base  inline text-muted-foreground tracking-[0.57px]'>
            If you don't have an account ?{' '}
          </p>
          <Link to={`/auth/register${from}`} className='inline font-semibold hover:underline'>
            Register now !
          </Link>
        </div>
      </div>
    </div>
  );
}

// Title component for forget password step
function ForgetPasswordTitle() {
  return (
    <>
      <AppLogo wrapperClassName='mx-auto ' className='mb-10 lg:hidden' />
      <div className='space-y-2 '>
        <h1 className='font-bold text-[clamp(24px,5vw,44px)]'>Forget password ?</h1>
      </div>
    </>
  );
}

// Title component for reset password step
function ResetPasswordTitle() {
  return (
    <>
      <AppLogo wrapperClassName='mx-auto ' className='mb-10 lg:hidden' />
      <h1 className='font-bold text-[clamp(24px,5vw,44px)]'>Enter you new password</h1>
      <h1 className='text-muted-foreground'>
        If you don't see any verifycode in you email , click on the{' '}
        <span className='text-foreground'>"Send verify code"</span> bellow to get a OTP via Email
      </h1>
    </>
  );
}
