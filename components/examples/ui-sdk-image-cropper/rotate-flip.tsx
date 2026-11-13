import {
  ImageCropper,
  ImageCropperFlip,
  ImageCropperGrid,
  ImageCropperHandles,
  ImageCropperImage,
  ImageCropperRotate,
  ImageCropperSelection,
  ImageCropperViewport,
} from "@/components/ui/ui-sdk-image-cropper"

const photo =
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&q=80&auto=format&fit=crop"

function UiSdkImageCropperRotateFlip() {
  return (
    <ImageCropper
      aria-label="Photo"
      src={photo}
      aspectRatio={4 / 5}
      className="max-w-sm"
    >
      <ImageCropperViewport>
        <ImageCropperImage alt="A rowing boat on a green mountain lake" />
        <ImageCropperSelection>
          <ImageCropperGrid />
          <ImageCropperHandles />
        </ImageCropperSelection>
      </ImageCropperViewport>
      <div className="flex gap-2">
        <ImageCropperRotate />
        <ImageCropperFlip />
        <ImageCropperFlip direction="vertical" />
      </div>
    </ImageCropper>
  )
}

export { UiSdkImageCropperRotateFlip }
