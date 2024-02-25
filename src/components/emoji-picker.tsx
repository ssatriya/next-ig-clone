"use client";

import * as React from "react";

import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

type EmojiPickerProps = {
  onSelect: (data: string) => void;
};

const EmojiPicker = ({ onSelect }: EmojiPickerProps) => {
  return (
    <div className="relative">
      <Picker
        data={data}
        onEmojiSelect={(data: any) => onSelect(data.native)}
      />
    </div>
  );
};
export default EmojiPicker;
