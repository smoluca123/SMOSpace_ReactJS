import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UUID } from 'crypto';

interface UseSendFriendRequestMutationProps {
  userId: UUID;
}

export function useSendFriendRequestMutation({ userId }: UseSendFriendRequestMutationProps) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // TODO: Implement API call to send friend request
      // const response = await api.post('/friends/request', { userId });
      // return response.data;
      console.log('Sending friend request to:', userId);
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      queryClient.invalidateQueries({ queryKey: ['friend-requests'] });
    },
    onError: (error) => {
      console.error('Failed to send friend request:', error);
    },
  });
}

interface UseUnfriendMutationProps {
  userId: UUID;
}

export function useUnfriendMutation({ userId }: UseUnfriendMutationProps) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // TODO: Implement API call to unfriend user
      // const response = await api.delete(`/friends/${userId}`);
      // return response.data;
      console.log('Unfriending user:', userId);
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
      queryClient.invalidateQueries({ queryKey: ['friends'] });
    },
    onError: (error) => {
      console.error('Failed to unfriend user:', error);
    },
  });
}

interface UseCancelFriendRequestMutationProps {
  userId: UUID;
}

export function useCancelFriendRequestMutation({ userId }: UseCancelFriendRequestMutationProps) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // TODO: Implement API call to cancel friend request
      // const response = await api.delete(`/friends/request/${userId}`);
      // return response.data;
      console.log('Canceling friend request to:', userId);
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
      queryClient.invalidateQueries({ queryKey: ['friend-requests'] });
    },
    onError: (error) => {
      console.error('Failed to cancel friend request:', error);
    },
  });
}
