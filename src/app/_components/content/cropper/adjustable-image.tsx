"use client";

import React, {
  forwardRef,
  useRef,
  CSSProperties,
  useLayoutEffect,
} from "react";

import { CropperSource, mergeRefs } from "react-advanced-cropper";
import useFilter from "@/hooks/use-filter";
import { FilterOptionsType } from "@/types";
import { setTimeout } from "timers";
import { cn } from "@/lib/utils";

interface Props {
  src?: string;
  className?: string;
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
  style?: CSSProperties;
}

export const AdjustableImage = forwardRef<HTMLCanvasElement, Props>(
  (
    {
      src,
      className,
      crossOrigin,
      brightness = 0,
      saturation = 0,
      hue = 0,
      contrast = 0,
      // added
      grayscale = 0,
      invert = 0,
      blur = 0,
      sepia = 0,
      opacity = 0,
      style,
    }: Props,
    ref
  ) => {
    const { selectedFilter } = useFilter((state) => state);

    const imageRef = useRef<HTMLImageElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const drawImage = () => {
      const image = imageRef.current;
      const canvas = canvasRef.current;

      if (selectedFilter === "original") {
        if (canvas && image && image.complete) {
          const ctx = canvas.getContext("2d");
          canvas.width = image.naturalWidth;
          canvas.height = image.naturalHeight;

          if (ctx) {
            // ctx.filter = [
            //   `brightness(${100 + brightness / 2}%)`,
            //   `contrast(${100 + contrast / 2}%)`,
            //   `saturate(${100 + saturation / 2}%)`,
            //   `hue-rotate(${hue * 360}deg)`,
            // ].join(" ");

            ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);
          }
        }
      } else {
        if (canvas && image && image.complete) {
          const ctx = canvas.getContext("2d");
          canvas.width = image.naturalWidth;
          canvas.height = image.naturalHeight;
          if (ctx) {
            ctx.filter = [
              `brightness(${Number(brightness)}%)`,
              `contrast(${Number(contrast)}%)`,
              `saturate(${Number(saturation)}%)`,
              `hue-rotate(${Number(hue)}deg)`,
              `grayscale(${Number(grayscale)}%)`,
              `invert(${Number(invert)}%)`,
              `blur(${Number(blur)}px)`,
              `sepia(${Number(sepia)}%)`,
              `opacity(${Number(opacity)}%)`,
            ].join(" ");

            ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);
          }
        }
      }
    };

    useLayoutEffect(() => {
      drawImage();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [src, brightness, saturation, hue, contrast, selectedFilter]);

    return (
      <>
        <canvas
          key={`${src}-canvas`}
          ref={mergeRefs([ref, canvasRef])}
          className={cn(className)}
          style={style}
        />
        {src ? (
          <CropperSource
            key={`${src}-img`}
            ref={imageRef}
            className="hidden"
            src={src}
            crossOrigin={crossOrigin}
            onLoad={drawImage}
          />
        ) : null}
      </>
    );
  }
);

AdjustableImage.displayName = "AdjustableImage";
