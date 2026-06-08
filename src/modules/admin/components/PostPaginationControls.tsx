/**
 * @deprecated Use PaginationControls with entityLabel="posts" instead.
 */
import { IApiPaginationResponseWrapper, IPostDataType } from '@/lib/types/interfaces';
import { UseQueryResult } from '@tanstack/react-query';
import PaginationControls from './PaginationControls';

export default function PostPaginationControls({
  query,
}: {
  query: UseQueryResult<IApiPaginationResponseWrapper<IPostDataType>, Error>;
}) {
  return <PaginationControls query={query} entityLabel='posts' />;
}
