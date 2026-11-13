import {
  ImageCropper,
  ImageCropperHandles,
  ImageCropperImage,
  ImageCropperRotate,
  ImageCropperSelection,
  ImageCropperViewport,
  ImageCropperZoom,
} from "@/components/ui/ui-sdk-image-cropper"

const photo =
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&q=80&auto=format&fit=crop"

function UiSdkImageCropperDisabled() {
  return (
    <ImageCropper
      aria-label="Photo"
      src={photo}
      aspectRatio={16 / 9}
      disabled
      className="max-w-md"
    >
      <ImageCropperViewport>
        <ImageCropperImage alt="A rowing boat on a green mountain lake" />
        <ImageCropperSelection>
          <ImageCropperHandles />
        </ImageCropperSelection>
      </ImageCropperViewport>
      <div className="flex items-center gap-2">
        <ImageCropperZoom />
        <ImageCropperRotate />
      </div>
    </ImageCropper>
  )
}

export { UiSdkImageCropperDisabled }
