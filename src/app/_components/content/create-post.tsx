"use client";

import {
  ElementRef,
  createRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import Image from "next/image";
import { generateId } from "lucia";
import { useTheme } from "next-themes";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useQueryClient } from "@tanstack/react-query";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import { FileRejection, FileWithPath, useDropzone } from "react-dropzone";

import { LIMIT } from "@/constant";
import { FileWithPreview } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import ImageEditor from "./image-editor";
import { Icons } from "@/components/icons";
import useFilter from "@/hooks/use-filter";
import { createPost } from "@/actions/post";
import { Button } from "@/components/ui/button";
import { useUploadThing } from "@/lib/uploadthing";
import { usePostModal } from "@/hooks/use-post-modal";
import { FixedCropperRef } from "react-advanced-cropper";
import PostCloseConfirmation from "./post-close-confirmation";
import { usePostCloseConfirmationModal } from "@/hooks/use-post-close-confirmation";

const CreatePost = () => {
  const { theme } = useTheme();
  const queryClient = useQueryClient();

  const light = theme === "light";
  const dark = theme === "dark";
  const { isOpen, onClose } = usePostModal();

  const [_, startTransition] = useTransition();
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const imageRef = files.map(() => createRef<FixedCropperRef>());
  const inputRef = useRef<ElementRef<"input">>(null);
  const [isDragged, setIsDragged] = useState(false);
  const [postStep, setPostStep] = useState<"image" | "filter" | "post">(
    "image"
  );
  const [caption, setCaption] = useState<string | undefined>("");
  const [posting, setPosting] = useState<
    "idle" | "posting" | "success" | "error"
  >("idle");

  const {
    isOpen: isConfirmOpen,
    onOpen: onConfirmOpen,
    onClose: onConfirmClose,
  } = usePostCloseConfirmationModal();

  useEffect(() => {
    const handleDragOver = () => {
      setIsDragged(true);
    };

    const handleDrop = () => {
      setIsDragged(false);
    };

    document.addEventListener("dragover", handleDragOver);
    document.addEventListener("drop", handleDrop);

    return () => {
      document.removeEventListener("dragover", handleDragOver);
      document.removeEventListener("drop", handleDrop);
    };
  }, []);

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[], rejectedFiles: FileRejection[]) => {
      acceptedFiles.forEach((file) => {
        const fileWithPreview = Object.assign(file, {
          id: generateId(10),
          preview: URL.createObjectURL(file),
        });
        setFiles((prev) => [...(prev ?? []), fileWithPreview]);
      });
    },
    [setFiles]
  );

  useEffect(() => {
    files.map((file, i) => {
      return () => {
        if (file) {
          URL.revokeObjectURL(file.preview);
        }
      };
    });
  }, [files]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    noClick: true,
    multiple: true,
  });

  const onDelete = (imageId: string) => {
    setFiles((prev) => prev.filter((img) => img.id !== imageId));
  };

  const { setPresetProfile, filterProfile } = useFilter((state) => state);

  useEffect(() => {
    files.forEach((file) => {
      setPresetProfile(file.id, "original");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Write a caption...",
      }),
      CharacterCount.configure({
        limit: LIMIT,
      }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class:
          "text-primary text-base leading-[18px] focus-visible:ring-none focus-visible:outline-none placeholder:text-primary min-h-[100%] min-w-[100%]",
      },
    },
  });

  const onSelect = (data: string) => {
    if (!editor) {
      return;
    }
    editor.chain().focus().insertContent(data).run();
  };

  const getImages = async () => {
    const promises = imageRef.map(async (ref) => {
      if (ref.current) {
        const dataUrl = ref.current?.getCanvas()?.toDataURL("image/jpeg");
        if (dataUrl) {
          const res = await fetch(dataUrl);
          const blob = await res.blob();
          return new File([blob], `${generateId(6)}.jpeg`, { type: blob.type });
        }
      }
    });

    return Promise.all(promises);
  };

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: (file) => {
      const fileUrl: string[] = [];
      file.map((f) => fileUrl.push(f.url));

      startTransition(() => {
        createPost({
          caption: editor?.getHTML(),
          images: fileUrl.toString(),
        }).then((data) => {
          if (data.success) {
            setPosting("success");
            setFiles([]);
            queryClient.invalidateQueries({ queryKey: ["feedQuery"] });
          }
          if (data.error) {
            setPosting("error");
          }
        });
      });
    },
  });

  const handlePost = async () => {
    setPosting("posting");
    const images = await getImages();

    let allFiles: File[] = [];
    images.map((file) => {
      if (file) {
        allFiles.push(file);
      }
    });
    startUpload(allFiles);
  };

  return (
    <div className="w-full">
      <Dialog
        open={isOpen}
        onOpenChange={() => {
          if (posting === "posting") return;
          onClose();
        }}
      >
        <DialogContent
          onInteractOutside={(e) => {
            if (files.length < 1) return;
            e.preventDefault();
            onConfirmOpen();
            setPostStep("image");
          }}
          className={cn(
            "gap-0 flex flex-col items-center max-h-[898px] max-w-[1038px] min-h-[391px] min-w-[348px] w-[692px] h-[734px] border-none p-0 sm:rounded-xl bg-background-accent",
            postStep === "filter" ? "w-[1038px]" : "",
            postStep === "post" ? "w-[1038px]" : "",
            posting === "posting" ||
              posting === "success" ||
              posting === "error"
              ? "w-[692px]"
              : ""
          )}
        >
          <DialogHeader
            className={cn(
              "border-b-[1px] w-full p-0 h-11 flex items-center justify-center",
              theme === "light"
                ? "border-b-[1px]"
                : "border-b-igElevatedSeparatorV2"
            )}
          >
            <DialogTitle className="w-full h-[42px] flex justify-center items-center">
              {files.length === 0 &&
                posting !== "posting" &&
                posting !== "success" &&
                posting !== "error" && (
                  <p className="text-base font-semibold leading-6 w-full text-center select-none">
                    Create new post
                  </p>
                )}
              {files.length > 0 &&
                posting !== "posting" &&
                posting !== "success" &&
                posting !== "error" && (
                  <div className="flex justify-between items-center w-full">
                    <Button
                      variant="icon"
                      onClick={() => {
                        if (postStep === "filter" || postStep == "post") {
                          setPostStep("image");
                          return;
                        }
                        onConfirmOpen();
                      }}
                    >
                      <Icons.arrowLeft />
                    </Button>
                    <p className="text-base font-semibold leading-6 w-full text-center select-none">
                      Crop
                    </p>
                    <Button
                      disabled={isUploading}
                      onClick={() => {
                        if (postStep === "image") {
                          setPostStep("filter");
                        } else if (postStep === "filter") {
                          setPostStep("post");
                        }
                        if (postStep === "post") {
                          handlePost();
                        }
                      }}
                      variant="text"
                      className={cn(
                        "font-medium text-igPrimary bg-transparent",
                        theme === "light" && "hover:text-igGhostButtonHover"
                      )}
                    >
                      {postStep === "image" && "Next"}
                      {postStep === "filter" && "Next"}
                      {postStep === "post" && "Share"}
                    </Button>
                  </div>
                )}
              {posting === "posting" && (
                <div className="flex justify-between items-center w-full">
                  <span className="text-base font-semibold leading-6 w-full text-center select-none">
                    Sharing
                  </span>
                </div>
              )}
              {posting === "success" && (
                <div className="flex justify-between items-center w-full">
                  <span className="text-base font-semibold leading-6 w-full text-center select-none">
                    Post shared
                  </span>
                </div>
              )}
            </DialogTitle>
          </DialogHeader>
          {files.length > 0 &&
            posting !== "posting" &&
            posting !== "success" &&
            posting !== "error" && (
              <ImageEditor
                files={files}
                imageRef={imageRef}
                inputRef={inputRef}
                onDelete={onDelete}
                postStep={postStep}
                editor={editor}
                onSelect={onSelect}
                setCaption={setCaption}
              />
            )}
          {files.length < 1 &&
            posting !== "posting" &&
            posting !== "success" &&
            posting !== "error" && (
              <div
                {...getRootProps()}
                className={cn(
                  "flex flex-col gap-5 items-center justify-center h-full w-full",
                  isDragged && dark && "bg-igSeparator rounded-b-lg",
                  isDragged && light && "bg-igSecondaryBackground rounded-b-lg"
                )}
              >
                <Icons.photoAndVideo
                  className={cn(
                    "fill-primary",
                    isDragged && light && "fill-igPrimary",
                    isDragged && dark && "fill-igPrimary"
                  )}
                />
                <p className="text-xl select-none">
                  Drag photos and videos here
                </p>
                <Button
                  className="select-none font-semibold px-4"
                  size="xs"
                  variant="primary"
                  onClick={() => {
                    if (inputRef && inputRef.current) {
                      inputRef.current.click();
                    }
                  }}
                >
                  Select from computer
                </Button>
              </div>
            )}
          {posting === "posting" && (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <Image
                src="/assets/create-post-loading.gif"
                height={120}
                width={120}
                alt="Create post loading"
              />
              <span className="text-xl text-transparent">Posting.</span>
            </div>
          )}
          {posting === "success" && (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <Image
                src="/assets/post-success.gif"
                height={120}
                width={120}
                alt="Create post loading"
              />
              <span className="text-xl">Your post has been shared.</span>
            </div>
          )}
          <input
            {...getInputProps()}
            type="file"
            className="hidden"
            ref={inputRef}
          />
        </DialogContent>
      </Dialog>
      <PostCloseConfirmation
        isConfirmOpen={isConfirmOpen}
        onConfirmClose={onConfirmClose}
        setFiles={setFiles}
      />
    </div>
  );
};
export default CreatePost;
