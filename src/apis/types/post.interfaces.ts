export interface IGeneratePostImagesResponseType {
  price: string;
  priceNum: number;
  currentCredits: string;
  data: {
    id: string;
    model: string;
    version: string;
    input: {
      prompt: string;
      num_images: number;
      image_size: {
        width: number;
        height: number;
      };
      num_inference_steps: number;
      seed: number;
      output_format: string;
      output_quality: number;
    };

    output: {
      url: string;
    }[];
  };
}
