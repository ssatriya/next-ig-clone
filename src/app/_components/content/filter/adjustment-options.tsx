import * as React from "react";

import AdjustmentItem from "./adjustment-item";
import { useAdjustmentStore } from "@/hooks/use-adjustment";

const AdjustmentOptions = () => {
  const [fade, setFade] = React.useState<number | number[]>(0);
  const [temperature, setTemperature] = React.useState<number | number[]>(0);
  const [vignette, setVignette] = React.useState<number | number[]>(0);

  const { brightness, contrast, hue, saturation } = useAdjustmentStore(
    (state) => state.adjustments
  );
  const { updateBrightness, updateHue, updateSaturation, updateContrast } =
    useAdjustmentStore();
  return (
    <div className="space-y-2">
      <AdjustmentItem
        onChange={updateBrightness}
        onClick={updateBrightness}
        value={brightness}
        label="Brightness"
      />
      <AdjustmentItem
        onChange={updateContrast}
        onClick={updateContrast}
        value={contrast}
        label="Contrast"
      />
      <AdjustmentItem
        onChange={setFade}
        onClick={setFade}
        value={fade}
        label="Fade"
      />
      <AdjustmentItem
        onChange={updateSaturation}
        onClick={updateSaturation}
        value={saturation}
        label="Saturation"
      />
      <AdjustmentItem
        onChange={setTemperature}
        onClick={setTemperature}
        value={temperature}
        label="Temperature"
      />
      <AdjustmentItem
        onChange={setVignette}
        onClick={setVignette}
        value={vignette}
        label="Vignette"
      />
    </div>
  );
};
export default AdjustmentOptions;
