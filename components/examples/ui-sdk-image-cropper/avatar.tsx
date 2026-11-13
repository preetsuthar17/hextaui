"use client"

import * as React from "react"
import { IconUser } from "@tabler/icons-react"
import { cropImage } from "@ui-sdk/react/image"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  ImageCropper,
  ImageCropperImage,
  ImageCropperRotate,
  ImageCropperSelection,
  ImageCropperViewport,
  ImageCropperZoom,
  type ImageCrop,
} from "@/components/ui/ui-sdk-image-cropper"

const photo =
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80&auto=format&fit=crop"

function UiSdkImageCropperAvatar() {
  const [crop, setCrop] = React.useState<ImageCrop>()
  const [avatar, setAvatar] = React.useState<string>()

  React.useEffect(
    () => () => {
      if (avatar) URL.revokeObjectURL(avatar)
    },
    [avatar]
  )

  async function save() {
    if (!crop) return
    const file = await cropImage(photo, crop, { width: 128, shape: "circle" })
    setAvatar(URL.createObjectURL(file))
  }

  return (
    <div className="flex w-full max-w-xs flex-col gap-3">
      <ImageCropper
        aria-label="Profile photo"
        src={photo}
        mode="frame"
        aspectRatio={1}
        shape="circle"
        maxZoom={4}
        crop={crop}
        onCropChange={setCrop}
      >
        <ImageCropperViewport>
          <ImageCropperImage alt="Snowy peaks above a sea of clouds" />
          <ImageCropperSelection />
        </ImageCropperViewport>
        <div className="flex items-center gap-2">
          <ImageCropperZoom />
          <ImageCropperRotate />
        </div>
      </ImageCropper>
      <div className="flex items-center gap-3">
        <Button size="sm" onClick={save} disabled={!crop}>
          Save avatar
        </Button>
        <Avatar>
          {avatar && <AvatarImage src={avatar} alt="Your new avatar" />}
          <AvatarFallback>
            <IconUser />
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  )
}

export { UiSdkImageCropperAvatar }
