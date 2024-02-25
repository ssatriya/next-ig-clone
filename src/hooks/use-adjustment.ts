import { create } from "zustand";

// Define types
type AdjustmentType = {
  brightness: number;
  hue: number;
  saturation: number;
  contrast: number;
};

type AdjustmentStore = {
  adjustments: AdjustmentType;
  updateBrightness: (value: number) => void;
  updateHue: (value: number) => void;
  updateSaturation: (value: number) => void;
  updateContrast: (value: number) => void;
};

// Create Zustand store
export const useAdjustmentStore = create<AdjustmentStore>((set) => ({
  adjustments: {
    brightness: 0,
    hue: 0,
    saturation: 0,
    contrast: 0,
  },
  updateBrightness: (value) =>
    set((state) => ({
      adjustments: { ...state.adjustments, brightness: value },
    })),
  updateHue: (value) =>
    set((state) => ({ adjustments: { ...state.adjustments, hue: value } })),
  updateSaturation: (value) =>
    set((state) => ({
      adjustments: { ...state.adjustments, saturation: value },
    })),
  updateContrast: (value) =>
    set((state) => ({
      adjustments: { ...state.adjustments, contrast: value },
    })),
}));
