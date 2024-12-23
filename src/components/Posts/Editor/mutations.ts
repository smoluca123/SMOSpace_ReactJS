import { submitPostAPI } from '@/apis/postApi';
import { useMutation } from '@tanstack/react-query';

export function useSubmitPostMutaion() {
  const submitPost = async ({ content, isPrivate }: { content: string; isPrivate?: boolean }) => {
    try {
      const data = await submitPostAPI({
        content,
        isPrivate,
      });
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
      throw new Error(error as string);
    }
  };

  const mutation = useMutation({
    mutationFn: submitPost,
  });
  return mutation;
}
