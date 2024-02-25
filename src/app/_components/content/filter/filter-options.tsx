import { FilterOptions } from "@/types";
import FilterItem from "./filter-item";

const filterOptions: FilterOptions[] = [
  {
    alt: "Aden filter",
    src: "/filters/aden.jpg",
    label: "Aden",
    value: "aden",
  },
  {
    alt: "Clarendon filter",
    src: "/filters/clarendon.jpg",
    label: "Clarendon",
    value: "clarendon",
  },
  {
    alt: "Crema filter",
    src: "/filters/crema.jpg",
    label: "Crema",
    value: "crema",
  },
  {
    alt: "Gingham filter",
    src: "/filters/gingham.jpg",
    label: "Gingham",
    value: "gingham",
  },
  {
    alt: "juno filter",
    src: "/filters/Juno.jpg",
    label: "Juno",
    value: "juno",
  },
  {
    alt: "Lark filter",
    src: "/filters/lark.jpg",
    label: "Lark",
    value: "lark",
  },
  {
    alt: "Ludwig filter",
    src: "/filters/ludwig.jpg",
    label: "Ludwig",
    value: "ludwig",
  },
  {
    alt: "Moon filter",
    src: "/filters/moon.jpg",
    label: "Moon",
    value: "moon",
  },
  {
    alt: "Original filter",
    src: "/filters/normal.jpg",
    label: "Original",
    value: "original",
  },
  {
    alt: "Perpetua filter",
    src: "/filters/perpetua.jpg",
    label: "Perpetua",
    value: "perpetua",
  },
  {
    alt: "Reyes filter",
    src: "/filters/reyes.jpg",
    label: "Reyes",
    value: "reyes",
  },
  {
    alt: "Slumber filter",
    src: "/filters/slumber.jpg",
    label: "Slumber",
    value: "slumber",
  },
];

const FilterOptions = () => {
  return (
    <div className="grid grid-cols-3 justify-between gap-y-4 shrink-0">
      {filterOptions.map(({ alt, label, src, value }, index) => (
        <FilterItem
          key={index}
          alt={alt}
          src={src}
          label={label}
          value={value}
        />
      ))}
    </div>
  );
};
export default FilterOptions;
