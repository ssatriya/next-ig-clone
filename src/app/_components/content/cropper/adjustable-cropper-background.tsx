"use client";

import React, { forwardRef } from "react";
import {
  CropperTransitions,
  CropperImage,
  CropperState,
} from "react-advanced-cropper";
import { getBackgroundStyle } from "advanced-cropper";
import { AdjustableImage } from "./adjustable-image";
import useFilter from "@/hooks/use-filter";

interface DesiredCropperRef {
  getState: () => CropperState;
  getTransitions: () => CropperTransitions;
  getImage: () => CropperImage;
}

interface Props {
  className?: string;
  cropper: DesiredCropperRef;
  crossOrigin?: "anonymous" | "use-credentials" | boolean;
  brightness?: number;
  saturation?: number;
  hue?: number;
  contrast?: number;
  // added
  grayscale?: number;
  invert?: number;
  blur?: number;
  sepia?: number;
  opacity?: number;
}

export const AdjustableCropperBackground = forwardRef<HTMLCanvasElement, Props>(
  (
    {
      className,
      cropper,
      crossOrigin,
      brightness = 0,
      saturation = 0,
      hue = 0,
      contrast = 0,
      // added
      grayscale = 0,
      invert = 0,
      blur = 0,
      opacity = 0,
      sepia = 0,
    }: Props,
    ref
  ) => {
    const state = cropper.getState();
    const transitions = cropper.getTransitions();
    const image = cropper.getImage();

    const style =
      image && state ? getBackgroundStyle(image, state, transitions) : {};

    return (
      <AdjustableImage
        src={image?.src}
        crossOrigin={crossOrigin}
        brightness={brightness}
        saturation={saturation}
        hue={hue}
        contrast={contrast}
        grayscale={grayscale}
        invert={invert}
        blur={blur}
        opacity={opacity}
        sepia={sepia}
        ref={ref}
        className={className}
        style={style}
      />
    );
  }
);

AdjustableCropperBackground.displayName = "AdjustableCropperBackground";
