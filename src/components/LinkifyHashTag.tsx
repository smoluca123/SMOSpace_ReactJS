import { PropsWithChildren } from 'react';
import { LinkIt } from 'react-linkify-it';
import { Link } from 'react-router-dom';

export default function LinkifyHashTag({ children }: PropsWithChildren) {
  return (
    <LinkIt
      regex={/(#[a-zA-Z0-9_\u00C0-\u1EF9]+)/}
      component={(match, key) => (
        <Link
          key={`${match}-${key}`}
          to="/"
          className="text-primary hover:underline"
        >
          {match}
        </Link>
      )}
    >
      {children}
    </LinkIt>
  );
}
