"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AdjustmentItemProps = {
  onClick: (value: number) => void;
  value: number | number[];
  onChange: (value: number) => void;
  label: string;
};
const AdjustmentItem = ({
  onChange,
  onClick,
  value,
  label,
}: AdjustmentItemProps) => {
  const disabled =
    label === "Fade" || label === "Temperature" || label === "Vignette";
  return (
    <div className="h-[82px]">
      <div role="presentation" className="space-y-3 group">
        <div className="flex items-center justify-between">
          <p>{label}</p>
          <Button
            variant="link"
            className="text-transparent font-semibold group-hover:text-igPrimaryButton p-0 h-fit w-fit hover:no-underline"
            onClick={() => onClick(0)}
          >
            Reset
          </Button>
        </div>
        <div className="flex gap-6">
          {/* <Slider
            isDisabled={disabled}
            aria-label={label}
            size="sm"
            color="foreground"
            step={1}
            maxValue={100}
            minValue={-100}
            fillOffset={0}
            value={value}
            className="max-w-md"
            classNames={{
              value: "text-igSecondaryText",
              thumb: "bg-primary border-none after:bg-primary shadow-none",
              track: "bg-black/20 h-[2px]",
            }}
            endContent={
              <div className="w-10 flex items-center justify-center">
                <span
                  className={cn(
                    "text-sm text-white tabular-nums",
                    value === 0 && "text-igSecondaryText"
                  )}
                >
                  {value}
                </span>
              </div>
            }
            onChange={(zoom: number | number[]) => {
              onChange(zoom as number);
            }}
          /> */}
        </div>
      </div>
    </div>
  );
};
export default AdjustmentItem;
