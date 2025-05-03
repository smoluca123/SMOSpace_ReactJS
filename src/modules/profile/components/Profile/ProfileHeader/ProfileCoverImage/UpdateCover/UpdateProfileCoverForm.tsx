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

import { IUserDataType } from '@/lib/types/interfaces';
import Dropzone from 'react-dropzone';
import { useEffect, useRef, useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import LoadingButton from '@/components/LoadingButton';
import { toast } from '@/hooks/use-toast';
import { motion, useAnimation } from 'framer-motion';
import { useUpdateCoverImageMutation } from '@/modules/profile/components/Profile/ProfileHeader/ProfileCoverImage/UpdateCover/mutations';

interface IProps {
  userData: IUserDataType;
  onClose: () => void;
}

export default function UpdateProfileCoverForm({ userData, onClose }: IProps) {
  const [image, setImage] = useState<string | undefined>(userData.coverImage);
  const [acceptedFiles, setAcceptedFiles] = useState<File[]>([]);
  const { mutate, isPending: isPendingUpdateAvatar } = useUpdateCoverImageMutation({
    userId: userData.id,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const [imageLoaded, setImageLoaded] = useState(false);

  const [isPending, startTransition] = useTransition();

  const onDrop = (acceptedFiles: File[]) => {
    setImageLoaded(false);
    if (acceptedFiles.length === 0) return;

    // Revoke old URL if exists
    if (image) {
      URL.revokeObjectURL(image);
    }

    // Create new URL for dropped image
    const imageUrl = URL.createObjectURL(acceptedFiles[0]);
    setAcceptedFiles(acceptedFiles);
    setImage(imageUrl);

    // Reset animation and position
    controls.set({ y: 0 });
    setImageLoaded(true);
  };

  const handleSave = async () => {
    try {
      // TODO: Implement save logic here
      startTransition(async () => {
        // 3. Upload to server
        mutate(acceptedFiles[0], {
          onSuccess: () => {
            toast({
              title: 'Successfully',
              description: 'Your cover image has been updated',
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

  // Đưa ảnh về vị trí mặc định khi load trang
  useEffect(() => {
    if (imageLoaded) {
      controls.start({ y: 0 });
    }
  }, [imageLoaded, controls, image]);

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
          <div
            {...getRootProps()}
            className='relative h-[350px] overflow-hidden'
            ref={containerRef}
          >
            <motion.img
              src={image}
              alt={userData.displayName}
              className='block object-contain w-full'
              style={{
                transformOrigin: 'top',
                cursor: 'grab',
              }}
              drag='y'
              dragConstraints={containerRef}
              dragElastic={0.1}
              whileTap={{ cursor: 'grabbing' }}
              animate={controls}
              onLoad={() => setImageLoaded(true)}
              key={image}
            />
            <input {...getInputProps()} />
          </div>
        )}
      </Dropzone>

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
