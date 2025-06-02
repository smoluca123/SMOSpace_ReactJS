export default function PostsTableLoadingSkeleton() {
  return (
    <div className='p-6'>
      <div className='space-y-4'>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className='flex items-center space-x-4'>
            <div className='w-4 h-4 rounded bg-muted' />
            <div className='w-12 h-12 rounded bg-muted' />
            <div className='flex-1 space-y-2'>
              <div className='w-3/4 h-4 rounded bg-muted' />
              <div className='w-1/2 h-3 rounded bg-muted' />
            </div>
            <div className='w-16 h-6 rounded bg-muted' />
            <div className='w-20 h-6 rounded bg-muted' />
          </div>
        ))}
      </div>
    </div>
  );
}
