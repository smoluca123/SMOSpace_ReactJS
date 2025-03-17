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
//               cropShape='round' // Crop hình tròn
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

interface IProps {
  userData: IUserDataType;
  onClose: () => void;
}

export default function UpdateAvatarForm({ userData, onClose }: IProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [image, setImage] = useState<string | undefined>(userData.avatar);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<ICroppedAreaType | null>(null);
  const imageUrl = useRef<string>(userData.avatar);
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
    if (!croppedAreaPixels) return;

    try {
      // TODO: Implement save logic here
      startTransition(async () => {
        // 1. Create canvas from cropped area
        const croppedImage = await getCroppedImg({
          imageSrc: imageUrl.current,
          croppedAreaPixels,
          isCircle: true,
        });
        // 2. Convert to blob/file
        const imageFile = blobToFile(croppedImage);

        // 3. Upload to server
        mutate(imageFile, {
          onSuccess: () => {
            toast({
              title: 'Successfully',
              description: 'Your avatar has been updated',
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
        <LoadingButton loading={isPending || isPendingUpdateAvatar} onClick={handleSave}>
          Save
        </LoadingButton>
      </div>
    </div>
  );
}
