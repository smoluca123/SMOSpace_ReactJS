import AppLogo from '@/components/AppLogo';

export default function LeftSide({ image }: { image: string }) {
  return (
    <div className='hidden z-10 px-10 w-1/2 lg:block bg-secondary'>
      <div className='flex flex-col pt-20 mx-auto h-dvh max-w-[35rem]'>
        <AppLogo className='w-fit' />

        <div className='mt-20 space-y-6 animate__animated animate__fadeInLeft'>
          <h1 className='text-[40px] leading-[53px] font-bold text-primary'>
            Connect with friends!
          </h1>
          <p className='text-lg tracking-[0.64px] max-w-[25rem]'>
            Share what&apos;s new and life moments with your friends.
          </p>
        </div>

        <div className='overflow-hidden h-full'>
          <div className='mt-10 w-full h-full rounded-ss-[40px] rounded-se-[40px] border-r-[20px] border-t-[20px] border-l-[20px] border-card overflow-hidden'>
            <img
              src={image}
              alt=''
              className='object-cover rounded-ss-[20px] rounded-se-[20px] size-full'
            />
          </div>
        </div>
      </div>
    </div>
  );
}
