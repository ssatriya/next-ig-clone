import { create } from "zustand";

import { FilterOptionsType } from "@/types";

const filters = [
  "aden",
  "clarendon",
  "crema",
  "gingham",
  "juno",
  "lark",
  "original",
] as const;

type FilterProperty = {
  contrast: string;
  brightness: string;
  saturation: string;
  hueRotate: string;
  sepia: string;
  grayscale: string;
  invert: string;
  blur: string;
  opacity: string;
};

const filterPresets: Record<FilterOptionsType, FilterProperty> = {
  aden: {
    contrast: "90",
    brightness: "120",
    saturation: "85",
    hueRotate: "20",
    sepia: "0",
    grayscale: "0",
    invert: "0",
    blur: "0",
    opacity: "100",
  },
  clarendon: {
    contrast: "120",
    brightness: "125",
    saturation: "100",
    hueRotate: "0",
    sepia: "0",
    grayscale: "0",
    invert: "0",
    blur: "0",
    opacity: "100",
  },
  crema: {
    contrast: "110",
    brightness: "110",
    saturation: "130",
    hueRotate: "0",
    sepia: "0",
    grayscale: "0",
    invert: "0",
    blur: "0",
    opacity: "100",
  },
  gingham: {
    contrast: "105",
    brightness: "100",
    saturation: "100",
    hueRotate: "350",
    sepia: "0",
    grayscale: "0",
    invert: "0",
    blur: "0",
    opacity: "100",
  },
  juno: {
    contrast: "105",
    brightness: "100",
    saturation: "100",
    hueRotate: "350",
    sepia: "0",
    grayscale: "0",
    invert: "0",
    blur: "0",
    opacity: "100",
  },
  lark: {
    contrast: "140",
    brightness: "100",
    saturation: "100",
    hueRotate: "0",
    sepia: "50",
    grayscale: "0",
    invert: "0",
    blur: "0",
    opacity: "100",
  },
  ludwig: {
    contrast: "95",
    brightness: "95",
    saturation: "150",
    hueRotate: "0",
    sepia: "25",
    grayscale: "0",
    invert: "0",
    blur: "0",
    opacity: "100",
  },
  moon: {
    contrast: "110",
    brightness: "110",
    saturation: "100",
    hueRotate: "0",
    sepia: "30",
    grayscale: "100",
    invert: "0",
    blur: "0",
    opacity: "100",
  },
  original: {
    contrast: "100",
    brightness: "100",
    saturation: "100",
    hueRotate: "0",
    sepia: "0",
    grayscale: "0",
    invert: "0",
    blur: "0",
    opacity: "100",
  },
  perpetua: {
    contrast: "120",
    brightness: "100",
    saturation: "110",
    hueRotate: "340",
    sepia: "0",
    grayscale: "0",
    invert: "0",
    blur: "0",
    opacity: "100",
  },
  reyes: {
    contrast: "85",
    brightness: "110",
    saturation: "75",
    hueRotate: "0",
    sepia: "22",
    grayscale: "0",
    invert: "0",
    blur: "0",
    opacity: "100",
  },
  slumber: {
    contrast: "90",
    brightness: "100",
    saturation: "100",
    hueRotate: "0",
    sepia: "10",
    grayscale: "0",
    invert: "0",
    blur: "0",
    opacity: "100",
  },
};

// Not actual filter = Crema, Juno, Lark, Ludwig, Moon, Slumber

interface FilterStore {
  filterProfile: Record<string, FilterProperty>;
  selectedFilter: FilterOptionsType;
  selectedPreset: FilterProperty;
  setSelectedFilter: (filter: FilterOptionsType) => void;
  availableFilters: FilterOptionsType[];

  setPresetProfile: (imageId: string, filter: FilterOptionsType) => void;
  currentImageRef: any;
  setCurrentImageSrc: (imageRef: any) => void;
}

const useFilter = create<FilterStore>((set) => ({
  filterProfile: {},
  selectedFilter: "original",
  selectedPreset: filterPresets["original"],
  setSelectedFilter: (filter) => {
    set({ selectedFilter: filter });
    set({ selectedPreset: filterPresets[filter] });
  },
  availableFilters: [...filters],

  setPresetProfile: (imageId, filter) => {
    set((state) => ({
      filterProfile: {
        ...state.filterProfile,
        [imageId]: filterPresets[filter],
      },
    }));
  },
  currentImageRef: "",
  setCurrentImageSrc: (imageRef) => {
    set({ currentImageRef: imageRef });
  },
}));

export default useFilter;
