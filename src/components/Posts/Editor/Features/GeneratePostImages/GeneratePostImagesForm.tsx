'use no memo';

import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import LoadingButton from '@/components/LoadingButton';
import { useForm } from 'react-hook-form';
import { generatePostImagesSchema, GeneratePostImagesValues } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RotateCcw } from 'lucide-react';
import { useGeneratePostImagesMutation } from '@/components/Posts/Editor/Features/GeneratePostImages/mutations';
import { useCaculatePostImagesPrice } from '@/components/Posts/Editor/Features/GeneratePostImages/querys';
import { useDebounce } from '@uidotdev/usehooks';

interface GeneratePostImagesFormProps {
  setImages: (images: string[]) => void;
  setIsPreviewDialogOpen: (isOpen: boolean) => void;
}

const showErrorToast = (message: string) => {
  toast({
    title: 'Error',
    description: message,
    variant: 'destructive',
  });
};

const showSuccessToast = () => {
  toast({
    title: 'Success',
    description: 'Images have been generated successfully',
    duration: 3000,
  });
};

export default function GeneratePostImagesForm({
  setImages,
  setIsPreviewDialogOpen,
}: GeneratePostImagesFormProps) {
  const form = useForm<GeneratePostImagesValues>({
    defaultValues: {
      prompt: '',
      numImages: 1,
      imageSize: '1024x1024',
      seed: -1,
      steps: 1,
    },
    resolver: zodResolver(generatePostImagesSchema),
  });

  // Watch only fields that affect price (excluding prompt)
  const watchedValues = form.watch(['numImages', 'imageSize', 'seed', 'steps']);
  const debouncedFormValues = useDebounce(watchedValues, 500);

  const { data: price, isFetching: isCaculatePriceFetching } = useCaculatePostImagesPrice({
    prompt: 'Empty prompt',
    numImages: +debouncedFormValues[0] || 1,
    imageSize: debouncedFormValues[1] || '1024x1024',
    seed: debouncedFormValues[2] || -1,
    steps: debouncedFormValues[3] || 1,
  });

  const { mutate: generatePostImages, isPending } = useGeneratePostImagesMutation();

  const handleGeneratePost = (values: GeneratePostImagesValues) => {
    generatePostImages(values, {
      onSuccess: (data) => {
        showSuccessToast();
        setImages(data.data.output.map((image) => image.url));
        setIsPreviewDialogOpen(true);
      },
      onError: (error) => {
        showErrorToast(error.message);
      },
    });
  };

  return (
    <div className='w-full'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleGeneratePost)} className='space-y-4'>
          <div className='grid grid-cols-12 gap-4'>
            <FormField
              control={form.control}
              name='seed'
              render={({ field }) => (
                <FormItem className='col-span-6'>
                  <FormLabel>
                    Seed <span className='text-xs text-muted-foreground'>-1 for random</span>
                  </FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Input {...field} type='number' min={-1} className='relative' />

                      <button
                        className='absolute right-2 top-1/2 p-1 rounded-full -translate-y-1/2 text-primary bg-card hover:bg-card/80'
                        type='button'
                        onClick={() => {
                          field.onChange(Math.floor(Math.random() * 100000000));
                        }}
                      >
                        <RotateCcw className='w-4 h-4' />
                      </button>
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='steps'
              render={({ field }) => (
                <FormItem className='col-span-6'>
                  <FormLabel>Steps</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type='number'
                      min={1}
                      max={60}
                      onChange={(e) => {
                        const value = +e.target.value;
                        if (value >= 1 && value <= 60) {
                          field.onChange(value);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* <Label>Prompt</Label>
          <Textarea
            placeholder="Describe your post images, e.g. 'A beautiful sunset over the ocean'"
            className='h-[12rem] overflow-y-auto bg-card'
          /> */}

          <FormField
            control={form.control}
            name='imageSize'
            render={({ field }) => (
              <FormItem className='col-span-6'>
                <FormLabel>Image Size</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder='Select Image Size' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='1024x1024'>1024x1024</SelectItem>
                      <SelectItem value='1344x768'>1344x768</SelectItem>
                      <SelectItem value='1280x960'>1280x960</SelectItem>
                      <SelectItem value='960x1280'>960x1280</SelectItem>
                      <SelectItem value='768x1344'>768x1344</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='numImages'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image Count: {field.value}</FormLabel>
                <FormControl>
                  <Slider
                    {...field}
                    min={1}
                    max={4}
                    step={1}
                    value={[field.value]}
                    onValueChange={(value) => {
                      field.onChange(+value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='prompt'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prompt</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Describe your post images, e.g. 'A beautiful sunset over the ocean'"
                    className='h-[12rem] overflow-y-auto bg-card'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <LoadingButton
            loading={isPending || isCaculatePriceFetching}
            className='ml-auto'
            disabled={!form.formState.isValid || isPending || isCaculatePriceFetching}
          >
            {isCaculatePriceFetching ? 'Calculating price...' : `Generate (${price?.price} Points)`}
          </LoadingButton>
        </form>
      </Form>
    </div>
  );
}
