import { generatePostAPI } from '@/apis/postApi';
import { useAppDispatch } from '@/redux/hooks';
import { updateUserCredits } from '@/redux/slices/authSlice';
import { useMutation } from '@tanstack/react-query';

export function useGeneratePostMutaion() {
  const dispatch = useAppDispatch();

  const generatePost = async ({ prompt }: { prompt: string }) => {
    try {
      // API call to generate a new post
      const data = await generatePostAPI({
        prompt,
      });
      return data.data.data;
      // Return the new post data
    } catch (error) {
      console.log(error);
      throw new Error(error as string);
    }
  };
  const mutation = useMutation({
    mutationFn: generatePost,
    onSuccess: (data) => {
      dispatch(updateUserCredits(data.currentCredits));
    },
  });

  return mutation;
}
