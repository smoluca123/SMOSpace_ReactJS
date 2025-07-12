import { caculatePostImagesPriceAPI } from '@/apis/postApi';
import { GeneratePostImagesValues } from '@/lib/validations';
import { useQuery } from '@tanstack/react-query';

export const caculatePostImagesPriceQueryKey = (values: GeneratePostImagesValues) => [
  'post-images-price',
  values,
];

export const useCaculatePostImagesPrice = (values: GeneratePostImagesValues) => {
  const caculatePostImagesPrice = async () => {
    try {
      const { data } = await caculatePostImagesPriceAPI(values);
      return data;
    } catch (error) {
      throw new Error(error as string);
    }
  };

  return useQuery({
    queryKey: caculatePostImagesPriceQueryKey(values),
    queryFn: caculatePostImagesPrice,
  });
};
