// import { ICroppedAreaType, IUserDataType } from '@/lib/types/interfaces';
// import Dropzone from 'react-dropzone';
// import Cropper from 'react-easy-crop';
// import { useRef, useState } from 'react';

// interface IProps {
//   userData: IUserDataType;
// }

// export default function UpdateAvatarForm({ userData }: IProps) {
//   const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
//   const [image, setImage] = useState<string | undefined>(userData.avatar);
//   const imageUrl = useRef<string>('');
//   const [zoom, setZoom] = useState(1);

//   const onCropComplete = async (_: ICroppedAreaType, croppedAreaPixels: ICroppedAreaType) => {
//     try {
//       console.log(_, croppedAreaPixels);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const onDrop = (acceptedFiles: File[]) => {
//     if (acceptedFiles.length === 0) return;
//     URL.revokeObjectURL(imageUrl.current || '');
//     imageUrl.current = URL.createObjectURL(acceptedFiles[0]);
//     // Read the file and convert it to a data URL
//     setImage(imageUrl.current);
//   };
//   return (
//     <div>
//       <Dropzone
//         onDrop={onDrop}
//         accept={{
//           'image/*': [],
//         }}
//         noClick
//       >
//         {({ getRootProps, getInputProps }) => (
//           <div {...getRootProps()} className='relative h-[500px]'>
//             <Cropper
//               //   classes={{
//               //     mediaClassName: '!my-0  object-cover',
//               //     cropAreaClassName: '',
//               //   }}
//               image={image}
//               crop={crop}
//               zoom={zoom}
//               aspect={1}
//               cropShape='round' // Round crop
//               onCropChange={setCrop}
//               onCropComplete={onCropComplete}
//               onZoomChange={setZoom}
//             />
//             <input {...getInputProps()} />
//           </div>
//         )}
//       </Dropzone>
//     </div>
//   );
// }

'use no memo';

import { ICroppedAreaType, IUserDataType } from '@/lib/types/interfaces';
import Dropzone from 'react-dropzone';
import Cropper from 'react-easy-crop';
import { useRef, useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import LoadingButton from '@/components/LoadingButton';
import { Slider } from '@/components/ui/slider';
import { blobToFile, getCroppedImg } from '@/lib/utils';
import { useUpdateAvatarMutation } from '@/modules/profile/components/Profile/ProfileHeader/ProfileAvatarImage/UpdateAvatar/mutations';
import { toast } from '@/hooks/use-toast';
import { Upload } from 'lucide-react';

interface IProps {
  userData: IUserDataType;
  onClose: () => void;
  mode: 'edit' | 'upload';
  initialImage?: string;
}

export default function UpdateAvatarForm({ userData, onClose, mode, initialImage }: IProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [image, setImage] = useState<string | undefined>(initialImage);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<ICroppedAreaType | null>(null);
  const imageUrl = useRef<string>(initialImage || '');
  const { mutate, isPending: isPendingUpdateAvatar } = useUpdateAvatarMutation({
    userId: userData.id,
  });
  const [isPending, startTransition] = useTransition();

  const onCropComplete = (_: ICroppedAreaType, croppedAreaPixels: ICroppedAreaType) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    // Revoke old URL if exists
    URL.revokeObjectURL(imageUrl.current);

    // Create new URL for dropped image
    imageUrl.current = URL.createObjectURL(acceptedFiles[0]);
    setImage(imageUrl.current);
  };

  const handleSave = async () => {
    if (!croppedAreaPixels || !image) return;

    try {
      startTransition(async () => {
        // 1. Create canvas from cropped area
        const croppedImage = await getCroppedImg({
          imageSrc: imageUrl.current,
          croppedAreaPixels,
          // isCircle: true,
        });
        // 2. Convert to blob/file
        const imageFile = blobToFile(croppedImage);

        // 3. Upload to server
        mutate(imageFile, {
          onSuccess: () => {
            toast({
              title: 'Successfully',
              description:
                mode === 'edit'
                  ? 'Your avatar has been edited'
                  : 'Your new avatar has been uploaded',
              duration: 3000,
            });
            onClose();
          },
        });
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='space-y-4'>
      {image ? (
        <Dropzone
          onDrop={onDrop}
          accept={{
            'image/*': [],
          }}
          noClick
        >
          {({ getRootProps, getInputProps }) => (
            <div {...getRootProps()} className='relative h-[500px]'>
              <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape='round'
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
      ) : (
        <Dropzone
          onDrop={onDrop}
          accept={{
            'image/*': [],
          }}
        >
          {({ getRootProps, getInputProps }) => (
            <div
              {...getRootProps()}
              className='flex flex-col gap-4 justify-center items-center h-[500px] border-2 border-dashed rounded-lg border-gray-300 hover:border-primary transition-colors cursor-pointer'
            >
              <Upload className='w-12 h-12 text-gray-400' />
              <div className='text-center'>
                <p className='text-sm text-gray-600'>Drag and drop your image here</p>
                <p className='text-sm text-gray-600'>or click to select a file</p>
              </div>
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
      )}

      {image && (
        <>
          {/* Zoom control */}
          <div className='flex gap-4 items-center px-4'>
            <span className='text-sm'>Zoom</span>
            <Slider
              value={[zoom]}
              onValueChange={(value) => setZoom(value[0])}
              min={1}
              max={3}
              step={0.1}
              className='w-full'
            />
          </div>

          {/* Actions */}
          <div className='flex gap-2 justify-end pt-4'>
            <Button variant='outline' onClick={onClose}>
              Cancel
            </Button>
            <LoadingButton
              loading={isPending || isPendingUpdateAvatar}
              onClick={handleSave}
              disabled={!croppedAreaPixels}
            >
              Save
            </LoadingButton>
          </div>
        </>
      )}
    </div>
  );
}
