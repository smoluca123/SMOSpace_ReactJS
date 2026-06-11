/**
 * @deprecated Use PaginationControls with entityLabel="users" instead.
 */
import {
  IApiPaginationResponseWrapper,
  IUserDataWithFollowedStatusType,
} from '@/lib/types/interfaces';
import { UseQueryResult } from '@tanstack/react-query';
import PaginationControls from './PaginationControls';

export default function UserPaginationControls({
  query,
}: {
  query: UseQueryResult<IApiPaginationResponseWrapper<IUserDataWithFollowedStatusType>, Error>;
}) {
  return <PaginationControls query={query} entityLabel='users' />;
}
