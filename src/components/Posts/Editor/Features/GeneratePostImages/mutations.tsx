import { generatePostImagesAPI } from '@/apis/postApi';
import { GeneratePostImagesValues } from '@/lib/validations';
import { useAppDispatch } from '@/redux/hooks';
import { updateUserCredits } from '@/redux/slices/authSlice';
import { useMutation } from '@tanstack/react-query';

export function useGeneratePostImagesMutation() {
  const dispatch = useAppDispatch();

  const generatePostImages = async ({
    prompt,
    numImages,
    imageSize,
    seed,
    steps,
  }: GeneratePostImagesValues) => {
    try {
      const data = await generatePostImagesAPI({
        prompt,
        numImages,
        imageSize,
        seed,
        steps,
      });
      return data.data;
    } catch (error) {
      console.log(error);
      throw new Error(error as string);
    }
  };
  const mutation = useMutation({
    mutationFn: generatePostImages,
    onSuccess: (data) => {
      dispatch(updateUserCredits(Number(data.currentCredits)));
    },
  });

  return mutation;
}
