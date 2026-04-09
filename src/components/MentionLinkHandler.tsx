import { PropsWithChildren, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Component to handle mention link clicks with React Router navigation
 * Prevents full page reload and uses client-side routing
 */
export default function MentionLinkHandler({ children }: PropsWithChildren) {
  const navigate = useNavigate();

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;

    // Check if clicked element or its parent is a mention link
    const mentionLink = target.closest('a[data-type="mention"]');

    if (mentionLink) {
      e.preventDefault();
      const href = mentionLink.getAttribute('href');
      if (href) {
        navigate(href);
      }
    }
  };

  return (
    <div onClick={handleClick} className='contents'>
      {children}
    </div>
  );
}
