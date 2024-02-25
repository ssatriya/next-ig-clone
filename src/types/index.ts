import { FileWithPath } from "react-dropzone";

export type FileWithPreview = FileWithPath & {
  preview: string;
  id: string;
};

export type NavbarLink = {
  label: string;
  type: "link" | "button";
  href?: string;
  children: React.ReactNode;
  childrenMobile: React.ReactNode;
  onClick?: () => void;
};

export type FilterOptionsType =
  | "aden"
  | "clarendon"
  | "crema"
  | "gingham"
  | "juno"
  | "lark"
  | "ludwig"
  | "moon"
  | "original"
  | "perpetua"
  | "reyes"
  | "slumber";

export type FilterOptions = {
  alt: string;
  src: string;
  label: string;
  value: FilterOptionsType;
};
