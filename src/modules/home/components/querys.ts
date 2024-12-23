import { getTrendingTopicsAPI } from '@/apis/postApi';
import { useQuery } from '@tanstack/react-query';

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
    queryKey: ['list-trending-topics'],
    queryFn: handleGetTrendingTopics,
  });
  return querys;
};
