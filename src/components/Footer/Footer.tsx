import { cn } from '@/lib/utils';
import { Earth } from 'lucide-react';

const footerContent = [
  'Home',
  'About',
  'Contact',
  'Us',
  'Privacy',
  'Policy',
  'Terms of Use',
  'Request a Refund ',
  'Blog',
  'Developers',
];

export default function Footer() {
  return (
    <footer className='container items-center justify-between px-6 py-5 mx-auto mt-5 text-center md:px-0 md:flex text-muted-foreground/70'>
      {/* Coppyright */}
      <FooterItem className=' shrink-0'>© 2025 SMO Space</FooterItem>

      {/* Footer content */}
      <div className='flex flex-wrap justify-center gap-x-4 gap-y-1 '>
        {footerContent.map((content) => (
          <FooterItem key={content}>{content}</FooterItem>
        ))}
      </div>

      <FooterItem className='inline-flex items-center gap-x-2'>
        <Earth className='size-4' /> Language
      </FooterItem>
    </footer>
  );
}

function FooterItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'transition-colors duration-300 cursor-pointer text-muted-foreground/70 hover:text-foreground',
        className,
      )}
    >
      {children}
    </span>
  );
}
