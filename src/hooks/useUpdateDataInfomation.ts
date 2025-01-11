import { getMyInfomationQueryKey } from '@/lib/querys';
import { IApiResponseWrapper, IUserDataType } from '@/lib/types/interfaces';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectAuth, updateUser } from '@/redux/slices/authSlice';
import { QueryFilters, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

export default function useUpdateDataInfomation() {
  const queryClient = useQueryClient();
  const { user } = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();

  const updateDataInfomationQuery = useCallback(
    (data: IUserDataType) => {
      const queryFilter: QueryFilters<IApiResponseWrapper<IUserDataType>['data']> = {
        queryKey: getMyInfomationQueryKey,
      };

      queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData(queryFilter, (oldData) => {
        return { ...oldData, ...data };
      });
    },
    [queryClient],
  );

  const updateDataInfomationRedux = useCallback(
    (data: IUserDataType) => {
      if (!user) return;
      dispatch(updateUser({ ...user, ...data }));
    },
    [dispatch, user],
  );

  const update = useCallback(
    ({ data }: { data: IUserDataType }) => {
      updateDataInfomationQuery(data);
      updateDataInfomationRedux(data);
    },
    [updateDataInfomationQuery, updateDataInfomationRedux],
  );

  return { update };
}
