"use client";

import Image from "next/image";
import { SetStateAction } from "react";
import { Editor, EditorContent } from "@tiptap/react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import EmojiPicker from "@/components/emoji-picker";

type CommentEditorProps = {
  setCaption: React.Dispatch<SetStateAction<string | undefined>>;
  editor: Editor | null;
  onSelect: (data: string) => void;
  handleComment: () => void;
  isPending: boolean;
};

const CommentEditor = ({
  setCaption,
  editor,
  onSelect,
  handleComment,
  isPending,
}: CommentEditorProps) => {
  return (
    <div className="flex justify-between items-center w-full">
      <div className="flex gap-3 items-center w-full">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="h-fit w-fit p-0">
              <Icons.emoji className="h-6 w-6" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-80 bg-transparent border-none"
            side="top"
            align="start"
            alignOffset={-14}
            sideOffset={-3}
            avoidCollisions
          >
            <EmojiPicker onSelect={onSelect} />
          </PopoverContent>
        </Popover>
        {isPending ? (
          <div className="flex items-center justify-center w-full">
            <Image
              src="/assets/loading-spinner.svg"
              width={24}
              height={24}
              alt="Loading spinner"
              className="animate-spin"
            />
          </div>
        ) : (
          <EditorContent editor={editor} className="w-[88%]" />
        )}
      </div>
      <Button
        onClick={handleComment}
        disabled={editor?.isEmpty || isPending}
        className="text-sm font-semibold text-igPrimary p-0 h-[18px] w-fit select-none"
        variant="ghost"
      >
        Post
      </Button>
    </div>
  );
};
export default CommentEditor;
