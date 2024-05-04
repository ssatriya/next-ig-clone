import { aspectRatio } from "advanced-cropper/extensions/stencil-size";
import { create } from "zustand";

interface AspectRatioStore {
  aspectRatio: "original" | "square" | "portrait" | "landscape";
  ratio: { x: number; y: number };
  setAspectRatio: (
    AspectRatio: "original" | "square" | "portrait" | "landscape"
  ) => void;
}

export const useAspectRatio = create<AspectRatioStore>((set) => ({
  aspectRatio: "original",
  ratio: { x: 1, y: 1 },
  setAspectRatio: (aspectRatio) =>
    set((state) => ({
      ...state,
      aspectRatio,
      ratio: calculateRatio(aspectRatio),
    })),
}));

const calculateRatio = (
  aspectRatio: AspectRatioStore["aspectRatio"]
): { x: number; y: number } => {
  switch (aspectRatio) {
    case "original":
    case "square":
      return { x: 1, y: 1 };
    case "portrait":
      return { x: 4, y: 5 };
    case "landscape":
      return { x: 16, y: 9 };
    default:
      return { x: 1, y: 1 }; // Return default ratio
  }
};
