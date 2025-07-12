import { getTrendingTopicsAPI } from '@/apis/postApi';
import { getAllUsersAPI } from '@/apis/userApi';
import { useQuery } from '@tanstack/react-query';

export const getTrendingTopicsQueryKey = ['list-trending-topics'];
export const useGetTrendingTopics = () => {
  const handleGetTrendingTopics = async () => {
    try {
      const data = getTrendingTopicsAPI();
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const querys = useQuery({
    queryKey: getTrendingTopicsQueryKey,
    queryFn: handleGetTrendingTopics,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 5, // 5 minutes
  });
  return querys;
};

export const getNewUsersQueryKey = ['list-new-users'];
export const useGetNewUsers = () => {
  const handleGetNewUsers = async () => {
    try {
      const data = await getAllUsersAPI({
        limit: 5,
      });
      return data.data;
    } catch (error) {
      console.log(error);
    }
  };

  const querys = useQuery({
    queryKey: getNewUsersQueryKey,
    queryFn: handleGetNewUsers,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 5, // 5 minutes
  });
  return querys;
};
