"use client";

import Image from "next/image";
import { EditorContent, Editor } from "@tiptap/react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import EmojiPicker from "@/components/emoji-picker";

type CommentEditorProps = {
  isLoading: boolean;
  isPending: boolean;
  editor: Editor | null;
  onSelect: (value: string) => void;
  handleComment: () => void;
};

const CommentEditor = ({
  isLoading,
  editor,
  onSelect,
  handleComment,
  isPending,
}: CommentEditorProps) => {
  if (isLoading) {
    return (
      <div className="tiptap ProseMirror text-sm leading-[18px] h-[18px]">
        <div className="flex items-center gap-2 justify-between">
          <p
            data-placeholder="Add a comment..."
            className="is-empty is-editor-empty"
          >
            <br className="ProseMirror-trailingBreak" />
          </p>
          <Button variant="outline" size="icon" className="h-fit w-fit p-0">
            <Icons.emoji />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-1 justify-between items-center">
      {isPending ? (
        <div className="flex items-center justify-center w-full">
          <Image
            src="/assets/loading-spinner.svg"
            width={18}
            height={18}
            alt="Loading spinner"
            className="animate-spin"
          />
        </div>
      ) : (
        <EditorContent editor={editor} className="w-[88%]" />
      )}
      <div className="flex items-center gap-2 w-fit">
        {!editor?.isEmpty && (
          <Button
            onClick={handleComment}
            className="text-sm font-semibold text-igPrimary p-0 h-[18px] w-fit"
            variant="ghost"
          >
            Post
          </Button>
        )}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="h-fit w-fit p-0">
              <Icons.emoji />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-80"
            side="top"
            align="start"
            avoidCollisions
          >
            <EmojiPicker onSelect={onSelect} />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
export default CommentEditor;
