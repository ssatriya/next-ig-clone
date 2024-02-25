"use client";

import Image from "next/image";

import useFilter from "@/hooks/use-filter";
import { cn } from "@/lib/utils";
import { FilterOptionsType } from "@/types";

type FilterItemProps = {
  alt: string;
  src: string;
  label: string;
  value: FilterOptionsType;
};

const FilterItem = ({ alt, src, label, value }: FilterItemProps) => {
  const { setSelectedFilter, selectedFilter } = useFilter((state) => state);

  return (
    <div
      onClick={() => setSelectedFilter(value)}
      role="button"
      className="flex flex-col gap-2 justify-center items-center"
    >
      <Image
        src={src}
        height={88}
        width={88}
        alt={alt}
        className={cn(
          "object-fill rounded-sm",
          selectedFilter === value
            ? "ring-2 ring-igPrimaryButtonHover"
            : "ring-0"
        )}
      />
      <p className="text-xs text-[#A8A8A8]">{label}</p>
    </div>
  );
};
export default FilterItem;
